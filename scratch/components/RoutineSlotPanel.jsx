'use client';
import React, { useState } from 'react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Trash2, Sun, Moon } from 'lucide-react';
export default function RoutineSlotPanel(_a) {
    var slot = _a.slot, ingredients = _a.ingredients;
    var _b = useState(false), isOver = _b[0], setIsOver = _b[1];
    var addIngredient = useRoutineStore(function (state) { return state.addIngredient; });
    var removeIngredient = useRoutineStore(function (state) { return state.removeIngredient; });
    var results = useRoutineStore(function (state) { return state.compilationResults; });
    var handleDragOver = function (e) {
        e.preventDefault();
        setIsOver(true);
    };
    var handleDragLeave = function () {
        setIsOver(false);
    };
    var handleDrop = function (e) {
        e.preventDefault();
        setIsOver(false);
        try {
            var dataStr = e.dataTransfer.getData('application/json');
            if (dataStr) {
                var ingredient = JSON.parse(dataStr);
                addIngredient(ingredient, slot);
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    // Check if any ingredient in this slot has compilation diagnostics targeting it
    var isTargetedByError = function (id) {
        return results.some(function (r) { return r.status === 'ERROR' && r.targetIngredients.includes(id); });
    };
    var isTargetedByWarning = function (id) {
        return results.some(function (r) { return r.status === 'WARNING' && r.targetIngredients.includes(id); });
    };
    return (<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={"flex flex-1 flex-col rounded-lg border bg-slate-950/80 p-5 transition-all duration-200 ".concat(isOver
            ? 'border-sky-500 bg-sky-950/10 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
            : 'border-ide-border')}>
      {/* Panel Header */}
      <div className="mb-4 flex items-center justify-between border-b border-ide-border pb-3">
        <div className="flex items-center gap-2">
          {slot === 'AM' ? (<Sun className="h-4.5 w-4.5 text-amber-400"/>) : (<Moon className="h-4.5 w-4.5 text-indigo-400"/>)}
          <span className="font-mono text-xs font-bold tracking-wider text-slate-300">
            {slot === 'AM' ? 'AM_ROUTINE' : 'PM_ROUTINE'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
        </span>
      </div>

      {/* Ingredients List or Placeholder */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {ingredients.length === 0 ? (<div className="flex flex-1 flex-col items-center justify-center rounded-md border border-dashed border-slate-800 p-8 text-center">
            <span className="text-[11px] font-mono text-slate-600">
              Drag here or single-click
            </span>
            <span className="mt-1 text-[9px] text-slate-700">
              to mount active slot
            </span>
          </div>) : (ingredients.map(function (ingredient) {
            var hasErr = isTargetedByError(ingredient.id);
            var hasWarn = isTargetedByWarning(ingredient.id);
            var borderStyle = 'border-ide-border hover:border-slate-700';
            if (hasErr) {
                borderStyle = 'border-red-500/50 bg-red-950/10 hover:border-red-500/80';
            }
            else if (hasWarn) {
                borderStyle = 'border-amber-500/50 bg-amber-950/10 hover:border-amber-500/80';
            }
            return (<div key={ingredient.id} className={"group flex items-center justify-between rounded border bg-slate-900/40 p-3 transition-colors ".concat(borderStyle)}>
                <div className="flex flex-col gap-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-slate-200">
                      {ingredient.name}
                    </span>
                    {hasErr && (<span className="rounded bg-red-950 px-1.5 py-0.5 font-mono text-[9px] font-bold text-red-400 border border-red-500/20">
                        CONFLICT
                      </span>)}
                    {hasWarn && (<span className="rounded bg-amber-950 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-400 border border-amber-500/20">
                        WARN
                      </span>)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {ingredient.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <button onClick={function () { return removeIngredient(ingredient.id, slot); }} className="rounded p-1.5 text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-colors" title="Remove from routine">
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>);
        }))}
      </div>
    </div>);
}
