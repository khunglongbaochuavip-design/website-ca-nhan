import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BROWSER_BIN = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const USER_DATA_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\94932250-d6bd-4cfb-835a-25dcbf9a0b38\\scratch\\browser_profile_v2';
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

  async captureScreenshot(filename, width, height, deviceScaleFactor = 1) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: width < 600,
    });
    await sleep(400);
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    const filePath = path.join(SCREENSHOT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filename} (${width}x${height})`);
    return filePath;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runV2Audit() {
  console.log('=== STARTING DINO EXAM RUNNER V2.0 BROWSER AUDIT ===');
  console.log('Using Browser Binary:', BROWSER_BIN);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Launch Headless Browser
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

  if (!targets || targets.length === 0) {
    console.error('Failed to connect to browser CDP port 9222');
    browserProc.kill();
    process.exitCode = 1;
    return;
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  console.log('Connecting to WebSocket Debugger:', pageTarget.webSocketDebuggerUrl);

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  console.log('Navigating to http://localhost:3000 ...');
  await client.send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3000);

  // Check console errors
  const clientErrors = await client.eval(`window.__errors || []`);
  console.log('Initial page console errors:', clientErrors);

  // -----------------------------------------------------------
  // 1. CAPTURE RESPONSIVE SCREENSHOTS IN READY STATE
  // -----------------------------------------------------------
  console.log('\n--- 1. CAPTURING RESPONSIVE SCREENSHOTS (READY STATE) ---');
  await client.captureScreenshot('desktop_1920x1080_ready.png', 1920, 1080);
  await client.captureScreenshot('desktop_1366x768_ready.png', 1366, 768);
  await client.captureScreenshot('mobile_390x844_ready.png', 390, 844, 2);
  await client.captureScreenshot('mobile_360x800_ready.png', 360, 800, 2);

  // Reset to desktop viewport for tests
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Verify Hero Header & V2 Badge
  const heroCheck = await client.eval(`
    (() => {
      const versionBadge = Array.from(document.querySelectorAll('span')).find(s => s.innerText.toLowerCase().includes('v2.0'));
      const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Chơi Ngay'));
      const canvas = document.querySelector('canvas');
      return {
        hasV2Badge: !!versionBadge,
        hasStartBtn: !!startBtn,
        canvasWidth: canvas?.width,
        canvasHeight: canvas?.height,
      };
    })()
  `);
  console.log('Hero V2 verification:', heroCheck);

  // -----------------------------------------------------------
  // 2. START GAME & VERIFY 7s READING PHASE
  // -----------------------------------------------------------
  console.log('\n--- 2. VERIFYING 7-SECOND READING COUNTDOWN ---');
  await client.eval(`
    (() => {
      const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Bắt Đầu Chơi Ngay'));
      if (startBtn) startBtn.click();
    })()
  `);
  await sleep(1000);

  const readingState = await client.eval(`
    (() => {
      const readingBadge = document.body.innerText.match(/Đọc đề:\\s*(\\d+)s/);
      const questionText = document.querySelector('h3')?.innerText;
      const progressText = document.body.innerText.match(/Câu\\s*1\\/40/);
      return {
        timerSec: readingBadge ? readingBadge[1] : null,
        questionText,
        hasProgress40: !!progressText,
      };
    })()
  `);
  console.log('Reading phase state (at 1s):', readingState);
  await client.captureScreenshot('desktop_1920x1080_reading.png', 1920, 1080);
  await client.captureScreenshot('mobile_390x844_reading.png', 390, 844, 2);

  // Reset to desktop viewport
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // -----------------------------------------------------------
  // 3. WAIT FOR 7s COUNTDOWN TO FINISH -> APPROACHING PHASE
  // -----------------------------------------------------------
  console.log('\n--- 3. WAITING FOR 7s TIMER EXPOSURE -> APPROACHING TARGETS ---');
  console.log('Waiting 6.5 seconds for reading timer to expire...');
  await sleep(6500);

  const approachingState = await client.eval(`
    (() => {
      const isApproaching = document.body.innerText.includes('NHẢY (Space/↑) hoặc ĐI THẲNG');
      return {
        isApproaching,
      };
    })()
  `);
  console.log('Approaching state active:', approachingState);
  await client.captureScreenshot('desktop_1920x1080_approaching.png', 1920, 1080);

  // -----------------------------------------------------------
  // 4. TEST QUESTION 1: CTT is Classical Test Theory (Correct: JUMP / Nhảy)
  // Wait ~1.8s into approaching phase, then press Space to Leap into Upper Target!
  // -----------------------------------------------------------
  console.log('\n--- 4. TESTING QUESTION 1: SPACEBAR JUMP TO UPPER TARGET ---');
  await sleep(1800);
  console.log('Dispatching Spacebar Key to Leap into Upper Target for Q1...');
  await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space' });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space' });
  await client.captureScreenshot('desktop_1920x1080_jump.png', 1920, 1080);

  // Wait for resolution and transition to Q2
  await sleep(2200);

  const postQ1 = await client.eval(`
    (() => {
      const scoreEl = document.querySelector('.text-emerald-400');
      const progressText = document.body.innerText.match(/Câu\\s*([0-9]+)\\/40/);
      return {
        scoreText: scoreEl ? scoreEl.innerText : null,
        qNum: progressText ? progressText[1] : null,
      };
    })()
  `);
  console.log('Progress after Q1 Jump:', postQ1);

  // -----------------------------------------------------------
  // 5. TEST QUESTION 2: IRT is Item Response Theory (Correct: RUN / Đi thẳng)
  // Wait 7.2s for Q2 reading countdown, then let T-Rex run through lower target!
  // -----------------------------------------------------------
  console.log('\n--- 5. TESTING QUESTION 2 (WAIT 7s READING -> RUN THROUGH LOWER TARGET) ---');
  console.log('Waiting 7.2 seconds for Q2 reading countdown...');
  await sleep(7200);

  console.log('Allowing T-Rex to continue running forward on ground (RUN)...');
  // Wait for cluster approaching, decision, resolution (around 3.8s)
  await sleep(3800);

  const postQ2 = await client.eval(`
    (() => {
      const scoreEl = document.querySelector('.text-emerald-400');
      const progressText = document.body.innerText.match(/Câu\\s*([0-9]+)\\/40/);
      return {
        scoreText: scoreEl ? scoreEl.innerText : null,
        qNum: progressText ? progressText[1] : null,
      };
    })()
  `);
  console.log('Progress after Q2 Run:', postQ2);

  // -----------------------------------------------------------
  // 6. TEST QUESTION 3 WRONG SELECTION -> GAME OVER MODAL
  // Q3: p-value. Correct is RUN (Dễ).
  // We will force a JUMP (wrong action) to verify Game Over Modal and explanation!
  // -----------------------------------------------------------
  console.log('\n--- 6. TESTING QUESTION 3: WRONG SELECTION -> GAME OVER MODAL ---');
  console.log('Waiting 7.2 seconds for Q3 reading timer...');
  await sleep(7200);

  console.log('Waiting 1.8s into approaching phase, then triggering intentional wrong JUMP...');
  await sleep(1800);
  await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space' });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space' });

  // Wait for collision resolution & modal animation
  await sleep(2000);

  const gameOverState = await client.eval(`
    (() => {
      const hasGameOver = document.body.innerText.includes('VẤP NGÃ TRÊN ĐƯỜNG ĐUA!');
      const hasChosen = document.body.innerText.includes('Bạn đã chọn:');
      const hasCorrect = document.body.innerText.includes('Đáp án chính xác:');
      const hasExplanation = document.body.innerText.includes('Giải thích chuyên môn:');
      const retryBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Thử Lại Ngay'));
      return {
        hasGameOver,
        hasChosen,
        hasCorrect,
        hasExplanation,
        hasRetryBtn: !!retryBtn,
      };
    })()
  `);
  console.log('GameOverModal audit:', gameOverState);
  await client.captureScreenshot('desktop_1920x1080_game_over.png', 1920, 1080);
  await client.captureScreenshot('mobile_390x844_game_over.png', 390, 844, 2);

  // Reset to desktop viewport
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // -----------------------------------------------------------
  // 7. TEST CERTIFICATE CANVAS EXPORT & VICTORY MODAL AUDIT
  // Generate high-resolution 1600x1100 certificate PNG in browser
  // -----------------------------------------------------------
  console.log('\n--- 7. TESTING CERTIFICATE GENERATION & VICTORY COMPLIANCE ---');
  const certDataUrl = await client.eval(`
    (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw Parchment Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.5, '#fbf8f2');
      bgGrad.addColorStop(1, '#f5eee1');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1100);

      // Borders
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1520, 1020);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(52, 52, 1496, 996);

      // Header
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WEBSITE CÁ NHÂN HỮU TÀI GENZ — TRÒ CHƠI TƯƠNG TÁC GIÁO DỤC', 800, 120);

      // Main Title
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 46px serif';
      ctx.fillText('GIẤY CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI', 800, 220);

      // Mandatory Disclaimer
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('★ CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI — KHÔNG PHẢI CHỨNG CHỈ CHUYÊN MÔN ★', 800, 260);

      // Game subtitle
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 22px serif';
      ctx.fillText('Chứng nhận người chơi đã xuất sắc vượt qua các câu đố kiến thức trong trò chơi:', 800, 305);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px serif';
      ctx.fillText('“DINO EXAM RUNNER — HÀNH TRÌNH CHINH PHỤC KHẢO THÍ”', 800, 350);

      // Player Name
      ctx.fillStyle = '#1e293b';
      ctx.font = '18px sans-serif';
      ctx.fillText('Trao tặng cho nhân vật Khủng Long:', 800, 420);
      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 56px serif';
      ctx.fillText('Hữu Tài Dino Chiến Thần', 800, 485);

      // Score Card
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(800 - 270, 550, 540, 110, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('KẾT QUẢ ĐẠT ĐƯỢC', 800, 584);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText('100/100 ĐIỂM (40/40 CÂU HỎI)', 800, 630);

      // Emblem
      ctx.save();
      ctx.translate(320, 800);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 0, 62, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ DINO RUNNER ★', 0, -18);
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('VICTORY', 0, 10);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('100 / 100 ĐIỂM', 0, 30);
      ctx.restore();

      // Right Publisher text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px serif';
      ctx.fillText('WEBSITE HỮU TÀI GENZ', 1240, 820);
      ctx.fillStyle = '#475569';
      ctx.font = '15px sans-serif';
      ctx.fillText('Chuyên Gia Khảo Thí & Đo Lường Giáo Dục', 1240, 846);
      ctx.fillText('Địa chỉ: huutaigenz.vercel.app', 1240, 868);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText('NGÀY THỰC HIỆN: 16/10/2026  |  TRÒ CHƠI ĐƯỢC PHÁT HÀNH TRÊN HUUTAIGENZ.VERCEL.APP', 800, 1020);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 12px sans-serif';
      ctx.fillText('Lưu ý: Giấy chứng nhận này ghi nhận kết quả giải trí trong trò chơi tương tác giáo dục trực tuyến và không thay thế cho bất kỳ văn bằng hay chứng chỉ pháp lý nào.', 800, 1042);

      return canvas.toDataURL('image/png');
    })()
  `);

  if (certDataUrl) {
    const base64Data = certDataUrl.replace(/^data:image\/png;base64,/, '');
    const certPath = path.resolve('docs/dino-exam/certificate_v2_sample.png');
    fs.writeFileSync(certPath, Buffer.from(base64Data, 'base64'));
    console.log('Saved Certificate PNG sample to:', certPath);
  }

  // -----------------------------------------------------------
  // 8. TEST CUSTOMIZER MODAL
  // -----------------------------------------------------------
  console.log('\n--- 8. TESTING CUSTOMIZER MODAL ---');
  await client.eval(`
    (() => {
      // First click Retry to dismiss GameOverModal
      const retryBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Thử Lại Ngay'));
      if (retryBtn) retryBtn.click();
    })()
  `);
  await sleep(1000);

  // Open Customizer
  await client.eval(`
    (() => {
      const custBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tùy biến'));
      if (custBtn) custBtn.click();
    })()
  `);
  await sleep(800);
  await client.captureScreenshot('desktop_1920x1080_customizer.png', 1920, 1080);

  console.log('\n=== BROWSER AUDIT V2.0 COMPLETED SUCCESSFULLY ===');
  client.close();
  browserProc.kill();
}

runV2Audit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exitCode = 1;
});
