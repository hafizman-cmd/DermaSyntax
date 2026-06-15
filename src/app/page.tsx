'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import IngredientCard from '@/components/IngredientCard';
import RoutineSlotPanel from '@/components/RoutineSlotPanel';
import CompilerConsole from '@/components/CompilerConsole';
import MechanismDrawer from '@/components/MechanismDrawer';
import { INGREDIENTS } from '@/data/ingredients';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Search, User, ArrowRight, Terminal } from 'lucide-react';
import ExportPanel from '@/components/ExportPanel';

function ElegantShape({
  className = "",
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-zinc-500/[0.08]",
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
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[3px] border-2 border-white/[0.05] shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const amRoutine = useRoutineStore((state) => state.amRoutine);
  const pmRoutine = useRoutineStore((state) => state.pmRoutine);
  const skinType = useRoutineStore((state) => state.skinType);
  const setSkinType = useRoutineStore((state) => state.setSkinType);

  // Interactive UI State Controllers
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string>('ALL');
  const [isOnboarded, setIsOnboarded] = React.useState(false);

  const skinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
  const matrixFilters = ['ALL', 'ACIDS', 'RETINOIDS', 'VITAMINS', 'REPAIRS'];

  // ── MATRIX MULTI-CLASSIFICATION ROUTER ──
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
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#050505] text-zinc-200 antialiased select-none">

      {/* GLOBAL BACKGROUND CANVAS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/[0.03] via-transparent to-emerald-500/[0.02] blur-3xl" />
        <ElegantShape
          delay={0.2}
          width={650}
          height={160}
          rotate={14}
          duration={5.5}
          driftX={25}
          driftY={40}
          gradient="from-zinc-500/[0.06]"
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
          gradient="from-emerald-500/[0.05]"
          className="right-[-5%] md:right-[0%] top-[35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
      </div>

      {/* ANIMATED LAYER ROUTER */}
      <AnimatePresence mode="wait">
        {!isOnboarded ? (

          <motion.div
            key="onboarding"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 flex flex-1 items-center justify-center p-6 h-full w-full"
          >
            <div className="w-full max-w-lg rounded-2xl border border-zinc-900 bg-zinc-950/85 backdrop-blur-xl p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

              {/* SECTION 1: PLATFORM MANIFESTO IDENTITY */}
              <div className="mb-6 pb-6 border-b border-zinc-900/80">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950/40 mb-3.5 text-zinc-400">
                  <Terminal className="h-4 w-4" />
                </div>
                <h1 className="text-sm font-bold tracking-[0.35em] text-zinc-100 uppercase">
                  DERMASYNTAX
                </h1>
                <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mt-0.5">
                  Clinical Formulation Compiler // Core Engine
                </p>
                <p className="mt-3.5 text-[11px] text-zinc-400 leading-relaxed max-w-sm mx-auto font-normal">
                  An advanced algorithmic development environment designed to sequence active chemical components, map molecular application depths, and cross-examine pH variables to prevent skin barrier degradation.
                </p>
              </div>

              {/* SECTION 2: BIOMETRIC INITIALIZATION PARAMETERS */}
              <div>
                <div className="flex items-center justify-center gap-1.5 text-zinc-300">
                  <User className="h-3 w-3 text-zinc-500" />
                  <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase">
                    Initialize Skin Profile
                  </h2>
                </div>
                <p className="mt-1 text-[10px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
                  Select your primary skin classification matrix to calibrate localized real-time diagnostic routing rules.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2 max-w-md mx-auto">
                  {skinTypes.map((type) => {
                    const isCurrent = skinType === type;
                    const isNormalProfile = type === 'Normal';

                    return (
                      <button
                        key={type}
                        onClick={() => setSkinType(type)}
                        className={`rounded-xl border py-2.5 px-4 text-center text-xs font-medium tracking-wide transition-all duration-300 ${isNormalProfile ? 'col-span-2' : 'col-span-1'
                          } ${isCurrent
                            ? 'border-zinc-200 bg-zinc-100 text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.05)] font-semibold'
                            : 'border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                          }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={!skinType}
                onClick={() => setIsOnboarded(true)}
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs font-semibold tracking-wider text-zinc-200 uppercase transition-all duration-300 hover:border-zinc-700 hover:text-zinc-50 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Boot Formulation Rails</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        ) : (

          /* VIEW B: ACTIVE FORMULATION LAB INTERFACE */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col min-h-screen lg:h-screen w-full"
          >
            <Navbar />

            {/* Main container: Stacks vertically on mobile, row on desktop. Scrollable on mobile. */}
            <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-8 gap-6 lg:gap-8">

              {/* Left Side: Ingredient Arsenal (Takes full width on mobile, fixed 80 width on desktop) */}
              <section className="flex w-full lg:w-80 shrink-0 flex-col rounded-2xl border border-zinc-900/60 bg-zinc-950/30 backdrop-blur-md p-5">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
                      Ingredient Arsenal
                    </h2>
                    <span className="text-[8px] tracking-widest font-bold px-1.5 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 uppercase rounded">
                      Profile: {skinType}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] tracking-wide text-zinc-500 uppercase font-medium">
                    Select or drag actives to add to formulation
                  </p>
                </div>

                {/* Search Input Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search active catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950/40 py-2.5 pl-9 pr-3 text-xs placeholder-zinc-600 outline-none transition-all focus:border-zinc-800 text-zinc-100"
                  />
                </div>

                {/* HIGH-DEFINITION MATRIX FILTERS */}
                <div className="flex flex-wrap gap-1 mb-4 border-b border-zinc-900/60 pb-3.5">
                  {matrixFilters.map((filter) => {
                    const isCurrent = activeFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-1 rounded-md border transition-all duration-200 ${isCurrent
                          ? 'border-zinc-500 bg-zinc-900 text-zinc-100 shadow-[0_0_12px_rgba(255,255,255,0.03)]'
                          : 'border-zinc-900/80 bg-zinc-950/20 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'
                          }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>

                {/* Scrollable list container */}
                <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none px-1.5 py-1">
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
                    <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mt-4">
                      No matches found in matrix range.
                    </div>
                  )}
                </div>

                {/* ── MOUNT POINT: CORE BLUEPRINT DISPATCH PANEL ── */}
                <ExportPanel />
                {/* ──────────────────────────────────────────────── */}
              </section>

              {/* Right Side: Workspaces (Renders cleanly underneath the sidebar on mobile views) */}
              <section className="flex flex-col flex-1 gap-6 lg:gap-8">
                {/* AM/PM Track Panel layout wrapper: stacks on mobile, splits on desktop tablets */}
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