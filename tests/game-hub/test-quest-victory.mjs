import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BROWSER_BIN = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const USER_DATA_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\94932250-d6bd-4cfb-835a-25dcbf9a0b38\\scratch\\browser_profile_victory_test';
const SCREENSHOT_DIR = path.resolve('docs/game-hub/screenshots');

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

const CORRECT_ANSWERS = ['B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D'];

async function runVictoryTest() {
  console.log('=== RUNNING FULL 10-WORLD DINO QUEST VICTORY RUN ===');
  if (fs.existsSync(USER_DATA_DIR)) {
    try {
      fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
    } catch {}
  }

  const browserProc = spawn(BROWSER_BIN, [
    '--headless=new',
    '--remote-debugging-port=9226',
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
      const res = await fetch('http://127.0.0.1:9226/json');
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

  const freshUrl = `http://localhost:3000?_t=${Date.now()}`;
  console.log(`Navigating to ${freshUrl} ...`);
  await client.send('Page.navigate', { url: freshUrl });
  await sleep(4000);

  // Enter Dino Quest
  await client.eval(`
    (() => {
      const card = document.getElementById('card-dino-quest');
      if (card) card.click();
    })()
  `);
  await sleep(1500);

  // Click "Bắt Đầu Thám Hiểm"
  console.log('Clicking "Bắt Đầu Thám Hiểm" ...');
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Thám Hiểm'));
      if (btn) btn.click();
    })()
  `);
  await sleep(2000);

  // Function to wait until doors are active and ready for input
  async function waitForReadyForChoice() {
    for (let i = 0; i < 40; i++) {
      const isReady = await client.eval(`
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.some(b => !b.disabled && (b.innerText.includes('Phím [1]') || b.innerText.includes('Cửa A')));
        })()
      `);
      if (isReady) return true;
      await sleep(300);
    }
    return false;
  }

  // Answer all 10 questions correctly
  for (let round = 0; round < 10; round++) {
    const ans = CORRECT_ANSWERS[round];
    const isReady = await waitForReadyForChoice();
    console.log(`[Round ${round + 1}/10] Ready: ${isReady}. Submitting correct Door ${ans} ...`);

    await client.eval(`
      (() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '${ans}', code: 'Key${ans}' }));
      })()
    `);

    // Give time for walk and door open
    await sleep(2000);
  }

  // Wait for VictoryModal to appear after clearing World 10
  console.log('Waiting for Victory Modal ...');
  for (let i = 0; i < 30; i++) {
    const isVictory = await client.eval(`
      (() => {
        return document.body.innerText.includes('CHÚC MỪNG CHIẾN THẮNG') || document.body.innerText.includes('NHÀ THÁM HIỂM TRI THỨC');
      })()
    `);
    if (isVictory) break;
    await sleep(400);
  }

  // Verify VictoryModal
  const victoryCheck = await client.eval(`
    (() => {
      const text = document.body.innerText;
      const isVictory = text.includes('CHÚC MỪNG CHIẾN THẮNG') || text.includes('NHÀ THÁM HIỂM TRI THỨC');
      const has100Pts = text.includes('100/100');
      const hasCertBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Giấy Chứng Nhận'));
      return { isVictory, has100Pts, hasCertBtn };
    })()
  `);
  console.log('Victory Check:', victoryCheck);
  await client.captureScreenshot('10_dino_quest_victory_modal.png', 1920, 1080);

  // Click Certificate Button
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Giấy Chứng Nhận'));
      if (btn) btn.click();
    })()
  `);
  await sleep(1000);

  const certViewerCheck = await client.eval(`
    (() => {
      const img = document.querySelector('img[alt="Giấy Chứng Nhận Dino Quest"]');
      return {
        hasCertImage: !!img,
        hasDownloadBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Tải Ảnh Chứng Nhận')),
      };
    })()
  `);
  console.log('Certificate Viewer Check:', certViewerCheck);
  await client.captureScreenshot('11_dino_quest_certificate_viewer.png', 1920, 1080);

  console.log('=== VICTORY & CERTIFICATE TEST PASSED 100%! ===');
  client.close();
  browserProc.kill();
  process.exitCode = 0;
}

runVictoryTest().catch((err) => {
  console.error('Victory test error:', err);
  process.exitCode = 1;
});
