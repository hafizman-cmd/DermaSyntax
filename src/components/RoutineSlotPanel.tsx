'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Ingredient, RoutineSlot } from '@/types/skincare';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Trash2, Sun, Moon, Target } from 'lucide-react';

interface RoutineSlotPanelProps {
  slot: RoutineSlot;
  ingredients: Ingredient[];
}

export default function RoutineSlotPanel({ slot, ingredients }: RoutineSlotPanelProps) {
  const [isOver, setIsOver] = useState(false);
  const addIngredient = useRoutineStore((state) => state.addIngredient);
  const removeIngredient = useRoutineStore((state) => state.removeIngredient);
  const results = useRoutineStore((state) => state.compilationResults);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    try {
      // Cross-lane transfer: payload carries { item, sourceLane, index }
      const plainData = e.dataTransfer.getData('text/plain');
      if (plainData) {
        const parsed = JSON.parse(plainData) as { item: Ingredient; sourceLane: RoutineSlot; index: number };
        if (parsed.item && parsed.sourceLane && parsed.sourceLane !== slot) {
          removeIngredient(parsed.item.id, parsed.sourceLane);
          addIngredient(parsed.item, slot);
          return;
        }
      }
      // Arsenal drag: payload is a bare Ingredient (copy, no source removal)
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const ingredient = JSON.parse(jsonData) as Ingredient;
        addIngredient(ingredient, slot);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isTargetedByError = (id: string) =>
    results.some((r) => r.status === 'ERROR' && r.targetIngredients?.includes(id));
  const isTargetedByWarning = (id: string) =>
    results.some((r) => r.status === 'WARNING' && r.targetIngredients?.includes(id));
  const isTargetedBySuccess = (id: string) =>
    results.some((r) => r.status === 'SUCCESS' && r.targetIngredients?.includes(id));

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      /* UPGRADED: Added backdrop-blur-md globally and swapped bg-white/80 to translucent bg-white/70 */
      className={`flex flex-1 flex-col rounded-xl border p-6 transition-all duration-500 relative overflow-hidden backdrop-blur-md shadow-sm ${isOver
        ? 'border-slate-400 dark:border-slate-500 bg-zinc-100 dark:bg-white/[0.06] shadow-inner'
        : 'border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03]'
        }`}
    >

      {/* ── HIGH-FIDELITY INTERACTIVE BLUEPRINT GRID OVERLAY ── */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.04] transition-colors duration-300 bg-zinc-900 dark:bg-zinc-100"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#050505_75%)] opacity-10 dark:opacity-60" />
            <div className="absolute top-3 left-3 text-zinc-500 dark:text-white"><Target className="h-3 w-3 stroke-[2.5]" /></div>
            <div className="absolute top-3 right-3 text-zinc-500 dark:text-white"><Target className="h-3 w-3 stroke-[2.5]" /></div>
            <div className="absolute bottom-3 left-3 text-zinc-500 dark:text-white"><Target className="h-3 w-3 stroke-[2.5]" /></div>
            <div className="absolute bottom-3 right-3 text-zinc-500 dark:text-white"><Target className="h-3 w-3 stroke-[2.5]" /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Header Content Area */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          {slot === 'AM' ? (
            <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
          )}
          <span className="text-xs font-black tracking-widest text-black dark:text-white uppercase">
            {slot === 'AM' ? 'AM ROUTINE' : 'PM ROUTINE'}
          </span>
        </div>
        <span className="text-[10px] tracking-wider text-black dark:text-white uppercase font-bold">
          {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Active Formula List Viewport */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto relative z-10 custom-scrollbar">
        {ingredients.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 p-8 text-center bg-white/[0.02] transition-colors duration-300">
            <span className="text-[11px] text-black dark:text-white font-extrabold tracking-wide uppercase">
              Empty routine slot
            </span>
            <span className="mt-1 text-[10px] text-zinc-800 dark:text-zinc-300 font-medium">
              Drag elements here or select to mount
            </span>
          </div>
        ) : (
          ingredients.map((ingredient, index) => {
            const hasErr = isTargetedByError(ingredient.id);
            const hasWarn = isTargetedByWarning(ingredient.id);
            const hasSuccess = isTargetedBySuccess(ingredient.id);

            let borderStyle = 'border-white/10';
            if (hasErr) {
              borderStyle = 'border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-950/20';
            } else if (hasWarn) {
              borderStyle = 'border-amber-600 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/20';
            } else if (hasSuccess) {
              borderStyle = 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/20';
            }

            const stepNumber = String(index + 1).padStart(2, '0');
            const hasVariants = ingredient.variants && ingredient.variants.length > 0;
            const displayName = hasVariants
              ? 'Ceramide Complex (Multi-Lipid Blend)'
              : ingredient.name;

            return (
              <div
                key={ingredient.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ item: ingredient, sourceLane: slot, index }));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className={`group flex items-center justify-between rounded-xl border bg-white/[0.04] backdrop-blur-md p-4 transition-all duration-300 cursor-grab active:cursor-grabbing ${borderStyle}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">

                  <div className="flex flex-col items-center justify-center shrink-0 border-r border-slate-600 pr-4 min-w-[2.5rem] select-none">
                    <span className="text-[7px] font-black tracking-[0.15em] text-black dark:text-white uppercase">
                      Step
                    </span>
                    <span className="text-xs font-mono font-black tracking-wider text-black dark:text-white mt-0.5">
                      {stepNumber}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-black dark:text-white truncate">
                        {displayName}
                      </span>
                      {hasErr && (
                        <span className="rounded border-2 border-red-700 bg-red-100 px-1.5 py-0.25 text-[8px] font-black tracking-widest text-red-800 dark:border-red-400 dark:bg-red-950/40 dark:text-red-400 uppercase">
                          Conflict
                        </span>
                      )}
                      {hasWarn && (
                        <span className="rounded border-2 border-amber-700 bg-amber-100 px-1.5 py-0.25 text-[8px] font-black tracking-widest text-amber-800 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-400 uppercase">
                          Caution
                        </span>
                      )}
                      {hasSuccess && (
                        <span className="rounded border-2 border-emerald-700 bg-emerald-100 px-1.5 py-0.25 text-[8px] font-black tracking-widest text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-400 uppercase">
                          Synergy
                        </span>
                      )}
                    </div>
                    {hasVariants && (
                      <div className="flex flex-wrap gap-1">
                        {ingredient.variants!.map((variant, vi) => (
                          <span
                            key={vi}
                            className="rounded-md border border-slate-600 bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-zinc-700 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.8)] dark:text-zinc-300 dark:shadow-[2px_2px_4px_rgba(0,0,0,0.4),-1px_-1px_3px_rgba(255,255,255,0.06)]"
                          >
                            {variant}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] tracking-wider text-zinc-900 dark:text-zinc-400 uppercase font-bold">
                      {ingredient.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeIngredient(ingredient.id, slot)}
                  className="rounded-lg p-1.5 text-black hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800 transition-all shrink-0 ml-2"
                  title="Remove from routine"
                >
                  <Trash2 className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}