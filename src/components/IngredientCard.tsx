'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ingredient } from '@/types/skincare';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Sun, Moon, Info } from 'lucide-react';

interface IngredientCardProps {
  ingredient: Ingredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const addIngredient = useRoutineStore((state) => state.addIngredient);
  const amRoutine = useRoutineStore((state) => state.amRoutine);
  const pmRoutine = useRoutineStore((state) => state.pmRoutine);
  const skinType = useRoutineStore((state) => state.skinType);
  const openDrawer = useRoutineStore((state) => state.openDrawer);

  const inAM = amRoutine?.some((i) => i.id === ingredient.id) || false;
  const inPM = pmRoutine?.some((i) => i.id === ingredient.id) || false;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const injectToSlot = (slot: 'AM' | 'PM') => {
    if (addIngredient) {
      (addIngredient as any)(ingredient, slot);
    }
  };

  const getCompatibility = (): 'RECOMMENDED' | 'AVOID' | 'NEUTRAL' => {
    if (!skinType) return 'NEUTRAL';
    const profile = skinType.toUpperCase();
    const category = ingredient.category;
    const name = ingredient.name.toLowerCase();

    if (profile === 'OILY') {
      if (category === 'BHA' || name.includes('niacinamide') || name.includes('azelaic')) return 'RECOMMENDED';
    }
    if (profile === 'DRY') {
      if (category === 'BARRIER_REPAIR' || category === 'HUMECTANT' || name.includes('lactic')) return 'RECOMMENDED';
      if (category === 'BHA' || name.includes('benzoyl')) return 'AVOID';
    }
    if (profile === 'SENSITIVE') {
      if (name.includes('centella') || name.includes('cica') || name.includes('panthenol')) return 'RECOMMENDED';
      if (category === 'PURE_VIT_C' || name.includes('glycolic') || name.includes('tretinoin')) return 'AVOID';
    }
    return 'NEUTRAL';
  };

  const compatibility = getCompatibility();

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart as any}
      /* UPGRADED: Applied high visibility dark:border-white shadow offsets */
      className="group relative cursor-grab active:cursor-grabbing rounded-xl border-2 border-black bg-white dark:border-white dark:bg-zinc-950/40 p-4 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-extrabold text-black dark:text-white tracking-wide transition-colors duration-300">
            {ingredient.name}
          </h4>
          <p className="mt-1 text-[10px] text-zinc-900 font-medium dark:text-zinc-300 leading-relaxed line-clamp-2 transition-colors duration-300">
            {ingredient.description}
          </p>
        </div>

        <button
          onClick={() => openDrawer?.(ingredient)}
          className="p-1 rounded-md border border-transparent text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shrink-0"
        >
          <Info className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-900 border border-black dark:border-white transition-colors duration-300">
          {ingredient.category}
        </span>

        {compatibility === 'RECOMMENDED' && (
          <span className="text-[8px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 border-2 border-emerald-700 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-400 dark:text-emerald-400 transition-colors duration-300">
            Recommended
          </span>
        )}
        {compatibility === 'AVOID' && (
          <span className="text-[8px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-rose-100 border-2 border-rose-700 text-rose-900 dark:bg-rose-950/30 dark:border-rose-400 dark:text-rose-400 transition-colors duration-300">
            Avoid
          </span>
        )}
      </div>

      <div className="mt-3.5 pt-3 border-t-2 border-black dark:border-white flex items-center justify-between gap-2 lg:hidden transition-colors duration-300">
        <span className="text-[8px] font-mono font-black tracking-widest text-black dark:text-white uppercase transition-colors duration-300">
          Quick Inject:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => injectToSlot('AM')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border-2 text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${inAM
              ? 'border-amber-600 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950/20 dark:text-amber-400'
              : 'border-black bg-white text-black dark:border-white dark:bg-zinc-900/50 dark:text-white active:bg-zinc-100'
              }`}
          >
            <Sun className="h-2.5 w-2.5 stroke-[2.5]" />
            <span>AM {inAM && '✓'}</span>
          </button>

          <button
            onClick={() => injectToSlot('PM')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border-2 text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${inPM
              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:border-indigo-400 dark:bg-indigo-950/20 dark:text-indigo-400'
              : 'border-black bg-white text-black dark:border-white dark:bg-zinc-900/50 dark:text-white active:bg-zinc-100'
              }`}
          >
            <Moon className="h-2.5 w-2.5 stroke-[2.5]" />
            <span>PM {inPM && '✓'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}