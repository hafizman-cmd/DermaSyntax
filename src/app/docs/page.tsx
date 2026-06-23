'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedThemeToggler from '@/components/AnimatedThemeToggler';
import GatewayNav from '@/components/GatewayNav';

const chapters = [
  {
    id: 'system-overview',
    label: 'System Overview',
    index: '01',
    accent: 'text-emerald-400',
    accentBorder: 'border-emerald-400/30',
    accentBg: 'bg-emerald-400/10',
  },
  {
    id: 'epidermal-matrix',
    label: 'Epidermal Matrix Taxonomy',
    index: '02',
    accent: 'text-rose-400',
    accentBorder: 'border-rose-400/30',
    accentBg: 'bg-rose-400/10',
  },
  {
    id: 'molecular-compatibility',
    label: 'Molecular Compatibility Protocol',
    index: '03',
    accent: 'text-blue-400',
    accentBorder: 'border-blue-400/30',
    accentBg: 'bg-blue-400/10',
  },
  {
    id: 'api-telemetry',
    label: 'API & Telemetry Schema',
    index: '04',
    accent: 'text-cyan-400',
    accentBorder: 'border-cyan-400/30',
    accentBg: 'bg-cyan-400/10',
  },
] as const;

type ApiSchemaLine =
  | { text: string; type: 'comment' }
  | { text: string; type: 'plain' }
  | { key: string; type: 'key'; value: string; valType: string; comment: string };

const apiSchemaLines: ApiSchemaLine[] = [
  { text: "// Sanitized Product Scheme — post-adapter output", type: "comment" },
  { text: "interface Product {", type: "plain" },
  { key: "  id", type: "key", value: ": string;", valType: "type", comment: " // URL-safe slug" },
  { key: "  name", type: "key", value: ": string;", valType: "type", comment: " // Trimmed display name" },
  { key: "  brand", type: "key", value: ": string;", valType: "type", comment: " // Normalized brand" },
  { key: "  ingredients", type: "key", value: ": string[];", valType: "type", comment: " // Alias-mapped list" },
  { key: "  category", type: "key", value: ": string;", valType: "type", comment: " // e.g., 'Cleanser'" },
  { key: "  pH", type: "key", value: ": number | null;", valType: "type", comment: " // Parsed float or null" },
  { key: "  solubility", type: "key", value: ": 'aqueous' | 'lipophilic';", valType: "type", comment: " // Solvent class" },
  { key: "  molecularWeightProfile", type: "key", value: ": 'Low' | 'Mid' | 'High';", valType: "type", comment: " // Density matrix" },
  { key: "  applicationSequence", type: "key", value: ": 'AM' | 'PM' | 'ALL';", valType: "type", comment: " // Routine lock" },
  { text: "}", type: "plain" }
];

