'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ingredient } from '@/types/skincare';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Info } from 'lucide-react';

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
      className="group relative cursor-grab active:cursor-grabbing rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 transition-all duration-300 hover:bg-white/[0.06] select-none"
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
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 transition-colors duration-300">
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

      <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
        <button
          onClick={(e) => {
            e.stopPropagation();
            injectToSlot('AM');
          }}
          className="font-mono text-[9px] font-bold uppercase tracking-wider text-center border border-zinc-800 dark:border-white/10 hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 py-1.5 rounded transition-all"
        >
          + AM{inAM && ' \u2713'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            injectToSlot('PM');
          }}
          className="font-mono text-[9px] font-bold uppercase tracking-wider text-center border border-zinc-800 dark:border-white/10 hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 py-1.5 rounded transition-all"
        >
          + PM{inPM && ' \u2713'}
        </button>
      </div>
    </motion.div>
  );
}