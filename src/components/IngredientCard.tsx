'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Ingredient } from '@/types/skincare';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Sun, Moon, Layers, Info } from 'lucide-react';

interface IngredientCardProps {
  ingredient: Ingredient;
}

// CRITICAL: This line must say "export default function" so page.tsx can resolve it
export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const addIngredient = useRoutineStore((state) => state.addIngredient);
  const amRoutine = useRoutineStore((state) => state.amRoutine);
  const pmRoutine = useRoutineStore((state) => state.pmRoutine);
  const skinType = useRoutineStore((state) => state.skinType);
  const openDrawer = useRoutineStore((state) => state.openDrawer);

  const inAM = amRoutine.some((i) => i.id === ingredient.id);
  const inPM = pmRoutine.some((i) => i.id === ingredient.id);

  const handleSingleClick = () => {
    addIngredient(ingredient);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
    e.dataTransfer.effectAllowed = 'copyMove';
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
      if (name.includes('centella') || name.includes('cica') || name.includes('panthenol') || name.includes('peptides')) return 'RECOMMENDED';
      if (category === 'PURE_VIT_C' || name.includes('glycolic') || name.includes('tretinoin')) return 'AVOID';
    }
    if (profile === 'COMBINATION') {
      if (name.includes('niacinamide') || category === 'HUMECTANT' || category === 'VIT_C_DERIVATIVE') return 'RECOMMENDED';
    }
    if (profile === 'NORMAL') {
      if (category === 'ANTIOXIDANT' || category === 'VIT_C_DERIVATIVE' || category === 'HUMECTANT') return 'RECOMMENDED';
    }
    return 'NEUTRAL';
  };

  const compatibility = getCompatibility();

  let interactionStyle = 'hover:border-zinc-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]';
  if (compatibility === 'RECOMMENDED') {
    interactionStyle = 'hover:border-emerald-800/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]';
  } else if (compatibility === 'AVOID') {
    interactionStyle = 'hover:border-red-800/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]';
  }

  const categoryLabels: Record<Ingredient['category'], string> = {
    RETINOID: 'Retinoid',
    AHA: 'AHA Exfoliant',
    BHA: 'BHA Exfoliant',
    PURE_VIT_C: 'Pure Vitamin C',
    VIT_C_DERIVATIVE: 'Vitamin C Derivative',
    ANTIOXIDANT: 'Antioxidant',
    BRIGHTENER: 'Brightener',
    ACNE_TREATMENT: 'Acne Treatment',
    HUMECTANT: 'Humectant',
    BARRIER_REPAIR: 'Barrier Repair',
  };

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart as any}
      onClick={handleSingleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`clinical-card group relative flex cursor-grab flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 select-none active:cursor-grabbing transition-colors duration-300 ${interactionStyle} ${inAM && inPM ? 'opacity-30 pointer-events-none' : ''
        }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xs font-semibold text-zinc-100 group-hover:text-zinc-50 transition-colors truncate max-w-[10rem]">
            {ingredient.name}
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDrawer(ingredient);
              }}
              className="p-1 rounded-md border border-zinc-900/60 bg-zinc-950/40 text-zinc-600 hover:text-zinc-300 hover:border-zinc-800 transition-all duration-200"
              title="Inspect chemical parameters"
            >
              <Info className="h-3 w-3" />
            </button>
            <span className="flex items-center gap-1 text-[10px] text-zinc-600">
              {ingredient.defaultTime === 'AM' && <Sun className="h-3 w-3 text-zinc-500 group-hover:text-amber-400/50 transition-colors" />}
              {ingredient.defaultTime === 'PM' && <Moon className="h-3 w-3 text-zinc-500 group-hover:text-indigo-400/50 transition-colors" />}
              {ingredient.defaultTime === 'BOTH' && <Layers className="h-3 w-3 text-zinc-500 group-hover:text-zinc-400 transition-colors" />}
            </span>
          </div>
        </div>

        <p className="line-clamp-2 text-[11px] leading-relaxed text-zinc-400">
          {ingredient.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-zinc-900 bg-zinc-950/20 px-2 py-0.5 text-[9px] font-medium tracking-wider text-zinc-400 uppercase">
            {categoryLabels[ingredient.category]}
          </span>

          {compatibility === 'RECOMMENDED' && (
            <span className="rounded border border-emerald-950 bg-emerald-950/20 px-1.5 py-0.5 text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
              Match
            </span>
          )}
          {compatibility === 'AVOID' && (
            <span className="rounded border border-red-950 bg-red-950/20 px-1.5 py-0.5 text-[8px] font-bold tracking-widest text-red-400 uppercase">
              Avoid
            </span>
          )}
        </div>

        <div className="flex gap-1 text-[9px] tracking-wider font-semibold uppercase">
          {inAM && <span className="rounded bg-zinc-900 px-1.5 py-0.25 text-zinc-400 border border-zinc-850">AM</span>}
          {inPM && <span className="rounded bg-zinc-900 px-1.5 py-0.25 text-zinc-400 border border-zinc-850">PM</span>}
        </div>
      </div>
    </motion.div>
  );
}