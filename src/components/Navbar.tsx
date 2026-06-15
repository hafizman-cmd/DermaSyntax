'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRoutineStore } from '@/store/useRoutineStore';
import { RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const results = useRoutineStore((state) => state.compilationResults);
  const clearAll = useRoutineStore((state) => state.clearAll);
  const amCount = useRoutineStore((state) => state.amRoutine.length);
  const pmCount = useRoutineStore((state) => state.pmRoutine.length);

  const hasErrors = results.some((r) => r.status === 'ERROR');
  const warningCount = results.filter((r) => r.status === 'WARNING').length;
  const isActive = amCount > 0 || pmCount > 0;

  // ── BIOMETRIC GAUGING ALGORITHM ──
  const calculateScore = () => {
    if (!isActive) return 100; // Base state when workbench is empty

    let score = 100 - warningCount * 15;
    if (hasErrors) {
      score = Math.min(20, score); // Drop straight into the critical safety boundary
    }

    return Math.max(0, score); // Absolute floor constraint
  };

  const score = calculateScore();

  // Dynamic aesthetic mapping based on safety thresholds
  let dialColor = 'stroke-emerald-500';
  let dialGlow = 'drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]';
  let textColor = 'text-emerald-400';
  let statusText = 'ROUTINE STABLE';

  if (!isActive) {
    statusText = 'SYSTEM INACTIVE';
    dialColor = 'stroke-zinc-800';
    dialGlow = '';
    textColor = 'text-zinc-500';
  } else if (hasErrors) {
    statusText = 'CLINICAL CONFLICT DETECTED';
    dialColor = 'stroke-red-500';
    dialGlow = 'drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]';
    textColor = 'text-red-400';
  } else if (warningCount > 0) {
    statusText = 'PRECAUTION REQUIRED';
    dialColor = 'stroke-amber-500';
    dialGlow = 'drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]';
    textColor = 'text-amber-400';
  }

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md px-8 select-none relative z-50">

      {/* Left Panel Status Info */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-50">
          DermaSyntax <span className="text-[10px] tracking-normal text-zinc-500 lowercase">v1.0.0</span>
        </h1>
        <div className="h-4 w-px bg-zinc-900" />
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? (hasErrors ? 'bg-red-500 animate-pulse' : warningCount > 0 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-zinc-700'} transition-colors duration-300`} />
          <span className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
            {statusText}
          </span>
        </div>
      </div>

      {/* Right Instrumentation Controls */}
      <div className="flex items-center gap-6">

        {/* ── INTERACTIVE BIO-METRIC DIAL GAUGE ── */}
        <div className="flex items-center gap-3 bg-zinc-900/20 border border-zinc-900/60 rounded-xl py-1.5 pl-3 pr-4">
          <div className="relative h-7 w-7 flex items-center justify-center">

            {/* SVG Ring Vector */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                className="stroke-zinc-800"
                strokeWidth="2.5"
                fill="transparent"
                r="16"
                cx="18"
                cy="18"
              />
              <motion.circle
                className={`${dialColor} ${dialGlow}`}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="transparent"
                r="16"
                cx="18"
                cy="18"
                strokeDasharray="100.5"
                initial={{ strokeDashoffset: 100.5 }}
                animate={{ strokeDashoffset: 100.5 - score }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              />
            </svg>

            {/* Embedded Center Indicator Icon */}
            <div className={`absolute inset-0 flex items-center justify-center ${textColor} transition-colors duration-300`}>
              {score >= 80 ? (
                <ShieldCheck className="h-3 w-3" />
              ) : (
                <ShieldAlert className="h-3 w-3" />
              )}
            </div>
          </div>

          {/* Numerical Meta Layout */}
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
              Barrier Health
            </span>
            <span className={`text-xs font-mono font-bold mt-0.5 ${textColor} transition-colors duration-300`}>
              {score}%
            </span>
          </div>
        </div>
        {/* ─────────────────────────────────────── */}

        {/* Combined 21st.dev Premium Shimmer Reset Button */}
        <button
          onClick={clearAll}
          className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-[10px] font-medium tracking-wider text-zinc-300 uppercase transition-all duration-300 hover:border-zinc-700 hover:text-zinc-50"
        >
          {/* Your Custom Moving Reflective Gloss Overlay */}
          <span className="absolute inset-0 w-[200%] -translate-x-full animate-[shimmer_3.5s_infinite] bg-gradient-to-r from-transparent via-zinc-100/10 to-transparent mix-blend-screen" />

          <RefreshCw className="relative z-10 h-3 w-3 transition-transform duration-500 group-hover:rotate-180 text-zinc-400 group-hover:text-zinc-200" />
          <span className="relative z-10">Reset Routine</span>
        </button>

      </div>
    </header>
  );
}