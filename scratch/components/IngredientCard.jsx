'use client';
import React from 'react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Sun, Moon, Layers } from 'lucide-react';
export default function IngredientCard(_a) {
    var ingredient = _a.ingredient;
    var addIngredient = useRoutineStore(function (state) { return state.addIngredient; });
    var amRoutine = useRoutineStore(function (state) { return state.amRoutine; });
    var pmRoutine = useRoutineStore(function (state) { return state.pmRoutine; });
    var inAM = amRoutine.some(function (i) { return i.id === ingredient.id; });
    var inPM = pmRoutine.some(function (i) { return i.id === ingredient.id; });
    var handleSingleClick = function () {
        if (ingredient.defaultTime === 'BOTH') {
            // For BOTH, auto-route to AM first, or if already in AM, auto-route to PM
            if (!inAM) {
                addIngredient(ingredient, 'AM');
            }
            else if (!inPM) {
                addIngredient(ingredient, 'PM');
            }
        }
        else {
            addIngredient(ingredient, ingredient.defaultTime);
        }
    };
    var handleDragStart = function (e) {
        e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
        e.dataTransfer.effectAllowed = 'copyMove';
    };
    // Category colour mapping for UI badges
    var categoryStyles = {
        RETINOID: { label: 'Retinoid', bg: 'bg-purple-950/60 border-purple-500/30', text: 'text-purple-300' },
        AHA: { label: 'AHA Exfoliant', bg: 'bg-amber-950/60 border-amber-500/30', text: 'text-amber-300' },
        BHA: { label: 'BHA Exfoliant', bg: 'bg-orange-950/60 border-orange-500/30', text: 'text-orange-300' },
        PURE_VIT_C: { label: 'Pure Vit C', bg: 'bg-yellow-950/60 border-yellow-500/30', text: 'text-yellow-300' },
        VIT_C_DERIVATIVE: { label: 'Vit C Deriv', bg: 'bg-yellow-900/40 border-yellow-600/20', text: 'text-yellow-200' },
        ANTIOXIDANT: { label: 'Antioxidant', bg: 'bg-cyan-950/60 border-cyan-500/30', text: 'text-cyan-300' },
        BRIGHTENER: { label: 'Brightener', bg: 'bg-pink-950/60 border-pink-500/30', text: 'text-pink-300' },
        ACNE_TREATMENT: { label: 'Acne Treat', bg: 'bg-red-950/60 border-red-500/30', text: 'text-red-300' },
        HUMECTANT: { label: 'Humectant', bg: 'bg-blue-950/60 border-blue-500/30', text: 'text-blue-300' },
        BARRIER_REPAIR: { label: 'Barrier Rep', bg: 'bg-emerald-950/60 border-emerald-500/30', text: 'text-emerald-300' },
    };
    var style = categoryStyles[ingredient.category];
    return (<div draggable onDragStart={handleDragStart} onClick={handleSingleClick} className={"ingredient-card group relative flex cursor-grab flex-col justify-between rounded-lg border border-ide-border bg-slate-900/50 p-3.5 select-none hover:border-slate-700 active:cursor-grabbing ".concat(inAM && inPM ? 'opacity-40 border-slate-800' : '')}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-xs font-semibold leading-tight text-slate-100 group-hover:text-sky-400">
            {ingredient.name}
          </h3>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            {ingredient.defaultTime === 'AM' && <Sun className="h-3 w-3 text-amber-500"/>}
            {ingredient.defaultTime === 'PM' && <Moon className="h-3 w-3 text-indigo-400"/>}
            {ingredient.defaultTime === 'BOTH' && <Layers className="h-3 w-3 text-slate-400"/>}
          </span>
        </div>

        <p className="line-clamp-2 text-[11px] leading-normal text-slate-400">
          {ingredient.description}
        </p>
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        <span className={"rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-wide ".concat(style.bg, " ").concat(style.text)}>
          {style.label}
        </span>

        {/* Display slot indicators if already added */}
        <div className="flex gap-1 text-[9px] font-mono">
          {inAM && <span className="rounded bg-amber-950/80 px-1 text-amber-400 border border-amber-500/20">AM</span>}
          {inPM && <span className="rounded bg-indigo-950/80 px-1 text-indigo-400 border border-indigo-500/20">PM</span>}
        </div>
      </div>
    </div>);
}
