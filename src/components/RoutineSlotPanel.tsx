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
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const ingredient = JSON.parse(dataStr) as Ingredient;
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
      className={`flex flex-1 flex-col rounded-2xl border bg-zinc-900/20 p-6 transition-all duration-500 relative overflow-hidden ${isOver
          ? 'border-zinc-700 bg-zinc-950/10 shadow-[0_0_30px_rgba(255,255,255,0.01)]'
          : 'border-zinc-900'
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
            {/* Laser Tech Blueprint Matrix Grid Sheet */}
            <div
              className="absolute inset-0 opacity-[0.04] transition-colors duration-300 bg-zinc-100"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Ambient Radial Depth Shading */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#050505_75%)] opacity-60" />

            {/* Glowing Crosshair Targets in Corners */}
            <div className="absolute top-3 left-3 text-zinc-700/60"><Target className="h-3 w-3 text-zinc-500/30" /></div>
            <div className="absolute top-3 right-3 text-zinc-700/60"><Target className="h-3 w-3 text-zinc-500/30" /></div>
            <div className="absolute bottom-3 left-3 text-zinc-700/60"><Target className="h-3 w-3 text-zinc-500/30" /></div>
            <div className="absolute bottom-3 right-3 text-zinc-700/60"><Target className="h-3 w-3 text-zinc-500/30" /></div>

            {/* Continuous Vertical Laser Scanner Beam sweep */}
            <motion.div
              animate={{ y: ['-5%', '105%', '-5%'] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* ────────────────────────────────────────────────────── */}

      {/* Panel Header Content Area */}
      <div className="mb-6 flex items-center justify-between border-b border-zinc-900 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          {slot === 'AM' ? (
            <Sun className="h-4 w-4 text-zinc-400" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-400" />
          )}
          <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            {slot === 'AM' ? 'AM ROUTINE' : 'PM ROUTINE'}
          </span>
        </div>
        <span className="text-[10px] tracking-wider text-zinc-500 uppercase font-medium">
          {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Active Formula List Viewport */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto relative z-10 custom-scrollbar">
        {ingredients.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-8 text-center bg-zinc-950/10 transition-colors duration-300">
            <span className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase">
              Empty routine slot
            </span>
            <span className="mt-1 text-[10px] text-zinc-600">
              Drag elements here or select to mount
            </span>
          </div>
        ) : (
          ingredients.map((ingredient, index) => {
            const hasErr = isTargetedByError(ingredient.id);
            const hasWarn = isTargetedByWarning(ingredient.id);
            const hasSuccess = isTargetedBySuccess(ingredient.id);

            let borderStyle = 'border-zinc-900 hover:border-zinc-800';
            if (hasErr) {
              borderStyle = 'border-red-950 bg-red-950/5 hover:border-red-900/50';
            } else if (hasWarn) {
              borderStyle = 'border-amber-950 bg-amber-950/5 hover:border-amber-900/50';
            } else if (hasSuccess) {
              borderStyle = 'border-emerald-950 bg-emerald-950/5 hover:border-emerald-900/50';
            }

            const stepNumber = String(index + 1).padStart(2, '0');

            return (
              <div
                key={ingredient.id}
                className={`group flex items-center justify-between rounded-xl border bg-zinc-950/40 backdrop-blur-md p-4 transition-all duration-300 ${borderStyle}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">

                  {/* Sequence Step Gauge Indicator Dial */}
                  <div className="flex flex-col items-center justify-center shrink-0 border-r border-zinc-900/80 pr-4 min-w-[2.5rem] select-none">
                    <span className="text-[7px] font-bold tracking-[0.15em] text-zinc-600 group-hover:text-zinc-500 uppercase transition-colors duration-300">
                      Step
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 mt-0.5">
                      {stepNumber}
                    </span>
                  </div>

                  {/* Chemical Label Metadata */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {ingredient.name}
                      </span>
                      {hasErr && (
                        <span className="rounded border border-red-900/50 bg-red-950/20 px-1.5 py-0.25 text-[8px] font-semibold tracking-widest text-red-400 uppercase">
                          Conflict
                        </span>
                      )}
                      {hasWarn && (
                        <span className="rounded border border-amber-900/50 bg-amber-950/20 px-1.5 py-0.25 text-[8px] font-semibold tracking-widest text-amber-400 uppercase">
                          Caution
                        </span>
                      )}
                      {hasSuccess && (
                        <span className="rounded border border-emerald-900/50 bg-emerald-950/20 px-1.5 py-0.25 text-[8px] font-semibold tracking-widest text-emerald-400 uppercase">
                          Synergy
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] tracking-wider text-zinc-500 uppercase font-medium">
                      {ingredient.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeIngredient(ingredient.id, slot)}
                  className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300 transition-colors shrink-0 ml-2"
                  title="Remove from routine"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}