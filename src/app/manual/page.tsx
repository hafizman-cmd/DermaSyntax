'use client';

import React, { useState } from 'react';
import { useScroll, motion } from 'framer-motion';
import GatewayNav from '@/components/GatewayNav';

type Mode = 'ingredient' | 'product';

const INGREDIENT_STEPS = [
  {
    index: 'STEP 01',
    title: 'Choose Skin Profile',
    description:
      'Select your skin type (Oily, Dry, Sensitive, Normal, or Combination) so the system can tailor its safety checks and ingredient guidance to your skin\u2019s needs.',
    detail:
      'Picking your skin type tells the system how much tolerance your skin has for active ingredients. Sensitive skin receives stricter warnings, while oily or combination skin allows more flexibility with stronger actives.',
    accent: 'text-emerald-400',
    accentBorder: 'border-emerald-400/30',
    accentBg: 'bg-emerald-400/10',
  },
  {
    index: 'STEP 02',
    title: 'Select Raw Actives',
    description:
      'When building by ingredient, you are picking the pure active compound (like Retinol or Salicylic Acid). Search the Ingredient Arsenal and drag your chosen actives into your AM or PM routine slots.',
    detail:
      'Use the search bar to find ingredients by name or by what they do. Drag and drop each active from the catalog into your morning (AM) or evening (PM) routine to build your personal skincare stack.',
    accent: 'text-blue-400',
    accentBorder: 'border-blue-400/30',
    accentBg: 'bg-blue-400/10',
  },
  {
    index: 'STEP 03',
    title: 'Review Compatibility',
    description:
      'The system automatically reviews your routine and flags any clashes between actives, pH mismatches, or layering mistakes. If it flags a routine conflict, use one product in the morning (AM) and the other at night (PM), or alternate them on different days.',
    detail:
      'Results are color-coded for quick reading: red marks chemical conflicts you should fix right away, amber warns about possible irritation, blue shares helpful notes, and green confirms safe, compatible pairings.',
    accent: 'text-amber-400',
    accentBorder: 'border-amber-400/30',
    accentBg: 'bg-amber-400/10',
  },
  {
    index: 'STEP 04',
    title: 'Set Application Order',
    description:
      'Lock in your routine to get a clear application order. Always apply thin, water-based serums first, followed by thicker emulsions, and finish with heavy creams or oils to lock everything in.',
    detail:
      'Export your final routine via the Export Panel. The Barrier Health gauge gives you a real-time safety score that reflects how stable and skin-friendly your complete routine is.',
    accent: 'text-rose-400',
    accentBorder: 'border-rose-400/30',
    accentBg: 'bg-rose-400/10',
  },
];

const PRODUCT_STEPS = [
  {
    index: 'STEP 01',
    title: 'Find Your Products',
    description:
      'This mode lets you build a routine using complete, branded skincare products from your cabinet. Search the catalog by brand or category, then click to load them into the analyzer.',
    detail:
      'Each product in the catalog comes pre-loaded with its brand, category, pH level, texture, and full ingredient list, so you can compare options without typing anything in yourself.',
    accent: 'text-cyan-400',
    accentBorder: 'border-cyan-400/30',
    accentBg: 'bg-cyan-400/10',
  },
  {
    index: 'STEP 02',
    title: 'Compare Side by Side',
    description:
      'Load your selected products into the two Analysis Chambers (A and B) to compare them side by side, checking for shared ingredients, overlapping actives, or potential irritants.',
    detail:
      'Each chamber shows the full ingredient list, pH reading, and texture profile of the loaded product. Filter by brand to quickly find products in the catalog and compare them head-to-head.',
    accent: 'text-purple-400',
    accentBorder: 'border-purple-400/30',
    accentBg: 'bg-purple-400/10',
  },
  {
    index: 'STEP 03',
    title: 'Review Routine Order',
    description:
      'The system automatically arranges your real-world products into a sensible application order based on their texture, from lightweight serums to richer creams.',
    detail:
      'Unlike the Ingredient Base mode, which works with single raw actives, the Product Base mode looks at the complete, finished products you actually use, including all their ingredients and concentrations.',
    accent: 'text-pink-400',
    accentBorder: 'border-pink-400/30',
    accentBg: 'bg-pink-400/10',
  },
  {
    index: 'STEP 04',
    title: 'Check for Overload',
    description:
      'The system automatically reads the concentrations inside your products. If you use a toner, serum, and cream that all contain Niacinamide, it will warn you if the combined total is high enough to cause redness or skin flaking.',
    detail:
      'CONFLICT means two products contain ingredients that should not be used together, CAUTION means there is a mild irritation risk worth monitoring, and SAFE confirms the paired products work well together with no conflicts.',
    accent: 'text-orange-400',
    accentBorder: 'border-orange-400/30',
    accentBg: 'bg-orange-400/10',
  },
];

