'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import IngredientCard from '@/components/IngredientCard';
import RoutineSlotPanel from '@/components/RoutineSlotPanel';
import CompilerConsole from '@/components/CompilerConsole';
import { INGREDIENTS } from '@/data/ingredients';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Search } from 'lucide-react';
export default function Home() {
    var amRoutine = useRoutineStore(function (state) { return state.amRoutine; });
    var pmRoutine = useRoutineStore(function (state) { return state.pmRoutine; });
    var _a = React.useState(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var filteredIngredients = INGREDIENTS.filter(function (ingredient) {
        return ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ingredient.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ingredient.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return (<div className="flex h-screen flex-col overflow-hidden bg-ide-bg text-slate-200">
      {/* Navbar Header */}
      <Navbar />

      {/* Main IDE Workspace */}
      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        
        {/* Left Panel: Ingredient Arsenal */}
        <section className="flex w-80 flex-col rounded-lg border border-ide-border bg-ide-surface p-4">
          <div className="mb-4">
            <h2 className="font-mono text-xs font-bold tracking-wider text-slate-300">
              INGREDIENT_ARSENAL
            </h2>
            <p className="mt-1 text-[10px] text-slate-500">
              Drag or click ingredients to mount to routine.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500"/>
            <input type="text" placeholder="Search database..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="w-full rounded border border-ide-border bg-slate-950 py-1.5 pl-8 pr-3 font-mono text-[11px] placeholder-slate-600 outline-none focus:border-sky-500"/>
          </div>

          {/* Scrollable grid of ingredients */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-2.5">
              {filteredIngredients.map(function (ing) { return (<IngredientCard key={ing.id} ingredient={ing}/>); })}
              {filteredIngredients.length === 0 && (<div className="flex flex-col items-center justify-center p-8 text-center text-slate-600 font-mono text-[10px]">
                  No ingredients matched search query.
                </div>)}
            </div>
          </div>
        </section>

        {/* Right Area: Workspace + Compiler Console */}
        <section className="flex flex-1 flex-col gap-6 overflow-hidden">
          
          {/* Top Half: The Editor Rails */}
          <div className="flex flex-1 gap-6 overflow-hidden">
            <RoutineSlotPanel slot="AM" ingredients={amRoutine}/>
            <RoutineSlotPanel slot="PM" ingredients={pmRoutine}/>
          </div>

          {/* Bottom Half: Compiler Console */}
          <CompilerConsole />
        </section>

      </main>
    </div>);
}
