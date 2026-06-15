/**
 * useRoutineStore.ts — Global Application State (Zustand)
 */

import { create } from 'zustand';
import type { CompilationResult, Ingredient, RoutineSlot } from '@/types/skincare';
import { compileRoutineRules } from '@/data/rules';

const LAYER_WEIGHTS: Record<Ingredient['category'], number> = {
  AHA: 1,
  BHA: 1,
  PURE_VIT_C: 1,
  VIT_C_DERIVATIVE: 2,
  ANTIOXIDANT: 2,
  BRIGHTENER: 2,
  HUMECTANT: 2,
  ACNE_TREATMENT: 3,
  RETINOID: 3,
  BARRIER_REPAIR: 4,
};

interface RoutineState {
  amRoutine: Ingredient[];
  pmRoutine: Ingredient[];
  skinType: string | null;
  compilationResults: CompilationResult[];
  /** Track the active asset loaded into the inspect drawer viewport */
  selectedDrawerIngredient: Ingredient | null;

  setSkinType: (type: string | null) => void;
  addIngredient: (ingredient: Ingredient, slot?: RoutineSlot) => void;
  removeIngredient: (id: string, slot: RoutineSlot) => void;
  clearAll: () => void;
  /** Open inspect drawer targeting an asset node */
  openDrawer: (ingredient: Ingredient) => void;
  /** Retract the inspect panel view boundary */
  closeDrawer: () => void;
}

function recompile(
  amRoutine: Ingredient[],
  pmRoutine: Ingredient[]
): CompilationResult[] {
  return compileRoutineRules(amRoutine, pmRoutine);
}

export const useRoutineStore = create<RoutineState>((set) => ({
  amRoutine: [],
  pmRoutine: [],
  skinType: null,
  compilationResults: [],
  selectedDrawerIngredient: null, // Default resting closed state

  setSkinType: (type) => set({ skinType: type }),

  openDrawer: (ingredient) => set({ selectedDrawerIngredient: ingredient }),
  closeDrawer: () => set({ selectedDrawerIngredient: null }),

  addIngredient: (ingredient, slot) =>
    set((state) => {
      let targetSlot: RoutineSlot = slot || (ingredient.defaultTime === 'BOTH' ? 'AM' : ingredient.defaultTime);

      if (!slot && ingredient.defaultTime === 'BOTH') {
        const alreadyInAM = state.amRoutine.some((i) => i.id === ingredient.id);
        if (alreadyInAM) targetSlot = 'PM';
      }

      const key = targetSlot === 'AM' ? 'amRoutine' : 'pmRoutine';
      const currentList = state[key];

      if (currentList.some((i) => i.id === ingredient.id)) {
        return state;
      }

      const newList = [...currentList, ingredient].sort(
        (a, b) => LAYER_WEIGHTS[a.category] - LAYER_WEIGHTS[b.category]
      );

      const nextAm = targetSlot === 'AM' ? newList : state.amRoutine;
      const nextPm = targetSlot === 'PM' ? newList : state.pmRoutine;

      return {
        [key]: newList,
        compilationResults: recompile(nextAm, nextPm),
      };
    }),

  removeIngredient: (id, slot) =>
    set((state) => {
      const key = slot === 'AM' ? 'amRoutine' : 'pmRoutine';
      const newList = state[key].filter((i) => i.id !== id);
      const nextAm = slot === 'AM' ? newList : state.amRoutine;
      const nextPm = slot === 'PM' ? newList : state.pmRoutine;

      return {
        [key]: newList,
        compilationResults: recompile(nextAm, nextPm),
      };
    }),

  clearAll: () =>
    set({
      amRoutine: [],
      pmRoutine: [],
      compilationResults: [],
    }),
}));