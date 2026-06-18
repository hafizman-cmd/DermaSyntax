'use client';

import React, { useState } from 'react';
import GatewayNav from '@/components/GatewayNav';

type Mode = 'ingredient' | 'product';

const INGREDIENT_STEPS = [
  {
    index: '01',
    title: 'Define Matrix',
    description:
      'Select your target epidermal matrix profile — Oily, Dry, Sensitive, Normal, or Combination. This initializes the constraint boundary for all downstream compilation passes.',
    detail:
      'The matrix selector calibrates pH tolerance windows, sebum routing thresholds, and barrier permeability coefficients specific to your skin topology.',
    accent: 'text-emerald-400',
    accentBorder: 'border-emerald-400/30',
    accentBg: 'bg-emerald-400/10',
  },
  {
    index: '02',
    title: 'Molecular Input',
    description:
      'Load active ingredients from the catalog into your AM/PM routine slots. Each compound is tagged with its functional category, molecular weight profile, and solubility class.',
    detail:
      'Use the search bar to query the Open Beauty Facts taxonomy or browse the static arsenal. Drag-and-drop cards into formulation rails to register them in the compilation stack.',
    accent: 'text-blue-400',
    accentBorder: 'border-blue-400/30',
    accentBg: 'bg-blue-400/10',
  },
  {
    index: '03',
    title: 'Compiler Validation',
    description:
      'The rule engine executes a full recompilation on every add/remove operation, evaluating pH incompatibilities, oxidation cascades, and receptor-site competition vectors.',
    detail:
      'Diagnostic output is severity-coded: ERROR for chemical burn risk, WARNING for oxidation or irritation vectors, INFO for botanical buffer interventions, and SUCCESS for validated synergy pairings.',
    accent: 'text-amber-400',
    accentBorder: 'border-amber-400/30',
    accentBg: 'bg-amber-400/10',
  },
  {
    index: '04',
    title: 'Sequence Output',
    description:
      'Review the compiled routine manifest. Ingredients are auto-sorted by layering weight — from low-viscosity actives (AHAs, BHAs, pure Vitamin C) to high-viscosity occlusives (ceramides, squalane).',
    detail:
      'Export the final sequence via the Export Panel. The Barrier Health gauge provides a real-time composite score reflecting the overall safety and stability of your formulation.',
    accent: 'text-rose-400',
    accentBorder: 'border-rose-400/30',
    accentBg: 'bg-rose-400/10',
  },
];

const PRODUCT_STEPS = [
  {
    index: '01',
    title: 'Inventory Import',
    description:
      'The product catalog is fetched from the /api/products endpoint and sanitized through the data adapter pipeline — stripping whitespace, mapping ingredient aliases, and inferring functional group classifications.',
    detail:
      'Each product entry is normalized into a typed Product object containing brand, category, pH value, solubility class, molecular weight profile, and application sequence metadata.',
    accent: 'text-cyan-400',
    accentBorder: 'border-cyan-400/30',
    accentBg: 'bg-cyan-400/10',
  },
  {
    index: '02',
    title: 'Chassis Mapping',
    description:
      'Load finished formulations into opposing analysis chambers (A and B). Filter by brand to navigate the product registry and select candidates for cross-molecular evaluation.',
    detail:
      'Each chamber displays the full ingredient manifest, pH reading, solubility classification, and molecular weight profile of the loaded product for transparent forensic analysis.',
    accent: 'text-purple-400',
    accentBorder: 'border-purple-400/30',
    accentBg: 'bg-purple-400/10',
  },
  {
    index: '03',
    title: 'Layering Logic',
    description:
      'The compatibility engine performs multi-vector evaluation across both chambers: pH delta mapping, exfoliant overload detection, and sequential application conflict resolution.',
    detail:
      'Unlike the routine compiler which operates on abstract ingredient categories, the Intersect Lab works with concrete product data — actual chemical concentrations present in commercial formulations.',
    accent: 'text-pink-400',
    accentBorder: 'border-pink-400/30',
    accentBg: 'bg-pink-400/10',
  },
  {
    index: '04',
    title: 'Tolerance Threshold',
    description:
      'The output is a structured CompatibilityReport containing a status classification (CONFLICT, CAUTION, or SAFE), a human-readable reason string, and a tuning recommendation.',
    detail:
      'CONFLICT flags chemical incompatibility requiring immediate separation. CAUTION indicates irritation risk requiring monitored usage. SAFE confirms no detected conflicts between the paired formulations.',
    accent: 'text-orange-400',
    accentBorder: 'border-orange-400/30',
    accentBg: 'bg-orange-400/10',
  },
];

