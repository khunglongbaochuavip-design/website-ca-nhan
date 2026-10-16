import fs from 'fs';
import path from 'path';
import { DINO_QUESTIONS_V2, TOTAL_QUESTIONS, POINTS_PER_QUESTION, MAX_SCORE } from '../../lib/dino-exam/questions.ts';

function runValidationAndExport() {
  console.log('=== VERIFYING DINO EXAM RUNNER V2.1 QUESTION BANK (40 TRUE/FALSE QUESTIONS) ===');
  let errors = 0;

  if (TOTAL_QUESTIONS !== 40) {
    console.error(`FAIL: Expected 40 questions, got ${TOTAL_QUESTIONS}`);
    errors++;
  } else {
    console.log(`PASS: Total questions = 40`);
  }

  if (MAX_SCORE !== 100) {
    console.error(`FAIL: Expected max score 100, got ${MAX_SCORE}`);
    errors++;
  } else {
    console.log(`PASS: Max score = 100 (40 questions x 2.5 pts)`);
  }

  const seenIds = new Set();
  const choiceCounts = { JUMP: 0, RUN: 0 };
  const booleanCounts = { true: 0, false: 0 };
  const domains = new Set();

  DINO_QUESTIONS_V2.forEach((q, idx) => {
    const qNum = idx + 1;
    const expectedId = `Q${qNum < 10 ? '0' + qNum : qNum}`;

    if (q.id !== expectedId) {
      console.error(`FAIL [${q.id}]: Expected ID ${expectedId}`);
      errors++;
    }
    if (seenIds.has(q.id)) {
      console.error(`FAIL [${q.id}]: Duplicate ID ${q.id}`);
      errors++;
    }
    seenIds.add(q.id);

    if (!q.domain || q.domain.trim() === '') {
      console.error(`FAIL [${q.id}]: Empty domain`);
      errors++;
    }
    domains.add(q.domain);

    if (!q.statement || q.statement.trim() === '') {
      console.error(`FAIL [${q.id}]: Empty statement`);
      errors++;
    }

    if (typeof q.correctAnswer !== 'boolean') {
      console.error(`FAIL [${q.id}]: correctAnswer is not boolean (${typeof q.correctAnswer})`);
      errors++;
    }
    booleanCounts[q.correctAnswer ? 'true' : 'false']++;

    const expectedChoice = q.correctAnswer ? 'JUMP' : 'RUN';
    if (q.correctChoice !== expectedChoice) {
      console.error(`FAIL [${q.id}]: Mismatch! correctAnswer=${q.correctAnswer} but correctChoice=${q.correctChoice}`);
      errors++;
    }
    choiceCounts[q.correctChoice]++;

    if (!q.explanation || q.explanation.trim() === '') {
      console.error(`FAIL [${q.id}]: Missing explanation`);
      errors++;
    }
  });

  console.log(`Boolean distribution: TRUE = ${booleanCounts.true}, FALSE = ${booleanCounts.false}`);
  console.log(`Choice distribution: JUMP = ${choiceCounts.JUMP}, RUN = ${choiceCounts.RUN}`);

  if (booleanCounts.true === 20 && booleanCounts.false === 20 && choiceCounts.JUMP === 20 && choiceCounts.RUN === 20) {
    console.log('PASS: Exactly 20 TRUE (JUMP) and 20 FALSE (RUN) questions.');
  } else {
    console.error('FAIL: Choice distribution not 20/20 balanced!');
    errors++;
  }

  console.log(`Total unique domains covered: ${domains.size}`);

  // Export JSON
  const jsonPath = path.resolve('docs/dino-exam/questions_v2.json');
  fs.writeFileSync(jsonPath, JSON.stringify(DINO_QUESTIONS_V2, null, 2), 'utf8');
  console.log(`Exported JSON: ${jsonPath}`);

  // Export CSV (UTF-8 BOM)
  const csvHeaders = 'ID,Domain,Statement,CorrectAnswer,CorrectChoice,Explanation\n';
  const csvRows = DINO_QUESTIONS_V2.map((q) => {
    const esc = (s) => `"${(s || '').replace(/"/g, '""')}"`;
    return [
      q.id,
      esc(q.domain),
      esc(q.statement),
      q.correctAnswer ? 'TRUE' : 'FALSE',
      q.correctChoice,
      esc(q.explanation),
    ].join(',');
  }).join('\n');

  const csvPath = path.resolve('docs/dino-exam/questions_v2.csv');
  fs.writeFileSync(csvPath, '\ufeff' + csvHeaders + csvRows, 'utf8');
  console.log(`Exported CSV: ${csvPath}`);

  if (errors > 0) {
    console.error(`\nFAILED: Found ${errors} validation errors!`);
    process.exit(1);
  } else {
    console.log('\n=== ALL 40 TRUE/FALSE QUESTIONS PASSED 100% VERIFICATION! ===\n');
  }
}

runValidationAndExport();
