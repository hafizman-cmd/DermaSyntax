'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import IngredientCard from '@/components/IngredientCard';
import RoutineSlotPanel from '@/components/RoutineSlotPanel';
import CompilerConsole from '@/components/CompilerConsole';
import MechanismDrawer from '@/components/MechanismDrawer';
import { INGREDIENTS } from '@/data/ingredients';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Search, User, ArrowRight, Terminal, Sparkles, Flame, Droplets, RefreshCw, Shield, Binary } from 'lucide-react';
import ExportPanel from '@/components/ExportPanel';
import { SplineScene } from '@/components/SplineScene';

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
  const skinType = useRoutineStore((state) => state.skinType);
  const setSkinType = useRoutineStore((state) => state.setSkinType);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string>('ALL');
  const [isOnboarded, setIsOnboarded] = React.useState(false);

  // Compiler execution toggle state controlling main routing benchmarks
  const [compilerMode, setCompilerMode] = React.useState<'ingredients' | 'products'>('ingredients');

  const matrixFilters = ['ALL', 'ACIDS', 'RETINOIDS', 'VITAMINS', 'REPAIRS'];

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
      activePos: "translate-x-0 -translate-y-12",
      inactivePos: "translate-x-0 translate-y-0 hover:-translate-y-8",
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
      activePos: "translate-x-12 -translate-y-4",
      inactivePos: "translate-x-12 translate-y-8 hover:translate-y-0",
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
      activePos: "translate-x-24 translate-y-4",
      inactivePos: "translate-x-24 translate-y-16 hover:translate-y-8",
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
      activePos: "translate-x-36 translate-y-12",
      inactivePos: "translate-x-36 translate-y-24 hover:translate-y-16",
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
      activePos: "translate-x-48 translate-y-20",
      inactivePos: "translate-x-48 translate-y-32 hover:translate-y-24",
    },
  ];

  const filteredIngredients = INGREDIENTS.filter((ingredient) => {
    const matchesSearch =
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-zinc-50 text-zinc-800 dark:bg-[#050505] dark:text-zinc-100 antialiased select-none transition-colors duration-500">

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
        <ElegantShape
          delay={0.4}
          width={500}
          height={130}
          rotate={-12}
          duration={7.5}
          driftX={-30}
          driftY={50}
          gradient="from-emerald-300/25 dark:from-emerald-500/[0.05]"
          className="right-[-5%] md:right-[0%] top-[35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/20 via-transparent to-zinc-50/40 dark:from-[#050505] dark:via-transparent dark:to-[#050505]/80 transition-colors duration-500" />
      </div>

      <AnimatePresence mode="wait">
        {!isOnboarded ? (
          <>
            {/* ── HIGH-END UNIFIED PRESENTATION CONSOLE ── */}
            <motion.div
              key="onboarding"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col flex-1 items-center justify-center lg:items-start h-full w-full max-w-[1400px] mx-auto min-h-0 px-6 md:p-12 overflow-y-auto lg:overflow-visible custom-scrollbar"
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

                {/* ── NEO-BRUTALIST ARCHITECTURAL ENGINE MODE SELECTOR SLIDER ── */}
                <div className="mt-5 w-full rounded-xl border-2 border-black bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-950/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] relative h-9 flex items-center">
                  <div
                    className={cn(
                      "absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-lg border-2 border-black bg-white transition-all duration-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:border-emerald-400 dark:bg-zinc-900 dark:shadow-none",
                      compilerMode === 'products' ? "left-[calc(50%+2px)]" : "left-0.5"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setCompilerMode('ingredients')}
                    className={cn(
                      "w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                      compilerMode === 'ingredients' ? "text-zinc-950 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-600"
                    )}
                  >
                    // INGREDIENT BASE
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompilerMode('products')}
                    className={cn(
                      "w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                      compilerMode === 'products' ? "text-zinc-950 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-600"
                    )}
                  >
                    // PRODUCT BASE
                  </button>
                </div>

                {/* ── HIGH-DENSITY CARD DECK ASSEMBLY ── */}
                <div className="relative flex items-center justify-start w-full h-[280px] z-30 mt-12 mb-2 overflow-visible">
                  <div className="grid [grid-template-areas:'stack'] place-items-start w-full h-full overflow-visible">
                    {skinCards.map((card, index) => {
                      const isCurrent = skinType === card.name;

                      return (
                        <div
                          key={card.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSkinType(card.name);
                          }}
                          style={{
                            WebkitFontSmoothing: 'subpixel-antialiased',
                            backfaceVisibility: 'hidden',
                          }}
                          className={cn(
                            "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 px-4 py-3 transition-all duration-500 cursor-pointer text-left shadow-lg [grid-area:stack]",
                            "bg-zinc-100/98 border-zinc-300 text-zinc-800 hover:bg-zinc-200/50 hover:border-black/30 dark:bg-zinc-950/95 dark:border-zinc-800/80 dark:hover:bg-zinc-900/95 dark:hover:border-white/20",
                            isCurrent ? card.zIndex : "z-10",
                            isCurrent ? card.activePos : card.inactivePos,
                            isCurrent && "border-black dark:border-emerald-400 bg-white dark:bg-zinc-950 ring-2 ring-black/10 dark:ring-emerald-400/20 shadow-2xl z-50 scale-[1.02]"
                          )}
                        >
                          {/* Top Heading Anchor Segment */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="relative inline-block rounded-full bg-zinc-950 p-1 border border-zinc-800 dark:border-zinc-700">
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
                          <div className="flex items-center justify-between w-full border-t border-zinc-200 dark:border-zinc-900/60 pt-1.5">
                            <p className="text-[8px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
                              {card.date}
                            </p>
                            {isCurrent && (
                              <span className="text-[8px] font-mono font-black text-emerald-500 tracking-widest bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                                SELECTED
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Node Status Monitor */}
                <div className="mt-2 py-2 px-4 rounded-xl bg-white dark:border-white dark:bg-zinc-950/40 font-mono text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest w-fit ">
                  {skinType ? `NODE TARGET // ${skinType.toUpperCase()}_STABLE` : "SELECT YOUR BASE & SKIN TYPE"}
                </div>

                {/* Primary Initializer Execution Button */}
                <button
                  disabled={!skinType}
                  onClick={() => {
                    if (compilerMode === 'products') {
                      router.push('/intersect-lab');
                    } else {
                      setIsOnboarded(true);
                    }
                  }}
                  className="group relative mt-6 flex w-full max-w-xs items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 border-2 border-black px-4 py-3 text-xs font-black tracking-wider text-white uppercase transition-all duration-300 hover:bg-black dark:border-white dark:bg-zinc-100 dark:text-black disabled:opacity-30 disabled:pointer-events-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
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
            {/* UPGRADED: Included state driver handler callback to trigger onboarding drop-outs on request */}
            <Navbar onHomeClick={() => setIsOnboarded(false)} />

            <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-8 gap-6 lg:gap-8 custom-scrollbar">

              {/* 🧪 UPGRADED: INGREDIENT ARSENAL CONTAINER STYLING MATRICES */}
              {/* Copied from intersect-lab: swapped dark:border-white for dark:border-zinc-800 and muted the box shadows */}
              <section className="flex w-full lg:w-80 shrink-0 flex-col rounded-2xl border-2 border-black bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md dark:border-zinc-800 p-5 transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] text-zinc-800 dark:text-zinc-100">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {/* UPGRADED: Text shifted to text-zinc-900 / dark:text-zinc-400 for balanced tracking visual weights */}
                    <h2 className="text-xs font-black tracking-widest text-zinc-900 dark:text-zinc-400 uppercase">
                      Ingredient Arsenal
                    </h2>
                    {/* UPGRADED: Customized configuration chip wrapper frame details */}
                    <span className="text-[8px] tracking-widest font-black px-1.5 py-0.5 border-2 border-black bg-zinc-950 text-white dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-300 uppercase rounded font-mono">
                      Profile: {skinType}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] tracking-wide text-zinc-500 dark:text-zinc-400 uppercase font-bold">
                    Select or drag actives to add to formulation
                  </p>
                </div>

                {/* UPGRADED: Search bar components fully integrated with matte colors and dark:border-zinc-800 boundaries */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 stroke-[2.5]" />
                  <input
                    type="text"
                    placeholder="Search active catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white py-2.5 pl-9 pr-3 text-xs font-bold placeholder-zinc-400 outline-none transition-all dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                {/* UPGRADED: Filter pill navigation bars adapted to custom asset colors */}
                <div className="flex flex-wrap gap-1 mb-4 border-b-2 border-black dark:border-zinc-800 pb-3.5">
                  {matrixFilters.map((filter) => {
                    const isCurrent = activeFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`text-[8px] font-mono font-black tracking-widest uppercase px-2 py-1 rounded-md border-2 transition-all duration-200 ${isCurrent
                          ? 'border-black bg-black text-white dark:border-emerald-400 dark:bg-zinc-900 dark:text-emerald-400'
                          : 'border-black bg-white text-black hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-500 dark:hover:bg-zinc-900'
                          }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none px-1.5 py-1 custom-scrollbar">
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
                </div>

                <ExportPanel />
              </section>

              <section className="flex flex-col flex-1 gap-6 lg:gap-8">
                <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-6 lg:gap-8">
                  <RoutineSlotPanel slot="AM" ingredients={amRoutine} />
                  <RoutineSlotPanel slot="PM" ingredients={pmRoutine} />
                </div>
                <CompilerConsole />
              </section>

            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <MechanismDrawer />
      </AnimatePresence>

    </div>
  );
}