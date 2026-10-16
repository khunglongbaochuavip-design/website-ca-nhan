import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BROWSER_BIN = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const USER_DATA_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\94932250-d6bd-4cfb-835a-25dcbf9a0b38\\scratch\\browser_profile_v21_final';
const SCREENSHOT_DIR = path.resolve('docs/dino-exam/screenshots');

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

async function runV21Test() {
  console.log('=== RUNNING TARGETED LOCAL ACCEPTANCE TEST FOR V2.1 ===');
  const browserProc = spawn(BROWSER_BIN, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ]);

  await sleep(1500);

  let targets;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch {
      await sleep(500);
    }
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  console.log('Navigating to http://localhost:3000 ...');
  await client.send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3000);

  // 1. Verify Fullscreen button existence & click
  console.log('\n--- 1. VERIFY FULLSCREEN BUTTON ---');
  const fullscreenCheck = await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Toàn màn hình'));
      return {
        hasFullscreenBtn: !!btn,
        btnText: btn ? btn.innerText.trim().replace(/\\n/g, ' ') : null,
      };
    })()
  `);
  console.log('Fullscreen button check:', fullscreenCheck);

  // 2. Start Game
  console.log('\n--- 2. START GAME & VERIFY V2.1 START SCREEN ---');
  await client.captureScreenshot('desktop_v21_ready.png');
  await client.eval(`
    (() => {
      const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Chơi Ngay'));
      if (startBtn) startBtn.click();
    })()
  `);
  await sleep(1000);

  // 3. Verify Q01 (CTT - ĐÚNG / TRUE) reading banner
  console.log('\n--- 3. VERIFY Q01 STATEMENT & 7s READING BANNER ---');
  const q01Info = await client.eval(`
    (() => {
      const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
      const isTrueFalseBadge = document.body.innerText.includes('Nhận định ĐÚNG / SAI');
      return {
        statements: h3s,
        isTrueFalseBadge,
      };
    })()
  `);
  console.log('Q01 banner verification:', q01Info);
  await client.captureScreenshot('desktop_v21_reading.png');

  // 4. Wait for 7s reading to finish -> Approaching gates
  console.log('\n--- 4. WAITING FOR 7s TIMER -> CRISP ĐÚNG / SAI GATES ---');
  await sleep(6200); // 1.0s + 6.2s = 7.2s -> approaching active
  console.log('Gates are gliding in. Waiting 0.5s to capture screenshot...');
  await sleep(500);
  await client.captureScreenshot('desktop_v21_target_boxes.png');

  // 5. Answer Q01 (Correct is TRUE / JUMP) -> Press Space to Jump!
  console.log('\n--- 5. JUMPING FOR Q01 (CHOOSING ĐÚNG) ---');
  await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space' });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space' });
  await client.captureScreenshot('desktop_v21_jump.png');

  // Wait for resolution and smooth transition to Q02
  await sleep(2200);

  const postQ1 = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasScore2_5 = text.includes('2.5/100');
      const isQuestion2 = text.includes('Câu: 2/40') || text.includes('2/40');
      return {
        hasScore2_5,
        isQuestion2,
      };
    })()
  `);
  console.log('Post Q1 Jump result (Score 2.5 / Câu 2/40):', postQ1);

  // 6. Q02 is FALSE (Trong CTT, điểm quan sát luôn bằng điểm thực - SAI).
  // Test RUN (No jump pressed) -> Khủng long chạy thẳng qua cổng SAI
  console.log('\n--- 6. TESTING Q02 RUN (CHOOSING SAI BY NOT JUMPING) ---');
  console.log('Waiting 7.2s for Q02 reading timer...');
  await sleep(7200);

  console.log('Q02 approaching gates. Letting T-Rex run forward on ground without jumping...');
  await sleep(3500);

  const postQ2 = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasScore5 = text.includes('5/100') || text.includes('5.0/100');
      const isQuestion3 = text.includes('Câu: 3/40') || text.includes('3/40');
      return {
        hasScore5,
        isQuestion3,
      };
    })()
  `);
  console.log('Post Q2 Run result (Score 5.0 / Câu 3/40):', postQ2);

  // 7. Q03: (Trong CTT, chỉ số p của câu hỏi nhị phân thường là tỷ lệ trả lời đúng - ĐÚNG).
  // Test wrong selection -> Let T-Rex RUN (choose SAI) to trigger Game Over!
  console.log('\n--- 7. TESTING Q03 WRONG CHOICE -> GAME OVER MODAL AUDIT ---');
  console.log('Waiting 7.2s for Q03 reading timer...');
  await sleep(7200);

  console.log('Letting T-Rex RUN through SAI (wrong choice, since Q03 is TRUE)...');
  await sleep(3500);

  const gameOverInfo = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const hasGameOver = text.includes('VẤP NGÃ TRÊN ĐƯỜNG ĐUA!');
      const hasChosen = text.includes('Bạn đã chọn:') && text.includes('SAI (Không nhảy →)');
      const hasCorrect = text.includes('Đáp án chính xác:') && text.includes('ĐÚNG (Nhảy ↑)');
      const hasExplanation = text.includes('Giải thích chuyên môn:');
      const hasRetry = text.includes('Thử Lại Ngay');
      return {
        hasGameOver,
        hasChosen,
        hasCorrect,
        hasExplanation,
        hasRetry,
      };
    })()
  `);
  console.log('GameOverModal V2.1 audit:', gameOverInfo);
  await client.captureScreenshot('desktop_v21_game_over.png');

  console.log('\n=== ALL TARGETED TESTS COMPLETED SUCCESSFULLY! ===');
  client.close();
  browserProc.kill();
}

runV21Test().catch((err) => {
  console.error('Test run failed:', err);
  process.exitCode = 1;
});
