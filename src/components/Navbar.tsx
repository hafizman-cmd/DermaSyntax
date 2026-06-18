'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRoutineStore } from '@/store/useRoutineStore';
import { RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import AnimatedThemeToggler from './AnimatedThemeToggler';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'INGREDIENT BASE', href: '/' },
  { label: 'PRODUCT BASE', href: '/product-base' },
  { label: 'MANUAL', href: '/manual' },
  { label: 'DOCUMENTATION', href: '/docs' },
] as const;

interface NavbarProps {
  onReset?: () => void;
  resetLabel?: string;
  onHomeClick?: () => void;
}

export default function Navbar({ onReset, resetLabel, onHomeClick }: NavbarProps) {
  const pathname = usePathname();
  const results = useRoutineStore((state) => state.compilationResults);
  const clearAll = useRoutineStore((state) => state.clearAll);
  const amCount = useRoutineStore((state) => state.amRoutine.length);
  const pmCount = useRoutineStore((state) => state.pmRoutine.length);

  const hasErrors = results.some((r) => r.status === 'ERROR');
  const warningCount = results.filter((r) => r.status === 'WARNING').length;
  const isActive = amCount > 0 || pmCount > 0;
  const hasBotanicalBuffer = results.some((r) => r.status === 'INFO');

  const calculateScore = () => {
    if (!isActive) return 100;

    let score = 100 - warningCount * 15;
    if (hasErrors) {
      score = Math.min(20, score);
      if (hasBotanicalBuffer) {
        score += 15;
      }
    }

    return Math.max(0, score);
  };

  const score = calculateScore();

  let dialColor = 'stroke-emerald-600 dark:stroke-emerald-400';
  let dialGlow = 'drop-shadow-[0_0_4px_rgba(16,185,129,0.2)] dark:drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]';
  let textColor = 'text-emerald-700 dark:text-emerald-400';
  let statusText = 'ROUTINE STABLE';

  if (!isActive) {
    statusText = 'SYSTEM INACTIVE';
    dialColor = 'stroke-black dark:stroke-white';
    dialGlow = '';
    textColor = 'text-black dark:text-white';
  } else if (hasErrors) {
    statusText = 'CLINICAL CONFLICT DETECTED';
    dialColor = 'stroke-red-600 dark:stroke-red-400';
    dialGlow = 'drop-shadow-[0_0_4px_rgba(239,68,68,0.2)] dark:drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]';
    textColor = 'text-red-600 dark:text-red-400';
  } else if (warningCount > 0) {
    statusText = 'PRECAUTION REQUIRED';
    dialColor = 'stroke-amber-600 dark:stroke-amber-400';
    dialGlow = 'drop-shadow-[0_0_4px_rgba(245,158,11,0.2)] dark:drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]';
    textColor = 'text-amber-700 dark:text-amber-400';
  }

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-white/[0.03] backdrop-blur-md px-8 select-none relative z-50 transition-colors duration-500">

      <div className="flex items-center gap-4">
        {/* ── HIGH-TECH LOGO HOME BUTTON ROUTER ── */}
        {/* UPGRADED: Attached a default behavior prevent interceptor to handle local page memory overrides smoothly */}
        <Link
          href="/"
          onClick={(e) => {
            if (onHomeClick) {
              e.preventDefault();
              onHomeClick();
            }
          }}
          className="hover:opacity-80 transition-opacity duration-300"
        >
          <h1 className="text-sm font-black uppercase tracking-[0.2em] text-black dark:text-zinc-50 transition-colors duration-300 cursor-pointer">
            DermaSyntax <span className="text-[10px] tracking-normal text-black dark:text-zinc-400 lowercase font-mono transition-colors duration-300">v1.0.0</span>
          </h1>
        </Link>

        <div className="h-4 w-[2px] bg-slate-600 transition-colors duration-300" />

        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? (hasErrors ? 'bg-red-500 animate-pulse' : warningCount > 0 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-black dark:bg-white'} transition-colors duration-300`} />
          <span className="text-[10px] font-black tracking-widest text-black dark:text-white transition-colors duration-300">
            {statusText}
          </span>
        </div>
      </div>

      <nav className="hidden md:flex items-center">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-[0.15em] font-semibold transition-colors mx-4 ${
                isActive
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
        </div>

        {/* ── BARRIER HEALTH GAUGE CAPSULE ── */}
        <div className="flex items-center gap-3 h-10 border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-xl px-3 transition-colors duration-300">
          <div className="relative h-6 w-6 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                className="stroke-zinc-200 dark:stroke-zinc-800 transition-colors duration-300"
                strokeWidth="3"
                fill="transparent"
                r="16"
                cx="18"
                cy="18"
              />
              <motion.circle
                className={`${dialColor} ${dialGlow} transition-colors duration-300`}
                strokeWidth="3"
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

            <div className={`absolute inset-0 flex items-center justify-center ${textColor} transition-colors duration-300 font-bold`}>
              {score >= 80 ? (
                <ShieldCheck className="h-3 w-3 stroke-[2.5]" />
              ) : (
                <ShieldAlert className="h-3 w-3 stroke-[2.5]" />
              )}
            </div>
          </div>

          <div className="flex flex-col select-none">
            <span className="text-[8px] font-black tracking-widest text-black dark:text-zinc-400 uppercase transition-colors duration-300 leading-none">
              Barrier Health
            </span>
            <span className={`text-[11px] font-mono font-black mt-0.5 ${textColor} transition-colors duration-300 leading-none`}>
              {score}%
            </span>
          </div>
        </div>

        {/* ── RESET ROUTINE COMPONENT TRIGGER ── */}
        <button
          onClick={() => {
            if (onReset) {
              onReset();
            } else {
              clearAll();
            }
          }}
          className="group relative flex items-center justify-center gap-2 overflow-hidden h-10 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] px-4 text-[10px] font-black tracking-wider uppercase transition-all duration-300"
        >
          <span className="absolute inset-0 w-[200%] -translate-x-full animate-[shimmer_3.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-screen" />
          <RefreshCw className="relative z-10 h-3 w-3 transition-transform duration-500 group-hover:rotate-180 text-black dark:text-white" strokeWidth={2.5} />

          <span className="relative z-10">{resetLabel || "Reset Routine"}</span>
        </button>

      </div>
    </header>
  );
}