function tokenizeLine(line: ApiSchemaLine): { text: string; className: string }[] {
  if (line.type === 'comment') {
    return [{ text: line.text, className: 'text-zinc-500' }];
  }
  if (line.type === 'plain') {
    const text = line.text;
    if (text === '}') return [{ text: '}', className: 'text-zinc-400' }];
    const match = text.match(/^(interface)\s+(\w+)\s*(\{)$/);
    if (match && match[2]) {
      return [
        { text: 'interface ', className: 'text-purple-400' },
        { text: match[2], className: 'text-cyan-300' },
        { text: ' {', className: 'text-zinc-400' },
      ];
    }
    return [{ text, className: 'text-zinc-300' }];
  }
  if (line.type === 'key') {
    const segments: { text: string; className: string }[] = [];
    segments.push({ text: line.key, className: 'text-blue-300' });
    const value = line.value;
    const tokens = value.match(/('(?:[^'\\]|\\.)*')|(\bstring\b|\bnumber\b|\bnull\b|\bboolean\b)|(\||:|;)|(\s+)/g) || [value];
    for (const token of tokens) {
      if (/^'/.test(token)) {
        segments.push({ text: token, className: 'text-amber-400' });
      } else if (/^(string|number|null|boolean)$/.test(token)) {
        segments.push({ text: token, className: 'text-emerald-400' });
      } else {
        segments.push({ text: token, className: 'text-zinc-500' });
      }
    }
    if (line.comment) {
      segments.push({ text: line.comment, className: 'text-zinc-600' });
    }
    return segments;
  }
  return [];
}

function TerminalTypist({ lines }: { lines: ApiSchemaLine[] }) {
  const lineInfos = React.useMemo(
    () => lines.map((l) => tokenizeLine(l)),
    [lines]
  );

  const [progress, setProgress] = useState({ line: 0, char: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (progress.line >= lineInfos.length) {
      setDone(true);
      return;
    }

    const currentSegments = lineInfos[progress.line];
    const lineText = currentSegments.map(s => s.text).join('');

    if (progress.char >= lineText.length) {
      const timer = setTimeout(() => {
        setProgress({ line: progress.line + 1, char: 0 });
      }, 220);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setProgress(p => ({ ...p, char: p.char + 1 }));
    }, 14);
    return () => clearTimeout(timer);
  }, [progress, done, lineInfos]);

  return (
    <div className="text-[11px] font-mono leading-relaxed">
      {lineInfos.map((segments, li) => {
        if (li > progress.line) return null;

        const lineText = segments.map(s => s.text).join('');
        const visibleLen = li === progress.line ? progress.char : lineText.length;

        let rem = visibleLen;
        const visibleParts: { text: string; className: string }[] = [];
        for (const seg of segments) {
          if (rem <= 0) break;
          const take = Math.min(rem, seg.text.length);
          if (take > 0) {
            visibleParts.push({ text: seg.text.slice(0, take), className: seg.className });
          }
          rem -= take;
        }

        return (
          <div key={li}>
            {visibleParts.map((p, i) => (
              <span key={i} className={p.className}>{p.text}</span>
            ))}
            {li === progress.line && !done && (
              <motion.span
                className="inline-block w-[7px] h-[14px] bg-cyan-400 ml-[1px]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>(chapters[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(chapter.id);
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-zinc-200 antialiased transition-colors duration-500">

      {/* ── FIXED GATEWAY TOP NAVIGATION BAR ── */}
      <GatewayNav statusLabel="DOCS_READY" logoLabel="DERMASYNTAX // DOCS_v1.0.4" />

      {/* ── MAIN SPLIT LAYOUT ── */}
      <div className="flex pt-16">

        {/* ── FIXED LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-72 flex-col border-r border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-[#121212]/60 backdrop-blur-md z-40">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-[9px] font-mono tracking-[0.2em] font-bold text-zinc-600 dark:text-zinc-500 uppercase">
              // TABLE OF CONTENTS
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {chapters.map((chapter) => {
              const isActive = activeSection === chapter.id;
              return (
                <button
                  key={chapter.id}
                  onClick={() => scrollToSection(chapter.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group ${
                    isActive
                      ? `${chapter.accentBg} ${chapter.accentBorder} border`
                      : 'border-transparent hover:bg-zinc-100 dark:hover:bg-white/[0.03] hover:border-zinc-200 dark:hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${
                      isActive ? chapter.accent : 'text-zinc-600 dark:text-zinc-500'
                    }`}>
                      {chapter.index}
                    </span>
                    <span className={`text-[11px] font-semibold tracking-wide uppercase transition-colors ${
                      isActive
                        ? `${chapter.accent}`
                        : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                    }`}>
                      {chapter.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer telemetry */}
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

        {/* ── SCROLLING RIGHT CONTENT PANE ── */}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 space-y-20">

            {/* Page Header */}
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-zinc-600 dark:text-zinc-500 uppercase">
                DERMASYNTAX // TECHNICAL DOCUMENTATION
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
                System Architecture Reference
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                A comprehensive technical reference for the DERMASYNTAX clinical formulation compiler. This document outlines the core systems, taxonomic frameworks, compatibility protocols, and API telemetry schemas that power the engine.
              </p>
              <div className="border-b border-zinc-200 dark:border-zinc-800 pt-4">
                <span className="text-[8px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase">
                  LAST COMPILED // 2026-06-18 &middot; STATUS: STABLE
                </span>
              </div>
            </div>

            {/* ── SECTION 01: SYSTEM OVERVIEW ── */}
            <section id="system-overview" className="scroll-mt-24 space-y-6">
              <div>
                <span className="font-mono text-xl md:text-2xl font-black tracking-wider text-emerald-500 dark:text-emerald-400 select-none block mb-1">01</span>
                <h2 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
                  System Overview
                </h2>
              </div>

              <div className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none p-6 space-y-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  DERMASYNTAX operates as a deterministic formulation compiler — not a recommendation engine. It treats your skincare routine as a sequenced chemical program, evaluating each active ingredient against a rule-based conflict matrix that models pH incompatibilities, oxidation cascades, and receptor-site competition at the stratum corneum level.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The core engine ingests two parallel pipelines — your AM and PM routine stacks — and compiles them through a pure-function rule evaluator. Every add or remove operation triggers a full recompilation, producing a diagnostic output array of severity-coded results: <span className="font-mono text-xs text-red-500">ERROR</span> for chemical burn risk, <span className="font-mono text-xs text-amber-500">WARNING</span> for oxidation or irritation vectors, and <span className="font-mono text-xs text-emerald-500">SUCCESS</span> for validated synergy pairings.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The system maintains zero persistent state between sessions. Each compilation is a clean-slate evaluation, ensuring that the diagnostic output is always a pure reflection of the current routine topology — no cached assumptions, no historical bias, no machine learning drift.
                </p>
              </div>

              {/* Key metrics row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Rule Nodes', value: '10', unit: 'active' },
                  { label: 'Compile Time', value: '<1', unit: 'ms' },
                  { label: 'State Persistence', value: '0', unit: 'sessions' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none p-4 text-center">
                    <span className="block text-xl font-mono font-black text-emerald-400">{metric.value}</span>
                    <span className="block text-[8px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase mt-1">{metric.unit}</span>
                    <span className="block text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mt-2">{metric.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 02: EPIDERMAL MATRIX TAXONOMY ── */}
            <section id="epidermal-matrix" className="scroll-mt-24 space-y-6">
              <div>
                <span className="font-mono text-xl md:text-2xl font-black tracking-wider text-rose-500 dark:text-rose-400 select-none block mb-1">02</span>
                <h2 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
                  Epidermal Matrix Taxonomy
                </h2>
              </div>

              <div className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none p-6 space-y-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Every ingredient in the DERMASYNTAX catalog is classified into one of ten functional categories — from <span className="font-mono text-xs text-purple-400">RETINOID</span> cellular-turnover engines to <span className="font-mono text-xs text-emerald-400">BARRIER_REPAIR</span> lipid-plug compounds. This taxonomy is not decorative; it directly drives the rule engine&apos;s conflict detection logic, determining which ingredient pairs trigger evaluation and which pass through unflagged.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The layering weight system assigns each category a positional index from 1 (thinnest molecular profile — AHAs, BHAs, pure Vitamin C) to 4 (densest barrier compounds — ceramides, squalane, peptides). When an ingredient is added to a routine slot, the engine automatically sorts the stack by this weight, enforcing the correct application sequence from low-viscosity actives to high-viscosity occlusives.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Skin type profiling adds a secondary compatibility layer. Each profile — Oily, Dry, Sensitive, Normal, Combination — activates a distinct set of recommendation and avoidance flags that surface alongside the conflict diagnostics, guiding the user toward formulations calibrated for their specific epidermal environment.
                </p>
              </div>

              {/* Category taxonomy grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { cat: 'RETINOID', color: 'text-purple-400', desc: 'Cellular turnover engines' },
                  { cat: 'AHA', color: 'text-orange-400', desc: 'Surface texturizers' },
                  { cat: 'BHA', color: 'text-orange-400', desc: 'Pore clarifiers' },
                  { cat: 'PURE_VIT_C', color: 'text-yellow-400', desc: 'Antioxidant shields' },
                  { cat: 'VIT_C_DERIVATIVE', color: 'text-yellow-400', desc: 'Stable brighteners' },
                  { cat: 'ANTIOXIDANT', color: 'text-cyan-400', desc: 'Environmental protectors' },
                  { cat: 'BRIGHTENER', color: 'text-pink-400', desc: 'Melanin regulators' },
                  { cat: 'ACNE_TREATMENT', color: 'text-red-400', desc: 'Pathogen neutralizers' },
                  { cat: 'HUMECTANT', color: 'text-blue-400', desc: 'Moisture catchers' },
                  { cat: 'BARRIER_REPAIR', color: 'text-emerald-400', desc: 'Lipid plugs' },
                ].map((item) => (
                  <div key={item.cat} className="rounded-lg border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none px-3 py-2 flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-wider ${item.color}`}>{item.cat}</span>
                    <span className="text-[9px] text-zinc-600 dark:text-zinc-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 03: MOLECULAR COMPATIBILITY PROTOCOL ── */}
            <section id="molecular-compatibility" className="scroll-mt-24 space-y-6">
              <div>
                <span className="font-mono text-xl md:text-2xl font-black tracking-wider text-blue-500 dark:text-blue-400 select-none block mb-1">03</span>
                <h2 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
                  Molecular Compatibility Protocol
                </h2>
              </div>

              <div className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none p-6 space-y-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The Intersect Lab module extends the compiler beyond single-routine analysis into cross-product molecular forensics. When two finished formulations are loaded into opposing analysis chambers, the compatibility engine performs a multi-vector evaluation: pH delta mapping, exfoliant overload detection, and sequential application conflict resolution.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Unlike the routine compiler which operates on abstract ingredient categories, the Intersect Lab works with concrete product data — including full ingredient lists, measured pH values, solubility profiles, and molecular weight classifications. This enables granular conflict detection that accounts for the actual chemical concentrations present in commercial formulations.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The output is a structured <span className="font-mono text-xs text-blue-400">CompatibilityReport</span> object containing a status classification (<span className="font-mono text-xs text-red-500">conflict</span>, <span className="font-mono text-xs text-amber-500">caution</span>, or <span className="font-mono text-xs text-emerald-500">safe</span>), a human-readable reason string, and a tuning recommendation that suggests specific reformulation strategies to resolve detected incompatibilities.
                </p>
              </div>

              {/* Compatibility status legend */}
              <div className="flex gap-3">
                {[
                  { status: 'CONFLICT', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', desc: 'Chemical incompatibility detected' },
                  { status: 'CAUTION', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', desc: 'Irritation risk — monitor usage' },
                  { status: 'SAFE', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', desc: 'No conflicts — compatible pair' },
                ].map((item) => (
                  <div key={item.status} className={`flex-1 rounded-lg border ${item.border} ${item.bg} p-3`}>
                    <span className={`block text-[9px] font-mono font-black tracking-widest ${item.color} uppercase`}>{item.status}</span>
                    <span className="block text-[9px] text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 04: API & TELEMETRY SCHEMA ── */}
            <section id="api-telemetry" className="scroll-mt-24 space-y-6">
              <div>
                <span className="font-mono text-xl md:text-2xl font-black tracking-wider text-cyan-500 dark:text-cyan-400 select-none block mb-1">04</span>
                <h2 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
                  API &amp; Telemetry Schema
                </h2>
              </div>

              <div className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none p-6 space-y-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  DERMASYNTAX exposes two primary API routes for data ingestion. The <span className="font-mono text-xs text-cyan-400">/api/products</span> endpoint serves the sanitized product catalog — each entry normalized through the data adapter pipeline that strips whitespace, maps ingredient aliases, and infers functional group classifications from raw taxonomy strings.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The <span className="font-mono text-xs text-cyan-400">/api/ingredients/search</span> endpoint proxies the Open Beauty Facts taxonomy suggest API with a 350ms debounce, returning structured ingredient objects with auto-inferred categories based on keyword matching against the internal classification matrix.
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  All API responses pass through the data adapter sanitizer before reaching the client layer. This ensures that regardless of upstream data quality — inconsistent casing, trailing whitespace, missing fields — the frontend always receives a clean, typed <span className="font-mono text-xs text-cyan-400">Product</span> or <span className="font-mono text-xs text-cyan-400">Ingredient</span> object conforming to the canonical schema.
                </p>
              </div>

              {/* Terminal-style code block */}
              <div className="rounded-xl border-2 border-zinc-800 dark:border-white/10 bg-[#0d1117] overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-[#0a0f1a]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase ml-2">
                      product_schema.ts
                    </span>
                  </div>
                  <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">
                    CANONICAL OUTPUT
                  </span>
                </div>

                {/* Animated code content */}
                <div className="p-5 overflow-x-auto custom-scrollbar">
                  <TerminalTypist lines={apiSchemaLines} />
                </div>
              </div>

              {/* API endpoint reference */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 dark:text-zinc-500 uppercase font-bold">
                  // ENDPOINT REFERENCE
                </span>
                {[
                  { method: 'GET', path: '/api/products', desc: 'Returns sanitized product catalog' },
                  { method: 'GET', path: '/api/ingredients/search?q=', desc: 'Taxonomy search with 350ms debounce' },
                ].map((endpoint) => (
                  <div key={endpoint.path} className="rounded-lg border-2 border-zinc-800 dark:border-white/10 bg-white dark:bg-[#161616]/70 backdrop-blur-xl shadow-sm dark:shadow-none px-4 py-3 flex items-center gap-3">
                    <span className="text-[9px] font-mono font-black tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
                      {endpoint.method}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{endpoint.path}</span>
                    <span className="text-[10px] text-zinc-700 dark:text-zinc-400 ml-auto">{endpoint.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── PAGE FOOTER ── */}
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
