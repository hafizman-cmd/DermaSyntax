/**
 * useRoutineStore.ts — Global Application State (Zustand)
 *
 * ARCHITECTURAL CONTRACT:
 *   - This store is the ONLY bridge between the rule engine and the UI.
 *   - UI components must NEVER call `compileRoutineRules` directly.
 *   - `compilationResults` is a computed property derived inside the store
 *     and exposed as part of the state snapshot — NOT computed inside a
 *     render function or component tree.
 *
 * Drag-and-drop manual override:
 *   - `addIngredient(ingredient, slot)` accepts an explicit `slot` argument,
 *     allowing the drag handler to override the ingredient's `defaultTime`.
 *   - The rule engine sees the actual slot placement and flags conflicts
 *     immediately, which is the intended behaviour for manual overrides.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { create } from 'zustand';
import { compileRoutineRules } from '@/data/rules';
// ---------------------------------------------------------------------------
// Internal helper — recomputes diagnostics from the updated arrays
// This runs inside every mutating action, NOT in the component tree.
// ---------------------------------------------------------------------------
function recompile(amRoutine, pmRoutine) {
    return compileRoutineRules(amRoutine, pmRoutine);
}
// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------
export var useRoutineStore = create(function (set) { return ({
    amRoutine: [],
    pmRoutine: [],
    compilationResults: [],
    addIngredient: function (ingredient, slot) {
        return set(function (state) {
            var _a;
            var key = slot === 'AM' ? 'amRoutine' : 'pmRoutine';
            var currentList = state[key];
            // Guard against duplicates within the same slot
            if (currentList.some(function (i) { return i.id === ingredient.id; })) {
                return state; // no-op — already present
            }
            var newList = __spreadArray(__spreadArray([], currentList, true), [ingredient], false);
            var nextAm = slot === 'AM' ? newList : state.amRoutine;
            var nextPm = slot === 'PM' ? newList : state.pmRoutine;
            return _a = {},
                _a[key] = newList,
                _a.compilationResults = recompile(nextAm, nextPm),
                _a;
        });
    },
    removeIngredient: function (id, slot) {
        return set(function (state) {
            var _a;
            var key = slot === 'AM' ? 'amRoutine' : 'pmRoutine';
            var newList = state[key].filter(function (i) { return i.id !== id; });
            var nextAm = slot === 'AM' ? newList : state.amRoutine;
            var nextPm = slot === 'PM' ? newList : state.pmRoutine;
            return _a = {},
                _a[key] = newList,
                _a.compilationResults = recompile(nextAm, nextPm),
                _a;
        });
    },
    clearAll: function () {
        return set({
            amRoutine: [],
            pmRoutine: [],
            compilationResults: [],
        });
    },
}); });
