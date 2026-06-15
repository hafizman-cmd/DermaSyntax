/**
 * rules.ts — Centralized Rule Evaluation Engine
 *
 * ARCHITECTURAL CONTRACT:
 *   - This file imports ONLY from '@/types/skincare'. Zero UI imports.
 *   - No React, no Next.js, no Zustand references here.
 *   - All conflict/synergy logic lives exclusively in this file.
 *   - UI components MUST NOT re-implement any logic found here.
 *
 * The exported function `compileRoutineRules` is a pure function:
 *   - Same inputs always produce the same outputs.
 *   - No side-effects, no mutations.
 */
// ---------------------------------------------------------------------------
// Internal helpers — keep rule conditions readable
// ---------------------------------------------------------------------------
/** Returns true if the list contains at least one ingredient of the given category */
var hasCategory = function (list, category) { return list.some(function (i) { return i.category === category; }); };
/** Returns all ingredients matching a category from a list */
var getByCategory = function (list, category) { return list.filter(function (i) { return i.category === category; }); };
/** Returns true if the list contains more than one of the given categories (combined) */
var countAcidCategories = function (list) {
    return list.filter(function (i) { return i.category === 'AHA' || i.category === 'BHA'; }).length;
};
/** Collect IDs of ingredients matching one or more categories from a list */
var idsOf = function (list) {
    var categories = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        categories[_i - 1] = arguments[_i];
    }
    return list
        .filter(function (i) { return categories.includes(i.category); })
        .map(function (i) { return i.id; });
};
// ---------------------------------------------------------------------------
// compileRoutineRules — The public API of this module
// ---------------------------------------------------------------------------
/**
 * Evaluates a complete AM + PM routine against all known conflict and synergy
 * rules. Returns an array of `CompilationResult` diagnostics ordered by
 * severity (ERROR → WARNING → SUCCESS → INFO).
 *
 * @param amList  Ingredients currently in the AM slot
 * @param pmList  Ingredients currently in the PM slot
 * @returns       Array of diagnostic results (may be empty if routine is empty)
 */
export function compileRoutineRules(amList, pmList) {
    var results = [];
    // Skip evaluation entirely if both slots are empty
    if (amList.length === 0 && pmList.length === 0) {
        return results;
    }
    // We evaluate each slot independently for conflicts that require same-slot
    // co-occurrence, then check cross-slot synergies.
    var slots = [
        { label: 'AM', list: amList },
        { label: 'PM', list: pmList },
    ];
    for (var _i = 0, slots_1 = slots; _i < slots_1.length; _i++) {
        var _a = slots_1[_i], label = _a.label, list = _a.list;
        // ── Rule 1: Retinoid + Pure Vitamin C (same slot) ───────────────────────
        if (hasCategory(list, 'RETINOID') && hasCategory(list, 'PURE_VIT_C')) {
            results.push({
                status: 'ERROR',
                title: "[".concat(label, "] Syntax Error: Chemical Burn Risk"),
                message: 'Layering Retinoids and Pure Vitamin C concurrently destabilizes the pH ' +
                    'environments required for both, causing extreme barrier stripping. ' +
                    'Fix: Move Pure Vitamin C to AM and your Retinoid to PM.',
                targetIngredients: idsOf(list, 'RETINOID', 'PURE_VIT_C'),
            });
        }
        // ── Rule 2: Retinoid + AHA/BHA (same slot) ──────────────────────────────
        if (hasCategory(list, 'RETINOID') &&
            (hasCategory(list, 'AHA') || hasCategory(list, 'BHA'))) {
            results.push({
                status: 'ERROR',
                title: "[".concat(label, "] Over-Exfoliation Crash"),
                message: 'Combining an exfoliant acid with a cellular-turnover retinoid concurrently ' +
                    'destroys your lipid barrier. ' +
                    'Fix: Alternate nights or use your acids exclusively in the morning.',
                targetIngredients: idsOf(list, 'RETINOID', 'AHA', 'BHA'),
            });
        }
        // ── Rule 3: Benzoyl Peroxide + Retinoid Oxidation (same slot) ───────────
        if (hasCategory(list, 'ACNE_TREATMENT') && hasCategory(list, 'RETINOID')) {
            results.push({
                status: 'WARNING',
                title: "[".concat(label, "] Oxidation Warning: Neutralization"),
                message: 'Benzoyl Peroxide oxidizes and completely deactivates standard Retinol/Retinal ' +
                    'molecules, rendering your routine ineffective.',
                targetIngredients: idsOf(list, 'ACNE_TREATMENT', 'RETINOID'),
            });
        }
        // ── Rule 4: Multiple Acid Stacking (same slot) ───────────────────────────
        if (countAcidCategories(list) > 1) {
            results.push({
                status: 'WARNING',
                title: "[".concat(label, "] Acid Stack Warning"),
                message: 'Combining multiple leave-on hydroxy acids simultaneously triggers severe ' +
                    'redness, peeling, and contact dermatitis. Consider alternating days instead.',
                targetIngredients: idsOf(list, 'AHA', 'BHA'),
            });
        }
        // ── Rule 5: Pure Vitamin C + AHA/BHA (same slot) ────────────────────────
        if (hasCategory(list, 'PURE_VIT_C') &&
            (hasCategory(list, 'AHA') || hasCategory(list, 'BHA'))) {
            results.push({
                status: 'WARNING',
                title: "[".concat(label, "] Low pH Irritation Warning"),
                message: 'Both pure Vitamin C and chemical exfoliants require highly acidic conditions. ' +
                    'Layering them spikes skin acidity, causing severe stinging.',
                targetIngredients: idsOf(list, 'PURE_VIT_C', 'AHA', 'BHA'),
            });
        }
    }
    // ── Rule 6: Retinoid + Niacinamide Synergy (PM slot only) ─────────────────
    var niacinamideInPm = getByCategory(pmList, 'BRIGHTENER').some(function (i) { return i.id === 'niacinamide'; });
    if (hasCategory(pmList, 'RETINOID') && niacinamideInPm) {
        results.push({
            status: 'SUCCESS',
            title: '[PM] Optimized Stack: Barrier Shield',
            message: 'Niacinamide upregulates natural ceramide production, acting as a perfect buffer ' +
                'against the dry, peeling side-effects of Retinoids.',
            targetIngredients: idsOf(pmList, 'RETINOID', 'BRIGHTENER'),
        });
    }
    // ── Rule 7: Vitamin C + Ferulic Acid Synergy (AM slot only) ───────────────
    if (hasCategory(amList, 'PURE_VIT_C') && hasCategory(amList, 'ANTIOXIDANT')) {
        results.push({
            status: 'SUCCESS',
            title: '[AM] Supercharged Antioxidant Synergy',
            message: 'Ferulic acid acts as a stabilizing agent that doubles the photoprotective ' +
                'efficacy and lifespan of your Vitamin C.',
            targetIngredients: idsOf(amList, 'PURE_VIT_C', 'ANTIOXIDANT'),
        });
    }
    // ── Rule 8: Baseline — no errors or warnings detected ─────────────────────
    var hasIssue = results.some(function (r) { return r.status === 'ERROR' || r.status === 'WARNING'; });
    if (!hasIssue) {
        results.push({
            status: 'SUCCESS',
            title: 'Build Successful',
            message: 'Your routine syntax is valid. Skin barrier is secure.',
            targetIngredients: [],
        });
    }
    return results;
}
