import { DINO_QUEST_QUESTIONS, TOTAL_WORLDS, MAX_QUEST_SCORE } from '../../lib/dino-quest/questions.ts';
import { DINO_QUEST_WORLDS } from '../../lib/dino-quest/worlds.ts';

console.log('=== VERIFYING DINO QUEST V1.0 QUESTION BANK & WORLDS ===');

let errors = 0;

if (DINO_QUEST_QUESTIONS.length !== 10) {
  console.error(`FAIL: Expected 10 questions, found ${DINO_QUEST_QUESTIONS.length}`);
  errors++;
} else {
  console.log(`PASS: Found exactly ${TOTAL_WORLDS} questions.`);
}

if (DINO_QUEST_WORLDS.length !== 10) {
  console.error(`FAIL: Expected 10 worlds, found ${DINO_QUEST_WORLDS.length}`);
  errors++;
} else {
  console.log(`PASS: Found exactly ${DINO_QUEST_WORLDS.length} worlds.`);
}

const expectedAnswers = {
  Q01: 'B',
  Q02: 'D',
  Q03: 'A',
  Q04: 'C',
  Q05: 'B',
  Q06: 'D',
  Q07: 'A',
  Q08: 'C',
  Q09: 'B',
  Q10: 'D',
};

DINO_QUEST_QUESTIONS.forEach((q, idx) => {
  const world = DINO_QUEST_WORLDS[idx];
  console.log(`\n[Question ${idx + 1}] ID: ${q.id} | Domain: ${q.domain} | World: ${world.name}`);
  
  if (!q.stem || q.stem.trim().length === 0) {
    console.error(`  FAIL: Missing question stem`);
    errors++;
  }

  const choices = ['A', 'B', 'C', 'D'];
  choices.forEach((c) => {
    if (!q.options[c] || q.options[c].trim().length === 0) {
      console.error(`  FAIL: Missing option ${c}`);
      errors++;
    }
  });

  const expectedCorrect = expectedAnswers[q.id];
  if (q.correctOption !== expectedCorrect) {
    console.error(`  FAIL: Incorrect answer mapping. Expected ${expectedCorrect}, got ${q.correctOption}`);
    errors++;
  } else {
    console.log(`  PASS: Correct Option [${q.correctOption}] matches expected`);
  }

  if (!q.explanation || q.explanation.trim().length < 20) {
    console.error(`  FAIL: Missing or incomplete explanation`);
    errors++;
  } else {
    console.log(`  PASS: Scientific explanation present (${q.explanation.length} chars)`);
  }
});

console.log(`\nMax Quest Score: ${MAX_QUEST_SCORE} points (10 pts/question).`);

if (errors === 0) {
  console.log('\n>>> ALL 10 QUESTIONS AND WORLDS PASSED 100% VERIFICATION! <<<');
  process.exitCode = 0;
} else {
  console.error(`\nFAILED WITH ${errors} ERRORS`);
  process.exitCode = 1;
}
