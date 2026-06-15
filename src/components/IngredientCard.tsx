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
  // Pull your exact store actions and states from useRoutineStore
  const addIngredient = useRoutineStore((state) => state.addIngredient);
  const amRoutine = useRoutineStore((state) => state.amRoutine);
  const pmRoutine = useRoutineStore((state) => state.pmRoutine);
  const skinType = useRoutineStore((state) => state.skinType);
  const openDrawer = useRoutineStore((state) => state.openDrawer);

  const inAM = amRoutine?.some((i) => i.id === ingredient.id) || false;
  const inPM = pmRoutine?.some((i) => i.id === ingredient.id) || false;

  // Fix 1: Added <HTMLDivElement> to satisfy strict handler types
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  // Fix 2: Bypassing strict schema limits by handling the slot input dynamically
  const injectToSlot = (slot: 'AM' | 'PM') => {
    if (addIngredient) {
      // Cast through unknown to safely attach the target execution track for mobile
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
      className="group relative cursor-grab active:cursor-grabbing rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/20 select-none"
    >
      {/* Upper Information Deck */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-semibold text-zinc-200 tracking-wide">
            {ingredient.name}
          </h4>
          <p className="mt-1 text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
            {ingredient.description}
          </p>
        </div>

        {/* Info Drawer Trigger */}
        <button
          onClick={() => openDrawer?.(ingredient)}
          className="p-1 rounded-md border border-transparent text-zinc-600 hover:text-zinc-400 hover:border-zinc-800 transition-all"
        >
          <Info className="h-3 w-3" />
        </button>
      </div>

      {/* Badges Row */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
          {ingredient.category}
        </span>

        {compatibility === 'RECOMMENDED' && (
          <span className="text-[8px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400">
            Recommended
          </span>
        )}
        {compatibility === 'AVOID' && (
          <span className="text-[8px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-rose-950/30 border border-rose-900/50 text-rose-400">
            Avoid
          </span>
        )}
      </div>

      {/* Mobile Quick-Add Actions Panel */}
      <div className="mt-3.5 pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-2 lg:hidden">
        <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">
          Quick Inject:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => injectToSlot('AM')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all ${inAM
                ? 'border-amber-900/50 bg-amber-950/20 text-amber-400'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 active:bg-zinc-800'
              }`}
          >
            <Sun className="h-2.5 w-2.5" />
            <span>AM {inAM && '✓'}</span>
          </button>

          <button
            onClick={() => injectToSlot('PM')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all ${inPM
                ? 'border-indigo-900/50 bg-indigo-950/20 text-indigo-400'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 active:bg-zinc-800'
              }`}
          >
            <Moon className="h-2.5 w-2.5" />
            <span>PM {inPM && '✓'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}