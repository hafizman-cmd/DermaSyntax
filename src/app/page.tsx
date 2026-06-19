'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import IngredientCard from '@/components/IngredientCard';
import RoutineSlotPanel from '@/components/RoutineSlotPanel';
import CompilerConsole from '@/components/CompilerConsole';
import MechanismDrawer from '@/components/MechanismDrawer';
import { INGREDIENTS } from '@/data/ingredients';
import { useRoutineStore } from '@/store/useRoutineStore';
import { fetchIngredientsByQuery } from '@/lib/api-fetcher';
import type { Ingredient } from '@/types/skincare';
import { Search, User, ArrowRight, Terminal, Sparkles, Flame, Droplets, RefreshCw, Shield, Binary } from 'lucide-react';
import ExportPanel from '@/components/ExportPanel';
import { SplineScene } from '@/components/SplineScene';
import AnimatedThemeToggler from '@/components/AnimatedThemeToggler';
import GatewayNav from '@/components/GatewayNav';

const checkConflicts = (ingredients: string[]) => {
  const hasRetinol = ingredients.some(i => /\bretinol\b/i.test(i) || /\bretinoid\b/i.test(i));
  const hasAHA = ingredients.some(i => /\baha\b/i.test(i) || i.toLowerCase().includes('glycolic') || i.toLowerCase().includes('lactic'));
  const hasBHA = ingredients.some(i => /\bbha\b/i.test(i) || i.toLowerCase().includes('salicylic'));
  const hasVitC = ingredients.some(i => /\bvit_c\b/i.test(i) || i.toLowerCase().includes('vitamin c') || i.toLowerCase().includes('ascorbic'));
  if (hasRetinol && hasAHA) {
    return {
      status: "CONFLICT DETECTED",
      label: "[ROUTINE CONFLICT // HIGH IRRITATION RISK]",
      desc: "Combining Retinol with AHA (Glycolic Acid) dramatically increases dryness and skin peeling. Consider alternating usage across different nights."
    };
  }
  if (hasRetinol && hasBHA) {
    return {
      status: "BARRIER WARNING",
      label: "[ROUTINE CONFLICT // OVER-EXFOLIATION RISK]",
      desc: "Retinol and BHA (Salicylic Acid) both deeply accelerate skin cell turnover. Layering them concurrently can compromise your skin barrier."
    };
  }
  if (hasVitC && (hasAHA || hasBHA)) {
    return {
      status: "EFFICACY RISK",
      label: "[ROUTINE WARNING // FORMULA DESTABILIZATION]",
      desc: "Using pure Vitamin C alongside strong exfoliating acids (AHA/BHA) can destabilize the pH balance, diminishing the potency of both actives."
    };
  }
  return null;
};

const checkConcentrationThresholds = (routineItems: { name?: string }[]) => {
  let totalNiacinamide = 0;
  let totalBHA = 0;
  let totalAHA = 0;
  routineItems.forEach(item => {
    const name = item.name || '';
    const pctMatch = name.match(/(\d+(?:\.\d+)?)%/);
    const pctValue = pctMatch ? parseFloat(pctMatch[1]) : 0;
    if (name.toLowerCase().includes('niacinamide')) {
      totalNiacinamide += pctValue || 5;
    }
    if (name.toLowerCase().includes('bha') || name.toLowerCase().includes('salicylic')) {
      totalBHA += pctValue || 2;
    }
    if (name.toLowerCase().includes('aha') || name.toLowerCase().includes('glycolic')) {
      totalAHA += pctValue || 8;
    }
  });
  if (totalNiacinamide > 12) {
    return {
      label: "[CONCENTRATION ALERT // HIGH EXPOSURE RISK]",
      desc: `You have stacked multiple formulas containing Niacinamide. The total combined exposure is now roughly ${totalNiacinamide}%, which exceeds safe daily recommendation thresholds and may trigger redness or sensitivity.`
    };
  }
  if (totalBHA > 2) {
    return {
      label: "[CONCENTRATION ALERT // SKIN STRIPPING RISK]",
      desc: `Your routine contains a cumulative Salicylic Acid (BHA) score of ${totalBHA}%. Exceeding 2% chemical exfoliation in a single cycle can break down your natural skin oils and cause severe dryness.`
    };
  }
  return null;
};

