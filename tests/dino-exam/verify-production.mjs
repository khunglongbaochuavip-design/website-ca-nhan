// Script to verify Vercel Production deployment of Dino Exam Runner v2.1
const PROD_URL = 'https://huutaigenz.vercel.app/';
const MAX_ATTEMPTS = 15;
const DELAY_MS = 8000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkOnce(attempt) {
  const cacheBuster = `?_v=${Date.now()}`;
  console.log(`\n[ATTEMPT ${attempt}/${MAX_ATTEMPTS}] Fetching ${PROD_URL}${cacheBuster} ...`);
  const startTime = Date.now();
  try {
    const res = await fetch(`${PROD_URL}${cacheBuster}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    const duration = Date.now() - startTime;
    console.log(`[STATUS] HTTP ${res.status} in ${duration}ms`);
    console.log(`[HEADERS] x-vercel-id: ${res.headers.get('x-vercel-id')}`);

    if (!res.ok) {
      console.warn(`[WARN] Non-200 status code: ${res.status}`);
      return false;
    }

    const html = await res.text();
    console.log(`[BODY] Downloaded ${html.length} bytes.`);

    const titleFound = /DINO EXAM RUNNER/i.test(html);
    const badgeFound = /v2\.1/i.test(html);
    const subFound = /Kh\u1EA3o th\u00ED|Khảo thí/i.test(html);

    console.log(`[CHECK] Game Title (DINO EXAM RUNNER): ${titleFound ? 'FOUND' : 'not yet'}`);
    console.log(`[CHECK] Version Badge (v2.1): ${badgeFound ? 'FOUND' : 'not yet'}`);
    console.log(`[CHECK] Subtitle (Khảo thí): ${subFound ? 'FOUND' : 'not yet'}`);

    if (titleFound && badgeFound) {
      console.log('\n========================================');
      console.log('>>> [SUCCESS] VERCEL DEPLOYMENT IS LIVE! <<<');
      console.log('Dino Exam Runner v2.1 verified on Production!');
      console.log('========================================\n');
      return true;
    }

    return false;
  } catch (err) {
    console.error(`[ERROR] Network error:`, err.message);
    return false;
  }
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const passed = await checkOnce(attempt);
    if (passed) {
      process.exit(0);
    }
    if (attempt < MAX_ATTEMPTS) {
      console.log(`[WAIT] Waiting ${DELAY_MS / 1000}s for Vercel build to complete...`);
      await sleep(DELAY_MS);
    }
  }
  console.error('\n[TIMEOUT] Vercel build did not appear within timeout.');
  process.exit(1);
}

main();
