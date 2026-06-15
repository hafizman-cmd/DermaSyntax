'use client';
import React, { useEffect, useRef } from 'react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { AlertCircle, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';
export default function CompilerConsole() {
    var results = useRoutineStore(function (state) { return state.compilationResults; });
    var bottomRef = useRef(null);
    // Scroll to bottom when results update
    useEffect(function () {
        var _a;
        (_a = bottomRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [results]);
    var hasErrors = results.some(function (r) { return r.status === 'ERROR'; });
    var hasWarnings = results.some(function (r) { return r.status === 'WARNING'; });
    var hasResults = results.length > 0;
    // Compute console frame border based on overall status
    var frameBorder = 'border-ide-border';
    if (hasResults) {
        if (hasErrors) {
            frameBorder = 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.05)]';
        }
        else if (hasWarnings) {
            frameBorder = 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
        }
        else {
            frameBorder = 'border-emerald-500/40 shadow-[0_0_15px_rgba(34,197,94,0.05)]';
        }
    }
    return (<div className={"flex flex-col rounded-lg border bg-black font-mono text-xs ".concat(frameBorder, " transition-all duration-300")}>
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-ide-border bg-slate-950 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400"/>
          <span className="font-bold tracking-wider text-slate-400">COMPILER_CONSOLE</span>
        </div>
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800"/>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800"/>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800"/>
        </div>
      </div>

      {/* Output Stream */}
      <div className="h-48 overflow-y-auto p-4 space-y-3">
        {!hasResults ? (<div className="flex h-full flex-col items-center justify-center text-slate-600">
            <span className="animate-pulse">$ await routine_input...</span>
            <span className="mt-1 text-[10px]">Add ingredients to slot arrays to initiate ruleset compilation.</span>
          </div>) : (results.map(function (res, index) {
            var itemColor = 'text-sky-400';
            var Icon = Terminal;
            if (res.status === 'ERROR') {
                itemColor = 'text-red-400';
                Icon = AlertCircle;
            }
            else if (res.status === 'WARNING') {
                itemColor = 'text-amber-400';
                Icon = AlertTriangle;
            }
            else if (res.status === 'SUCCESS') {
                itemColor = 'text-emerald-400';
                Icon = CheckCircle2;
            }
            return (<div key={index} className="console-line flex items-start gap-3 rounded border border-transparent bg-slate-950/40 p-2.5 hover:border-slate-800 hover:bg-slate-950/80">
                <Icon className={"mt-0.5 h-4 w-4 shrink-0 ".concat(itemColor)}/>
                <div className="flex flex-col gap-1">
                  <span className={"font-semibold uppercase tracking-wider ".concat(itemColor)}>
                    {res.title}
                  </span>
                  <p className="leading-relaxed text-slate-300">
                    {res.message}
                  </p>
                </div>
              </div>);
        }))}
        <div ref={bottomRef}/>
      </div>
    </div>);
}