// Simple local alternative to combine Tailwind class strings safely without broken imports
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

function ElegantShape({
  className = "",
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-zinc-300/30 dark:from-zinc-500/[0.08]",
  duration = 6,
  driftX = 20,
  driftY = 35,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  duration?: number;
  driftX?: number;
  driftY?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, driftY, -driftY / 2, 0],
          x: [0, driftX, -driftX, 0],
          rotate: [0, 4, -4, 0]
        }}
        transition={{
          duration: duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[3px] border-2 border-black/[0.03] dark:border-white/[0.05] shadow-sm after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();

  const amRoutine = useRoutineStore((state) => state.amRoutine);
  const pmRoutine = useRoutineStore((state) => state.pmRoutine);

  const conflict = React.useMemo(() => {
    const allIngredients = [...amRoutine, ...pmRoutine].map(i => i.name);
    return checkConflicts(allIngredients);
  }, [amRoutine, pmRoutine]);

  const concentrationWarning = React.useMemo(() => {
    return checkConcentrationThresholds([...amRoutine, ...pmRoutine]);
  }, [amRoutine, pmRoutine]);

  const skinType = useRoutineStore((state) => state.skinType);
  const setSkinType = useRoutineStore((state) => state.setSkinType);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string>('ALL');
  const [isOnboarded, setIsOnboarded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const storedStatus = localStorage.getItem('dermasyntax_onboarded');
    if (storedStatus === 'true') {
      setIsOnboarded(true);
    }
  }, []);

  // Compiler execution toggle state controlling main routing benchmarks
  const [compilerMode, setCompilerMode] = React.useState<'ingredients' | 'products'>('ingredients');

  // Live ingredient search from Open Beauty Facts taxonomy
  const [liveIngredients, setLiveIngredients] = React.useState<Ingredient[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const matrixFilters = ['ALL', 'ACIDS', 'RETINOIDS', 'VITAMINS', 'REPAIRS'];

  // Debounced live ingredient search when the user types
  React.useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setLiveIngredients([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await fetchIngredientsByQuery(trimmed);
      setLiveIngredients(results);
      setIsSearching(false);
    }, 350);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Card parameters with detailed medical profiles maximizing space cleanly
  const skinCards = [
    {
      name: "Combination",
      title: "Combination Skin",
      description: "Multi-zone variable routing logic",
      extended: "Simultaneous T-zone sebum regulation and lipid buffering active. Balancing micro-zone epidermal environments.",
      date: "MATRIX SEC // 04",
      icon: <RefreshCw className="size-4 text-emerald-300" />,
      titleClassName: "text-emerald-400",
      zIndex: "z-10",
      activePos: "left-0 -top-12",
      inactivePos: "left-0 top-0",
    },
    {
      name: "Sensitive",
      title: "Sensitive Skin",
      description: "Hyper-reactive barrier framework",
      extended: "Inflammatory threshold critical. Restricting aggressive acid chains while deploying soothing molecular isolates.",
      date: "MATRIX SEC // 05",
      icon: <Shield className="size-4 text-rose-300" />,
      titleClassName: "text-rose-400",
      zIndex: "z-20",
      activePos: "left-12 -top-4",
      inactivePos: "left-12 top-8",
    },
    {
      name: "Normal",
      title: "Normal Skin",
      description: "Baseline balance matrix calibration",
      extended: "Homeostasis verified. Stabilizing structural moisture barriers and protecting target skin cell turnover loops.",
      date: "MATRIX SEC // 01",
      icon: <Sparkles className="size-4 text-blue-300" />,
      titleClassName: "text-blue-400",
      zIndex: "z-30",
      activePos: "left-24 top-4",
      inactivePos: "left-24 top-16",
    },
    {
      name: "Oily",
      title: "Oily Skin",
      description: "High sebum routing rules",
      extended: "Hyperactive lipid gland synthesis detected. Routing lipophilic clearing complexes and weightless humectants.",
      date: "MATRIX SEC // 02",
      icon: <Flame className="size-4 text-amber-300" />,
      titleClassName: "text-amber-400",
      zIndex: "z-40",
      activePos: "left-36 top-12",
      inactivePos: "left-36 top-24",
    },
    {
      name: "Dry",
      title: "Dry Skin",
      description: "Cellular hydration patch log",
      extended: "Transepidermal water loss index elevated. Injecting dense water-binding agents to bridge surface lipid gaps.",
      date: "MATRIX SEC // 03",
      icon: <Droplets className="size-4 text-cyan-300" />,
      titleClassName: "text-cyan-400",
      zIndex: "z-50",
      activePos: "left-48 top-20",
      inactivePos: "left-48 top-32",
    },
  ];

  const matchesWord = (text: string, query: string) => {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  };

  const filteredIngredients = INGREDIENTS.filter((ingredient) => {
    const matchesSearch =
      matchesWord(ingredient.name, searchQuery) ||
      ingredient.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredient.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'ALL') return true;

    const cat = ingredient.category;
    if (activeFilter === 'ACIDS') return cat === 'AHA' || cat === 'BHA';
    if (activeFilter === 'RETINOIDS') return cat === 'RETINOID';
    if (activeFilter === 'VITAMINS') return cat === 'PURE_VIT_C' || cat === 'VIT_C_DERIVATIVE' || cat === 'BRIGHTENER' || cat === 'ANTIOXIDANT';
    if (activeFilter === 'REPAIRS') return cat === 'BARRIER_REPAIR' || cat === 'HUMECTANT' || cat === 'ACNE_TREATMENT';

    return true;
  });

  const handleBootEngine = () => {
    if (compilerMode === 'products') {
      router.push('/product-base');
    } else {
      localStorage.setItem('dermasyntax_onboarded', 'true');
      setIsOnboarded(true);
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-zinc-50 text-zinc-800 dark:bg-[#121212] dark:text-zinc-100 antialiased select-none transition-colors duration-500">

      {/* GLOBAL BACKGROUND CANVAS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-300/40 dark:from-zinc-500/[0.03] via-transparent to-emerald-300/30 dark:to-emerald-500/[0.02] blur-3xl" />
        <ElegantShape
          delay={0.2}
          width={650}
          height={160}
          rotate={14}
          duration={5.5}
          driftX={25}
          driftY={40}
          gradient="from-zinc-300/35 dark:from-zinc-500/[0.06]"
          className="left-[-10%] md:left-[-5%] top-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/20 via-transparent to-zinc-50/40 dark:from-[#121212] dark:via-transparent dark:to-[#121212]/80 transition-colors duration-500" />
      </div>

      <AnimatePresence mode="wait">
        {!isOnboarded ? (
          <>
            {/* ── FIXED GATEWAY TOP NAVIGATION BAR ── */}
            <GatewayNav />

            {/* ── HIGH-END UNIFIED PRESENTATION CONSOLE ── */}
            <motion.div
              key="onboarding"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col flex-1 items-center justify-center lg:items-start h-full w-full max-w-[1400px] mx-auto min-h-0 px-6 pt-20 md:px-12 md:pb-12 pb-24 overflow-y-auto lg:overflow-visible custom-scrollbar"
            >

              {/* Invisible dismiss background overlay */}
              {skinType && (
                <div
                  className="absolute inset-0 z-20 cursor-default bg-transparent"
                  onClick={() => setSkinType('')}
                />
              )}

              {/* ── LEFT UNIFIED TERMINAL COLUMN ── */}
              <div className="flex flex-col text-left max-w-md w-full z-30 shrink-0 pb-12 overflow-visible">

                <h1 className="text-3xl font-black tracking-[0.3em] text-zinc-900 dark:text-zinc-50 uppercase leading-none">
                  DERMASYNTAX
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mt-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  Clinical Formulation Compiler // Core Engine
                </p>
                <p className="mt-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-bold uppercase tracking-wider">
                  An advanced algorithmic development environment designed to sequence active chemical components, map molecular application depths, and cross-examine pH variables to prevent skin barrier degradation.
                </p>

                {/* ── BASE SELECTION + TELEMETRY CLUSTER ── */}
                <div className="flex flex-col gap-y-2 mt-5">
                  {/* ── ENGINE MODE SELECTOR SLIDER ── */}
                  <div className="w-full rounded-xl border border-slate-700 bg-white/[0.03] p-1 relative h-9 flex items-center">
                    <div
                      className={cn(
                        "absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-lg border border-slate-600 bg-white/[0.06] backdrop-blur-md transition-all duration-300",
                        compilerMode === 'products' ? "left-[calc(50%+2px)]" : "left-0.5"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setCompilerMode('ingredients')}
                      className={cn(
                        "w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                        compilerMode === 'ingredients' ? "text-zinc-950 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-500"
                      )}
                    >
                      // INGREDIENT BASE
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompilerMode('products')}
                      className={cn(
                        "w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                        compilerMode === 'products' ? "text-zinc-950 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-500"
                      )}
                    >
                      // PRODUCT BASE
                    </button>
                  </div>

                  {/* ── STEP / STATE INDICATOR ── */}
                  <span className="block font-mono text-[10px] tracking-[0.22em] font-semibold text-zinc-500 dark:text-zinc-400 uppercase select-none">
                    INITIALIZING MATRIX // STEP 01: SELECT SKIN PROFILE
                  </span>
                </div>

                {/* ── HIGH-DENSITY CARD DECK ASSEMBLY ── */}
                <div className="relative flex items-center justify-start w-full h-[280px] z-30 mt-8 mb-2 overflow-visible group/deck">
                  <div className="grid [grid-template-areas:'stack'] place-items-start w-full h-full overflow-visible">
                    {skinCards.map((card, index) => {
                      const cardId = card.name.toLowerCase();
                      const isCurrent = skinType === cardId;

                      return (
                        <div
                          key={card.name}
                          className={cn(
                            "group relative [grid-area:stack] w-[22rem] h-36",
                            isCurrent ? "z-50" : card.zIndex,
                            isCurrent ? card.activePos : card.inactivePos
                          )}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSkinType(cardId);
                            }}
                            style={{
                              WebkitFontSmoothing: 'subpixel-antialiased',
                              backfaceVisibility: 'hidden',
                            }}
                            className={cn(
                              "relative flex h-full w-full -skew-y-[8deg] select-none flex-col justify-between rounded-xl border px-4 py-3 transition-all duration-300 ease-out cursor-pointer text-left",
                              "group-hover/deck:opacity-40 group-hover:!opacity-100",
                              "border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#161616]/70 backdrop-blur-xl shadow-lg shadow-zinc-200/50 dark:shadow-none text-zinc-800 dark:text-zinc-100",
                              "group-hover:-translate-y-8 group-hover:translate-x-3 group-hover:scale-[1.02] group-hover:z-50 group-hover:border-zinc-400 dark:group-hover:border-white/30",
                              isCurrent && "!border-slate-500 dark:!border-slate-400 !bg-white dark:!bg-[#1a1a1a]/90 !ring-1 !ring-slate-500/30 !z-50 !scale-[1.02] !opacity-100"
                            )}
                          >
                            {/* Top Heading Anchor Segment */}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="relative inline-block rounded-full bg-slate-200 dark:bg-slate-700 p-1 border border-slate-300 dark:border-slate-600">
                                  {card.icon}
                                </span>
                                <p className={cn("text-xs font-black tracking-wider uppercase", card.titleClassName)}>
                                  {card.title}
                                </p>
                              </div>

                              <p className="text-[9px] font-mono font-bold tracking-tight text-zinc-500 dark:text-zinc-500 uppercase mt-1">
                                {card.description}
                              </p>
                            </div>

                            {/* Extended diagnostic description body */}
                            <p className="text-[10px] font-bold leading-normal text-zinc-600 dark:text-zinc-300 tracking-wide uppercase line-clamp-2 my-1.5">
                              {card.extended}
                            </p>

                            {/* Footer System Identifiers */}
                            <div className="flex items-center justify-between w-full border-t border-slate-700 pt-1.5">
                              <p className="text-[8px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase">
                                {card.date}
                              </p>
                              {isCurrent && (
                                <span className="text-[8px] font-mono font-black text-emerald-500 tracking-widest bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                                  SELECTED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Node Status Monitor */}
                <div className="mt-2 py-2 px-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md font-mono text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest w-fit ">
                  {skinType ? `NODE TARGET // ${skinType.toUpperCase()}_STABLE` : "SELECT YOUR BASE & SKIN TYPE"}
                </div>

                {/* Primary Initializer Execution Button */}
                <button
                  disabled={!skinType}
                  onClick={handleBootEngine}
                  className="group relative mt-6 flex w-full max-w-xs items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-200 dark:bg-white/[0.06] border border-slate-300 dark:border-slate-600 px-4 py-3 text-xs font-black tracking-wider text-zinc-900 dark:text-white uppercase transition-all duration-300 hover:bg-zinc-300 dark:hover:bg-white/[0.1] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span>Boot Formulation Rails</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 stroke-[2.5]" />
                </button>
              </div>

            </motion.div>

            {/* ── FLOATING OVERLAY: PERFECTLY BALANCED VIEWPORT DECK ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
              className="hidden md:flex absolute right-[-15%] bottom-0 w-[80%] h-full items-end justify-center pointer-events-auto z-10 overflow-visible shrink-0"
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full transform translate-y-[13%]"
              />
            </motion.div>

            {/* ── CLINICAL REALISM GATEWAY FOOTER ── */}
            <footer className="fixed bottom-0 left-0 right-0 w-full py-6 px-8 flex items-end justify-between z-40 select-none pointer-events-none">
              <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-zinc-600 dark:text-zinc-500 max-w-[60%] leading-relaxed">
                [SYSTEM NOTICE] — DERMASYNTAX IS A DATA SYNTHESIS ENVIRONMENT FOR INFORMATIONAL TAXONOMY. IT DOES NOT SUBSTITUTE FOR PROFESSIONAL DERMATOLOGICAL ADVICE.
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-zinc-600 dark:text-zinc-500 whitespace-nowrap">
                &copy; 2026 DERMASYNTAX // SYS_REF: BUILD_V1.0.4
              </span>
            </footer>
          </>
        ) : (

          /* ── VIEW B: ACTIVE FORMULATION LAB INTERFACE ── */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col min-h-screen lg:h-screen w-full"
          >
            {/* Root page manages onboarding gatekeeping via localStorage; header link requires no manual interceptor */}
            <div className="print:hidden">
              <Navbar />
            </div>

            <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-8 gap-6 lg:gap-8 custom-scrollbar">

              {/* 🧪 INGREDIENT ARSENAL — GLASSMORPHIC LUXURY LAB PANEL */}
              <section className="print:hidden flex w-full lg:w-80 shrink-0 flex-col rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] backdrop-blur-md shadow-sm p-5 transition-all duration-500 text-zinc-800 dark:text-zinc-100">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black tracking-widest text-zinc-900 dark:text-zinc-400 uppercase">
                      Ingredient Arsenal
                    </h2>
                    <span className="text-[8px] tracking-widest font-black px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-700/50 text-slate-900 dark:text-zinc-300 uppercase rounded font-mono">
                      Profile: {skinType}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] tracking-wide text-zinc-500 dark:text-zinc-400 uppercase font-bold">
                    Select or drag actives to add to formulation
                  </p>
                </div>

                {/* Search bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 stroke-[2.5]" />
                  <input
                    type="text"
                    placeholder="Search active catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-white/[0.03] py-2.5 pl-9 pr-3 text-xs font-bold placeholder-zinc-400 outline-none transition-all text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-700 pb-3.5">
                  {matrixFilters.map((filter) => {
                    const isCurrent = activeFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`text-[8px] font-mono font-black tracking-widest uppercase px-2 py-1 rounded-md border transition-all duration-200 ${isCurrent
                          ? 'border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-emerald-400'
                          : 'border-slate-700 bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-white/[0.05]'
                          }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none px-1.5 py-1 custom-scrollbar">
                  {searchQuery.trim() ? (
                    <>
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] font-mono font-black text-emerald-500 uppercase tracking-widest">
                          Live &middot; Open Beauty Facts
                        </span>
                      </div>
                      <motion.div layout className="grid grid-cols-1 gap-3">
                        <AnimatePresence mode="popLayout">
                          {isSearching ? (
                            <motion.div
                              key="searching"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center py-10 gap-3"
                            >
                              <RefreshCw className="h-5 w-5 animate-spin text-emerald-500" />
                              <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">
                                Searching ingredient taxonomy...
                              </span>
                            </motion.div>
                          ) : liveIngredients.length === 0 ? (
                            <motion.div
                              key="no-results"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center p-8 text-center text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider font-extrabold font-mono mt-4"
                            >
                              No ingredients found for &quot;{searchQuery.trim()}&quot;
                            </motion.div>
                          ) : (
                            liveIngredients.map((ing) => (
                              <motion.div
                                key={ing.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                              >
                                <IngredientCard ingredient={ing} />
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div layout className="grid grid-cols-1 gap-3">
                        <AnimatePresence mode="popLayout">
                          {filteredIngredients.map((ing) => (
                            <motion.div
                              key={ing.id}
                              layout
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.92 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                            >
                              <IngredientCard ingredient={ing} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>

                      {filteredIngredients.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider font-extrabold font-mono mt-4">
                          No matches found in matrix range.
                        </div>
                      )}
                    </>
                  )}
                </div>

                <ExportPanel />
              </section>

              <section className="print:hidden flex flex-col flex-1 gap-6 lg:gap-8">
                {conflict && (
                  <div className="border-2 border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl p-4">
                    <span className="font-mono font-black text-[9px] tracking-widest uppercase">{conflict.label}</span>
                    <p className="text-[10px] font-semibold leading-relaxed mt-1">{conflict.desc}</p>
                  </div>
                )}
                {concentrationWarning && (
                  <div className="border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-4 rounded-xl font-mono text-xs shadow-sm">
                    <span className="font-black text-[9px] tracking-widest uppercase">{concentrationWarning.label}</span>
                    <p className="text-[10px] font-semibold leading-relaxed mt-1">{concentrationWarning.desc}</p>
                  </div>
                )}
                <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-6 lg:gap-8">
                  <RoutineSlotPanel slot="AM" ingredients={amRoutine} />
                  <RoutineSlotPanel slot="PM" ingredients={pmRoutine} />
                </div>
                <CompilerConsole />
                <button
                  onClick={() => window.print()}
                  className="mt-6 flex items-center justify-center space-x-2 w-full font-mono text-xs tracking-wider border-2 border-zinc-800 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 py-3 rounded-xl transition-all shadow-sm"
                >
                  <span>GENERATE ROUTINE BLUEPRINT // EXPORT PDF</span>
                </button>
              </section>

            </main>

            {/* PRINT-ONLY MASTER BLUEPRINT TEMPLATE */}
            <div className="hidden print:block print:absolute print:top-0 print:left-0 print:w-full print:m-0 print:p-8 bg-white text-zinc-950 font-mono text-xs leading-relaxed z-[9999]">
              <div className="border-b-2 border-zinc-900 pb-4 mb-6">
                <h1 className="text-xl font-bold tracking-tight">DERMASYNTAX</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Clinical Routine Specification Blueprint</p>
              </div>

              {/* CALIBRATION META ROW */}
              <div className="grid grid-cols-3 gap-4 bg-zinc-50 border border-zinc-200 p-3 rounded mb-6">
                <div>
                  <span className="block text-[9px] text-zinc-500 uppercase">Skin Profile</span>
                  <span className="font-bold uppercase">{skinType || 'NOT_CALIBRATED'}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-zinc-500 uppercase">Compiled Steps</span>
                  <span className="font-bold">{amRoutine.length + pmRoutine.length} Nodes</span>
                </div>
                <div>
                  <span className="block text-[9px] text-zinc-500 uppercase">System Integrity</span>
                  {conflict ? (
                    <span className="font-bold text-red-600 uppercase">CONFLICT ALERT</span>
                  ) : (
                    <span className="font-bold text-emerald-600 uppercase">NOMINAL PASS</span>
                  )}
                </div>
              </div>

              {/* DIAGNOSTIC SAFETY SUMMARIES */}
              <div className="mb-6">
                <h3 className="font-bold uppercase tracking-wide mb-2">I. Safety &amp; Compatibility Analysis</h3>
                {conflict ? (
                  <div className="border-2 border-red-500 p-3 rounded bg-red-50/50 text-red-900">
                    <p className="font-bold uppercase tracking-wide">{conflict.label || '[ROUTINE ALERT // ACTIVE CONFLICT]'}</p>
                    <p className="text-red-700 mt-1">{conflict.desc || 'Dangerous active chemical pairing detected in canvas slots.'}</p>
                  </div>
                ) : (
                  <div className="border p-3 rounded bg-zinc-50 text-zinc-900">
                    <p className="font-semibold text-zinc-800">[ROUTINE STATUS // VALIDATION PASS]</p>
                    <p className="text-zinc-600 mt-1">Molecular weight gradients and active pH ranges are perfectly synchronized across sequential layering intervals.</p>
                  </div>
                )}
              </div>

              {/* AM SPECIFICATION LADDER */}
              <div className="mb-6">
                <h3 className="font-bold uppercase tracking-wide mb-2">II. AM Layering Sequence</h3>
                <div className="border rounded divide-y divide-zinc-200">
                  {amRoutine.length === 0 ? (
                    <div className="p-3 text-zinc-400 italic">No formulation variables assigned to AM block.</div>
                  ) : (
                    amRoutine.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2.5 bg-white">
                        <span className="font-bold text-zinc-400 w-12">STEP {idx + 1}</span>
                        <span className="font-semibold text-zinc-900 flex-1">{item.name}</span>
                        <span className="text-zinc-500 text-right uppercase text-[10px]">{item.category || 'Active'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PM SPECIFICATION LADDER */}
              <div className="mb-6">
                <h3 className="font-bold uppercase tracking-wide mb-2">III. PM Layering Sequence</h3>
                <div className="border rounded divide-y divide-zinc-200">
                  {pmRoutine.length === 0 ? (
                    <div className="p-3 text-zinc-400 italic">No formulation variables assigned to PM block.</div>
                  ) : (
                    pmRoutine.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2.5 bg-white">
                        <span className="font-bold text-zinc-400 w-12">STEP {idx + 1}</span>
                        <span className="font-semibold text-zinc-900 flex-1">{item.name}</span>
                        <span className="text-zinc-500 text-right uppercase text-[10px]">{item.category || 'Active'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* COMPILER SYSTEM FOOTER */}
              <div className="border-t border-dashed border-zinc-300 pt-4 mt-8 text-[9px] text-zinc-500 text-justify">
                <strong>[SYSTEM NOTICE // CLINICAL DISCLAIMER]</strong> — This generated blueprint maps molecular layering orders based on open-source ingredient parameters and does not substitute for a personalized medical diagnosis or professional dermatological prescription.
              </div>
            </div>

            {/* ── CLINICAL REALISM FOOTER ── */}
            <footer className="print:hidden shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-8 py-3 flex items-center justify-between gap-4 select-none">
              <span className="text-[9px] font-mono tracking-wider text-zinc-600 dark:text-zinc-500 uppercase leading-relaxed">
                [SYSTEM NOTICE] — DERMASYNTAX is a data synthesis environment for informational taxonomy. It does not substitute for professional dermatological advice.
              </span>
              <span className="text-[9px] font-mono tracking-wider text-zinc-600 dark:text-zinc-500 uppercase whitespace-nowrap">
                &copy; 2026 DERMASYNTAX // BUILD_V1.0.4
              </span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <MechanismDrawer />
      </AnimatePresence>

    </div>
  );
}