'use client';
import React from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';
import { useRoutineStore } from '@/store/useRoutineStore';
export default function Navbar() {
    var clearAll = useRoutineStore(function (state) { return state.clearAll; });
    var amCount = useRoutineStore(function (state) { return state.amRoutine.length; });
    var pmCount = useRoutineStore(function (state) { return state.pmRoutine.length; });
    var results = useRoutineStore(function (state) { return state.compilationResults; });
    // Determine global health indicator
    var hasErrors = results.some(function (r) { return r.status === 'ERROR'; });
    var hasWarnings = results.some(function (r) { return r.status === 'WARNING'; });
    var isActive = amCount > 0 || pmCount > 0;
    var indicatorColor = 'bg-slate-500';
    var statusText = 'OFFLINE';
    if (isActive) {
        if (hasErrors) {
            indicatorColor = 'bg-red-500 animate-pulse';
            statusText = 'COMPILER_ERROR';
        }
        else if (hasWarnings) {
            indicatorColor = 'bg-amber-500';
            statusText = 'COMPILER_WARNING';
        }
        else {
            indicatorColor = 'bg-emerald-500 animate-pulse';
            statusText = 'BUILD_SUCCESS';
        }
    }
    return (<header className="flex h-14 items-center justify-between border-b border-ide-border bg-ide-surface px-6">
      <div className="flex items-center gap-3">
        <Terminal className="h-5 w-5 text-emerald-400"/>
        <h1 className="font-mono text-sm font-semibold tracking-wider text-slate-200">
          DermaSyntax <span className="text-xs text-slate-500">v1.0.0</span>
        </h1>
        <div className="h-4 w-px bg-ide-border"/>
        <div className="flex items-center gap-2">
          <span className={"h-2.5 w-2.5 rounded-full ".concat(indicatorColor)}/>
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400">
            {statusText}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="h-4 w-4 text-sky-400"/>
          <span className="font-mono">
            Barrier Protection: {hasErrors ? 'COMPROMISED' : 'SECURE'}
          </span>
        </div>

        <button onClick={clearAll} className="flex items-center gap-1.5 rounded border border-ide-border bg-slate-900 px-3 py-1.5 font-mono text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
          <RefreshCw className="h-3.5 w-3.5"/>
          Reset Workspace
        </button>
      </div>
    </header>);
}
