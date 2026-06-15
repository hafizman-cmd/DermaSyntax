/**
 * run-tests.js — Verification Script
 * Simulates user routine building and checks if compilation results match requirements.
 */

const { INGREDIENTS } = require('./data/ingredients');
const { compileRoutineRules } = require('./data/rules');

// Helper to look up an ingredient by ID
const findIng = (id) => {
  const ing = INGREDIENTS.find((i) => i.id === id);
  if (!ing) throw new Error(`Ingredient not found: ${id}`);
  return ing;
};

const runTest = (name, amIds, pmIds, expectedStatus, expectedSnippet) => {
  const amList = amIds.map(findIng);
  const pmList = pmIds.map(findIng);

  const results = compileRoutineRules(amList, pmList);
  console.log(`\n==================================================`);
  console.log(`TEST: ${name}`);
  console.log(`AM: [${amIds.join(', ')}]`);
  console.log(`PM: [${pmIds.join(', ')}]`);
  console.log(`--------------------------------------------------`);

  const matchingResult = results.find((r) => r.status === expectedStatus);

  if (!matchingResult) {
    console.error(`❌ FAILED: Expected compilation result with status "${expectedStatus}" not found.`);
    console.error(`Actual results:`, JSON.stringify(results, null, 2));
    process.exit(1);
  }

  if (expectedSnippet && !matchingResult.message.includes(expectedSnippet) && !matchingResult.title.includes(expectedSnippet)) {
    console.error(`❌ FAILED: Found status "${expectedStatus}", but message does not contain snippet: "${expectedSnippet}"`);
    console.error(`Actual result:`, matchingResult);
    process.exit(1);
  }

  console.log(`✅ PASSED: Found "${expectedStatus}" match.`);
  console.log(`Title: ${matchingResult.title}`);
  console.log(`Message: ${matchingResult.message}`);
};

// ── Test Cases ─────────────────────────────────────────────────────────────

// 1. Retinoid + Pure Vit C (Error)
runTest(
  'Retinoid + Pure Vit C in same slot (PM)',
  [],
  ['retinol', 'l-ascorbic-acid'],
  'ERROR',
  'Chemical Burn Risk'
);

// 2. Retinoid + AHA/BHA (Error)
runTest(
  'Retinoid + AHA in same slot (PM)',
  [],
  ['retinol', 'glycolic-acid'],
  'ERROR',
  'Over-Exfoliation Crash'
);

// 3. Benzoyl Peroxide + Retinoid (Warning)
runTest(
  'Benzoyl Peroxide + Retinoid in same slot (PM)',
  [],
  ['benzoyl-peroxide', 'retinol'],
  'WARNING',
  'Oxidation Warning: Neutralization'
);

// 4. Multiple Acid Stacking (Warning)
runTest(
  'Multiple acids in same slot (PM)',
  [],
  ['glycolic-acid', 'salicylic-acid'],
  'WARNING',
  'Acid Stack Warning'
);

// 5. Pure Vit C + AHA/BHA (Warning)
runTest(
  'Pure Vit C + AHA in same slot (AM)',
  ['l-ascorbic-acid', 'glycolic-acid'],
  [],
  'WARNING',
  'Low pH Irritation Warning'
);

// 6. Retinoid + Niacinamide (Success Synergy)
runTest(
  'Retinoid + Niacinamide synergy in PM',
  [],
  ['retinol', 'niacinamide'],
  'SUCCESS',
  'Optimized Stack: Barrier Shield'
);

// 7. Vitamin C + Ferulic (Success Synergy)
runTest(
  'Pure Vitamin C + Ferulic synergy in AM',
  ['l-ascorbic-acid', 'ferulic-acid'],
  [],
  'SUCCESS',
  'Supercharged Antioxidant Synergy'
);

// 8. Baseline Build Successful
runTest(
  'Clean routine (Vit C AM, Retinol PM)',
  ['l-ascorbic-acid'],
  ['retinol'],
  'SUCCESS',
  'Build Successful'
);

console.log(`\n==================================================`);
console.log(`🎉 ALL TESTS PASSED SUCCESSFULLY!`);
console.log(`==================================================`);
