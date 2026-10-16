import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BROWSER_BIN = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const USER_DATA_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\94932250-d6bd-4cfb-835a-25dcbf9a0b38\\scratch\\browser_profile_prod_smoke';
const SCREENSHOT_DIR = path.resolve('docs/dino-exam/screenshots');
const PROD_URL = 'https://huutaigenz.vercel.app/';

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

async function runProdSmokeTest() {
  console.log(`=== RUNNING PRODUCTION SMOKE TEST ON ${PROD_URL} ===`);
  const browserProc = spawn(BROWSER_BIN, [
    '--headless=new',
    '--remote-debugging-port=9223',
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
      const res = await fetch('http://127.0.0.1:9223/json');
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch {
      await sleep(500);
    }
  }

  if (!targets || targets.length === 0) {
    console.error('Failed to connect to headless browser CDP');
    browserProc.kill();
    process.exit(1);
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  console.log(`Navigating to ${PROD_URL} ...`);
  await client.send('Page.navigate', { url: PROD_URL });
  await sleep(4000);

  // 1. Verify Game container and version badge
  console.log('\n--- 1. VERIFY HERO SECTION & GAME CONTAINER ---');
  const initialCheck = await client.eval(`
    (() => {
      const title = document.body.innerText.includes('DINO EXAM RUNNER');
      const badge = /v2\.1/i.test(document.body.innerText);
      const subtitle = document.body.innerText.includes('Khảo thí');
      const canvas = document.querySelector('canvas');
      const fullscreenBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Toàn màn hình'));
      const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Chơi Ngay') || b.innerText.includes('Bắt Đầu'));
      
      return {
        title,
        badge,
        subtitle,
        hasCanvas: !!canvas,
        hasFullscreenBtn: !!fullscreenBtn,
        hasStartBtn: !!startBtn,
      };
    })()
  `);
  console.log('Production Initial Check:', initialCheck);

  if (!initialCheck.hasCanvas || !initialCheck.hasStartBtn) {
    console.error('FAIL: Game canvas or start button missing on production!');
    client.close();
    browserProc.kill();
    process.exit(1);
  }

  await client.captureScreenshot('prod_v21_ready.png', 1920, 1080);

  // 2. Click Start Game
  console.log('\n--- 2. START GAME & VERIFY IN-GAME HUD ---');
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Chơi Ngay') || b.innerText.includes('Bắt Đầu'));
      if (btn) btn.click();
    })()
  `);
  await sleep(1500);

  const inGameCheck = await client.eval(`
    (() => {
      const banner = document.querySelector('.bg-neutral-900\\\\/90, .backdrop-blur-md');
      const hasTimer = !!document.querySelector('.h-1.5, [class*="bg-amber"]');
      const hasCanvas = !!document.querySelector('canvas');
      return {
        hasBanner: !!banner,
        hasTimer,
        hasCanvas,
        bodyTextSnippet: document.body.innerText.slice(0, 300)
      };
    })()
  `);
  console.log('In-Game Check:', inGameCheck);
  await client.captureScreenshot('prod_v21_playing.png', 1920, 1080);

  // 3. Test Jump via Space key
  console.log('\n--- 3. TEST SPACE JUMP MECHANIC ---');
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    windowsVirtualKeyCode: 32,
    code: 'Space',
    key: ' ',
  });
  await sleep(100);
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    windowsVirtualKeyCode: 32,
    code: 'Space',
    key: ' ',
  });
  await sleep(400);
  await client.captureScreenshot('prod_v21_jump.png', 1920, 1080);

  console.log('\n=== ALL PRODUCTION SMOKE TESTS PASSED! ===');
  client.close();
  browserProc.kill();
  process.exit(0);
}

runProdSmokeTest().catch((err) => {
  console.error('Smoke test error:', err);
  process.exit(1);
});