export default function ManualPage() {
  const [mode, setMode] = useState<Mode>('ingredient');
  const [activeStep, setActiveStep] = useState(0);

  const steps = mode === 'ingredient' ? INGREDIENT_STEPS : PRODUCT_STEPS;
  const currentStep = steps[activeStep];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-zinc-200 antialiased transition-colors duration-500">
      <GatewayNav statusLabel="MANUAL_READY" logoLabel="DERMASYNTAX // MANUAL_v1.0.4" />

      <div className="flex pt-16 min-h-screen">
        {/* ── STICKY LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-72 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#121212]/60 backdrop-blur-md z-40">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-[9px] font-mono tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-600 uppercase">
              // OPERATOR GUIDE
            </span>
          </div>

          {/* Mode Selector */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-full rounded-xl border border-slate-700 bg-white/[0.03] p-1 relative h-9 flex items-center">
              <div
                className={`absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-lg border border-slate-600 bg-white/[0.06] backdrop-blur-md transition-all duration-300 ${
                  mode === 'product' ? 'left-[calc(50%+2px)]' : 'left-0.5'
                }`}
              />
              <button
                type="button"
                onClick={() => { setMode('ingredient'); setActiveStep(0); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  mode === 'ingredient' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                INGREDIENT
              </button>
              <button
                type="button"
                onClick={() => { setMode('product'); setActiveStep(0); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  mode === 'product' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                PRODUCT
              </button>
            </div>
          </div>

          {/* Step Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {steps.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <button
                  key={step.index}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group ${
                    isActive
                      ? `${step.accentBg} ${step.accentBorder} border`
                      : 'border-transparent hover:bg-zinc-100 dark:hover:bg-white/[0.03] hover:border-zinc-200 dark:hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-md border text-[10px] font-mono font-black ${
                        isActive
                          ? `${step.accent} ${step.accentBorder} ${step.accentBg}`
                          : 'text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      {step.index}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tracking-wide uppercase transition-colors ${
                        isActive
                          ? step.accent
                          : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
                BUILD_V1.0.4
              </span>
              <span className="text-[8px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
                &copy; 2026
              </span>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT PANE ── */}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 space-y-12">
            {/* Page Header */}
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-zinc-400 dark:text-zinc-600 uppercase">
                DERMASYNTAX // OPERATOR MANUAL
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
                {mode === 'ingredient' ? 'Ingredient Base Mode' : 'Product Base Mode'}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                {mode === 'ingredient'
                  ? 'A step-by-step workflow for building and validating skincare formulations from individual active compounds using the Ingredient Base compiler engine.'
                  : 'A step-by-step workflow for cross-product molecular forensics using the Product Base Intersect Lab analyzer module.'}
              </p>
              <div className="border-b border-zinc-200 dark:border-zinc-800 pt-4">
                <span className="text-[8px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
                  WORKFLOW MODE // {mode === 'ingredient' ? 'INGREDIENT_BASE' : 'PRODUCT_BASE'} &middot; STEPS: 04
                </span>
              </div>
            </div>

            {/* Mobile Mode Selector */}
            <div className="lg:hidden w-full rounded-xl border border-slate-700 bg-white/[0.03] p-1 relative h-9 flex items-center">
              <div
                className={`absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-lg border border-slate-600 bg-white/[0.06] backdrop-blur-md transition-all duration-300 ${
                  mode === 'product' ? 'left-[calc(50%+2px)]' : 'left-0.5'
                }`}
              />
              <button
                type="button"
                onClick={() => { setMode('ingredient'); setActiveStep(0); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  mode === 'ingredient' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                INGREDIENT BASE
              </button>
              <button
                type="button"
                onClick={() => { setMode('product'); setActiveStep(0); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  mode === 'product' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                PRODUCT BASE
              </button>
            </div>

            {/* ── PROCESS DIAGRAM: ALL STEPS ── */}
            <div className="space-y-6">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <section
                    key={step.index}
                    id={`step-${step.index}`}
                    className="scroll-mt-24 space-y-4"
                  >
                    {/* Step divider */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center h-8 w-8 rounded-lg border text-xs font-mono font-black ${step.accent} ${step.accentBorder} ${step.accentBg}`}
                      >
                        {step.index}
                      </span>
                      <div className={`h-px flex-1 ${step.accentBorder.replace('border-', 'bg-').replace('/30', '/20')}`} />
                    </div>

                    {/* Step card */}
                    <div
                      onClick={() => setActiveStep(i)}
                      className={`rounded-xl border backdrop-blur-xl p-6 space-y-3 cursor-pointer transition-all duration-300 ${
                        isActive
                          ? `border-zinc-300 dark:border-white/20 bg-white/95 dark:bg-[#161616]/70 ring-1 ring-zinc-300/50 dark:ring-white/10`
                          : 'border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#161616]/70 hover:border-zinc-300 dark:hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
                          {step.title}
                        </h2>
                        {isActive && (
                          <span className={`text-[8px] font-mono font-black tracking-widest ${step.accent} uppercase animate-pulse`}>
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {step.description}
                      </p>

                      {isActive && (
                        <div className={`rounded-lg border ${step.accentBorder} ${step.accentBg} p-4 mt-2`}>
                          <span className="text-[8px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                            // TECHNICAL DETAIL
                          </span>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Connector line between steps */}
                    {i < steps.length - 1 && (
                      <div className="flex justify-start pl-4">
                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* ── WORKFLOW SUMMARY FOOTER ── */}
            <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#161616]/70 backdrop-blur-xl p-6">
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase font-bold block mb-3">
                // WORKFLOW PIPELINE SUMMARY
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {steps.map((step, i) => (
                  <React.Fragment key={step.index}>
                    <button
                      onClick={() => setActiveStep(i)}
                      className={`text-[9px] font-mono font-black tracking-wider px-2.5 py-1 rounded-md border transition-all ${
                        activeStep === i
                          ? `${step.accent} ${step.accentBorder} ${step.accentBg}`
                          : 'text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                      }`}
                    >
                      {step.index}.{step.title.toUpperCase().replace(/ /g, '_')}
                    </button>
                    {i < steps.length - 1 && (
                      <span className="text-zinc-300 dark:text-zinc-700 text-xs">&rarr;</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Page Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 pt-6 pb-12">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-[0.2em] font-medium text-zinc-400 dark:text-zinc-600 uppercase max-w-[60%] leading-relaxed">
                  [SYSTEM NOTICE] — DERMASYNTAX IS A DATA SYNTHESIS ENVIRONMENT FOR INFORMATIONAL TAXONOMY. IT DOES NOT SUBSTITUTE FOR PROFESSIONAL DERMATOLOGICAL ADVICE.
                </span>
                <span className="text-[9px] font-mono tracking-[0.2em] font-medium text-zinc-400 dark:text-zinc-600 uppercase whitespace-nowrap">
                  &copy; 2026 DERMASYNTAX // SYS_REF: BUILD_V1.0.4
                </span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