export default function ManualPage() {
  const [mode, setMode] = useState<Mode>('ingredient');
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const steps = mode === 'ingredient' ? INGREDIENT_STEPS : PRODUCT_STEPS;
  const currentStep = steps[activeStep];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-zinc-200 antialiased transition-colors duration-500">
      <GatewayNav statusLabel="MANUAL_READY" logoLabel="DERMASYNTAX // MANUAL_v1.0.4" />

      <div className="flex pt-16 min-h-screen">
        {/* ── STICKY LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-72 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#121212]/60 backdrop-blur-md z-40">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-[9px] font-mono tracking-[0.2em] font-bold text-zinc-600 dark:text-zinc-500 uppercase">
              // OPERATOR GUIDE
            </span>
          </div>

          {/* Mode Selector */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-full rounded-xl border border-slate-700 bg-white/[0.03] p-1 relative h-9 flex items-center">
              <div
                className={`absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-lg border border-slate-600 bg-white/[0.06] backdrop-blur-md transition-all duration-300 ${mode === 'product' ? 'left-[calc(50%+2px)]' : 'left-0.5'
                  }`}
              />
              <button
                type="button"
                onClick={() => { setMode('ingredient'); setActiveStep(0); setTimeout(() => scrollToSection('step-01'), 50); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${mode === 'ingredient' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-500'
                  }`}
              >
                INGREDIENT
              </button>
              <button
                type="button"
                onClick={() => { setMode('product'); setActiveStep(0); setTimeout(() => scrollToSection('step-01'), 50); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${mode === 'product' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-500'
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
                  onClick={() => { setActiveStep(i); scrollToSection(`step-${String(i + 1).padStart(2, '0')}`); }}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group ${isActive
                    ? `${step.accentBg} ${step.accentBorder} border`
                    : 'border-transparent hover:bg-zinc-100 dark:hover:bg-white/[0.03] hover:border-zinc-200 dark:hover:border-zinc-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-auto px-3 py-1 rounded-md border text-[10px] font-mono font-black ${isActive
                        ? `${step.accent} ${step.accentBorder} ${step.accentBg}`
                        : 'text-zinc-600 dark:text-zinc-500 border-zinc-800 dark:border-white/20'
                        }`}
                    >
                      <span className="whitespace-nowrap">{step.index}</span>
                    </span>
                    <span
                      className={`text-[11px] font-semibold tracking-wide uppercase transition-colors ${isActive
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
              <span className="text-[8px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase">
                BUILD_V1.0.4
              </span>
              <span className="text-[8px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase">
                &copy; 2026
              </span>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT PANE ── */}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 space-y-12 relative">
            {/* Tracing beam */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800/50 hidden sm:block pointer-events-none">
              <motion.div
                style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                className="w-full h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
              />
            </div>
            {/* Page Header */}
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-zinc-600 dark:text-zinc-500 uppercase">
                DERMASYNTAX // OPERATOR MANUAL
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
                {mode === 'ingredient' ? 'Ingredient Base Mode' : 'Product Base Mode'}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                {mode === 'ingredient'
                  ? 'Welcome to the DERMASYNTAX Manual. This guide explains how our system automatically organizes your skincare steps based on product thickness (texture) and ingredient compatibility, keeping your skin barrier healthy and irritation-free. In Ingredient Base mode, you build your routine from individual raw actives.'
                  : 'Welcome to the DERMASYNTAX Manual. This guide explains how our system automatically organizes your skincare steps based on product thickness (texture) and ingredient compatibility, keeping your skin barrier healthy and irritation-free. In Product Base mode, you build your routine using complete, branded skincare products.'}
              </p>
              <div className="border-b border-zinc-200 dark:border-zinc-800 pt-4">
                <span className="text-[8px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase">
                  WORKFLOW MODE // {mode === 'ingredient' ? 'INGREDIENT_BASE' : 'PRODUCT_BASE'} &middot; STEPS: 04
                </span>
              </div>
            </div>

            {/* Mobile Mode Selector */}
            <div className="lg:hidden w-full rounded-xl border border-slate-700 bg-white/[0.03] p-1 relative h-9 flex items-center">
              <div
                className={`absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-lg border border-slate-600 bg-white/[0.06] backdrop-blur-md transition-all duration-300 ${mode === 'product' ? 'left-[calc(50%+2px)]' : 'left-0.5'
                  }`}
              />
              <button
                type="button"
                onClick={() => { setMode('ingredient'); setActiveStep(0); setTimeout(() => scrollToSection('step-01'), 50); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${mode === 'ingredient' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-500'
                  }`}
              >
                INGREDIENT BASE
              </button>
              <button
                type="button"
                onClick={() => { setMode('product'); setActiveStep(0); setTimeout(() => scrollToSection('step-01'), 50); }}
                className={`w-1/2 h-full relative z-10 font-mono text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${mode === 'product' ? 'text-zinc-950 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-500'
                  }`}
              >
                PRODUCT BASE
              </button>
            </div>

            {/* ── PROCESS DIAGRAM: ALL STEPS ── */}
            <div className="space-y-6 pl-10 sm:pl-16">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <section
                    key={step.index}
                    id={`step-${String(i + 1).padStart(2, '0')}`}
                    className="scroll-mt-24 space-y-4"
                  >
                    {/* Step divider */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-auto px-3 py-1 rounded-lg border text-xs font-mono font-black ${step.accent} ${step.accentBorder} ${step.accentBg}`}
                      >
                        <span className="whitespace-nowrap">{step.index}</span>
                      </span>
                      <div className={`h-px flex-1 ${step.accentBorder.replace('border-', 'bg-').replace('/30', '/20')}`} />
                    </div>

                    {/* Step card */}
                    <div
                      onClick={() => setActiveStep(i)}
                      className={`rounded-xl border-2 backdrop-blur-xl p-6 space-y-3 cursor-pointer transition-all duration-300 ${isActive
                        ? `border-zinc-800 dark:border-white/20 bg-white/95 dark:bg-[#161616]/70 ring-1 ring-zinc-300/50 dark:ring-white/10`
                        : 'border-zinc-800 dark:border-white/10 bg-white/95 dark:bg-[#161616]/70 hover:border-zinc-400 dark:hover:border-white/15'
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

                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {step.description}
                      </p>

                      {isActive && (
                        <div className={`rounded-lg border ${step.accentBorder} ${step.accentBg} p-4 mt-2`}>
                          <span className="text-[8px] font-mono font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                            // TECHNICAL DETAIL
                          </span>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
            <div className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-white/95 dark:bg-[#161616]/70 backdrop-blur-xl p-6">
              <span className="text-[9px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase font-bold block mb-3">
                // WORKFLOW PIPELINE SUMMARY
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {steps.map((step, i) => (
                  <React.Fragment key={step.index}>
                    <button
                      onClick={() => { setActiveStep(i); scrollToSection(`step-${String(i + 1).padStart(2, '0')}`); }}
                      className={`text-[9px] font-mono font-black tracking-wider px-2.5 py-1 rounded-md border transition-all ${activeStep === i
                        ? `${step.accent} ${step.accentBorder} ${step.accentBg}`
                        : 'text-zinc-600 dark:text-zinc-500 border-zinc-800 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
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
                <span className="text-[9px] font-mono tracking-[0.2em] font-medium text-zinc-600 dark:text-zinc-500 uppercase max-w-[60%] leading-relaxed">
                  [SYSTEM NOTICE] — DERMASYNTAX IS A DATA SYNTHESIS ENVIRONMENT FOR INFORMATIONAL TAXONOMY. IT DOES NOT SUBSTITUTE FOR PROFESSIONAL DERMATOLOGICAL ADVICE.
                </span>
                <span className="text-[9px] font-mono tracking-[0.2em] font-medium text-zinc-600 dark:text-zinc-500 uppercase whitespace-nowrap">
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
