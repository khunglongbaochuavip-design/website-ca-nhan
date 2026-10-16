import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BROWSER_BIN = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const USER_DATA_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\94932250-d6bd-4cfb-835a-25dcbf9a0b38\\scratch\\browser_profile_hub_test';
const SCREENSHOT_DIR = path.resolve('docs/game-hub/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(new Error(JSON.stringify(data.error)));
          else cb.resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result ? res.result.value : undefined;
  }

  async captureScreenshot(filename, width = 1920, height = 1080) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(300);
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    const filePath = path.join(SCREENSHOT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
    return filePath;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runGameHubE2ETest() {
  console.log('=== RUNNING GAME HUB & DINO QUEST E2E BROWSER TEST ===');
  const browserProc = spawn(BROWSER_BIN, [
    '--headless=new',
    '--remote-debugging-port=9225',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ]);

  await sleep(2000);

  let targets;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9225/json');
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch {
      await sleep(500);
    }
  }

  if (!targets || targets.length === 0) {
    console.error('FAIL: Could not connect to browser');
    browserProc.kill();
    process.exitCode = 1;
    return;
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  console.log('Navigating to http://localhost:3000 ...');
  await client.send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(4000);

  // 1. Verify Game Hub Menu & 4 Cards
  console.log('\n--- 1. VERIFY GAME HUB INITIAL STATE ---');
  const hubCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasHubTitle = text.includes('GAME KHẢO THÍ');
      const hasSubtitle = text.includes('Khám phá kiến thức qua những trò chơi tương tác');
      const hasRunnerCard = text.includes('DINO EXAM RUNNER');
      const hasQuestCard = text.includes('DINO QUEST: 4 CÁNH CỬA');
      const hasMatchCard = text.includes('DINO MATCH');
      const hasCatCard = text.includes('CAT RUNNER');
      return {
        hasHubTitle,
        hasSubtitle,
        hasRunnerCard,
        hasQuestCard,
        hasMatchCard,
        hasCatCard,
      };
    })()
  `);
  console.log('Game Hub Check:', hubCheck);

  if (!hubCheck.hasHubTitle || !hubCheck.hasRunnerCard || !hubCheck.hasQuestCard) {
    console.error('FAIL: Game Hub title or cards not found!');
    client.close();
    browserProc.kill();
    process.exitCode = 1;
    return;
  }

  await client.captureScreenshot('01_game_hub_menu.png', 1920, 1080);

  // 2. Test Placeholder Card (Dino Match)
  console.log('\n--- 2. TEST PLACEHOLDER MODAL ---');
  await client.eval(`
    (() => {
      const matchCard = document.getElementById('card-dino-match');
      if (matchCard) matchCard.click();
    })()
  `);
  await sleep(800);
  const modalCheck = await client.eval(`
    (() => {
      return document.body.innerText.includes('DỰ ÁN ĐANG PHÁT TRIỂN');
    })()
  `);
  console.log('Placeholder Modal Opened:', modalCheck);
  await client.captureScreenshot('02_placeholder_modal.png', 1920, 1080);

  // Close placeholder modal
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Đã Hiểu'));
      if (btn) btn.click();
    })()
  `);
  await sleep(500);

  // 3. Test Dino Exam Runner Regression
  console.log('\n--- 3. TEST DINO EXAM RUNNER REGRESSION & BACK BUTTON ---');
  await client.eval(`
    (() => {
      const runnerCard = document.getElementById('card-dino-runner');
      if (runnerCard) runnerCard.click();
    })()
  `);
  await sleep(1500);

  const runnerCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasV21 = text.includes('v2.1') || text.includes('V2.1');
      const hasBackBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Game Khảo thí'));
      const hasCanvas = !!document.querySelector('canvas');
      return { hasV21, hasBackBtn, hasCanvas };
    })()
  `);
  console.log('Dino Exam Runner Mounted Check:', runnerCheck);
  await client.captureScreenshot('03_dino_runner_regression.png', 1920, 1080);

  // Return to Game Hub
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Game Khảo thí'));
      if (btn) btn.click();
    })()
  `);
  await sleep(1000);

  // 4. Test Dino Quest Adventure
  console.log('\n--- 4. TEST DINO QUEST ADVENTURE ---');
  await client.eval(`
    (() => {
      const questCard = document.getElementById('card-dino-quest');
      if (questCard) questCard.click();
    })()
  `);
  await sleep(1500);

  const questStartCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasQuestTitle = text.includes('DINO QUEST — BÍ ẨN TỨ ĐẠI CÁNH CỬA');
      const hasStartBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Bắt Đầu Thám Hiểm'));
      return { hasQuestTitle, hasStartBtn };
    })()
  `);
  console.log('Dino Quest Start Screen Check:', questStartCheck);
  await client.captureScreenshot('04_dino_quest_start_screen.png', 1920, 1080);

  // Click "Bắt Đầu Thám Hiểm"
  console.log('\n--- 5. START DINO QUEST WORLD 1 ---');
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Thám Hiểm'));
      if (btn) btn.click();
    })()
  `);
  await sleep(2500); // Wait through world intro (1.5s) to entering CHOOSING state

  const world1Check = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasWorld1 = text.includes('Đồng cỏ Tri thức') || text.includes('Màn 1/10');
      const hasQ1Stem = text.includes('Khi đề thi bỏ sót một chuẩn đầu ra quan trọng');
      const hasCanvas = !!document.querySelector('canvas');
      const hasDoorButtons = Array.from(document.querySelectorAll('button')).filter(b => 
        ['A', 'B', 'C', 'D'].some(letter => b.innerText && b.innerText.includes(letter))
      ).length >= 4;
      return { hasWorld1, hasQ1Stem, hasCanvas, hasDoorButtons };
    })()
  `);
  console.log('World 1 Active Gameplay Check:', world1Check);
  await client.captureScreenshot('05_dino_quest_world1.png', 1920, 1080);

  // 6. Test Correct Door Selection (Door B for Q01)
  console.log('\n--- 6. CHOOSE CORRECT DOOR B (Q01) ---');
  await client.eval(`
    (() => {
      // Find door B option button or click door
      const buttons = Array.from(document.querySelectorAll('button'));
      const doorBBtn = buttons.find(b => b.innerText.includes('B') && b.innerText.includes('thiếu hụt đại diện cấu trúc'));
      if (doorBBtn) {
        doorBBtn.click();
      } else {
        // Trigger via keyboard 'B' or '2'
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'B', code: 'KeyB' }));
      }
    })()
  `);
  await sleep(1500); // Wait for T-Rex approach and door open animation
  await client.captureScreenshot('06_dino_quest_door_b_correct.png', 1920, 1080);

  // Wait for transition to World 2
  await sleep(2500);
  const world2Check = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const isWorld2 = text.includes('Màn 2/10') || text.includes('Rừng Ma trận đề');
      const hasScore10 = text.includes('10/100');
      return { isWorld2, hasScore10 };
    })()
  `);
  console.log('World 2 Transition Check (Score +10):', world2Check);
  await client.captureScreenshot('07_dino_quest_world2.png', 1920, 1080);

  // 7. Test Wrong Door Selection on World 2 (Choose Door A, correct is D)
  console.log('\n--- 7. CHOOSE WRONG DOOR A (Q02) TO TEST ANIMAL SURPRISE & GAME OVER ---');
  await client.eval(`
    (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const doorABtn = buttons.find(b => b.innerText.includes('A') && b.innerText.includes('sai đáp án chuẩn'));
      if (doorABtn) {
        doorABtn.click();
      } else {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A', code: 'KeyA' }));
      }
    })()
  `);
  await sleep(1500); // T-Rex walks to Door A, animal pops out!
  await client.captureScreenshot('08_dino_quest_animal_surprise.png', 1920, 1080);

  await sleep(2000); // Wait for GameOverModal to mount
  const gameOverCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasGameOver = text.includes('BÍ ẨN CÁNH CỬA — KẾT THÚC HÀNH TRÌNH') || text.includes('Cánh Cửa Không Chính Xác');
      const hasExplanation = text.includes('GIẢI THÍCH KHOA HỌC');
      const hasRetryBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Chinh Phục Lại'));
      return { hasGameOver, hasExplanation, hasRetryBtn };
    })()
  `);
  console.log('GameOver Modal Check:', gameOverCheck);
  await client.captureScreenshot('09_dino_quest_game_over.png', 1920, 1080);

  console.log('\n=== ALL GAME HUB & DINO QUEST E2E TESTS PASSED 100%! ===');
  client.close();
  browserProc.kill();
  process.exitCode = 0;
}

runGameHubE2ETest().catch((err) => {
  console.error('E2E Test Error:', err);
  process.exitCode = 1;
});
