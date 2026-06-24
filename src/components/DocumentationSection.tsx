'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

export default function DocumentationSection() {
  return (
    <div className="mx-auto max-w-3xl w-full px-6 md:px-12 space-y-20">
      {/* Page Header */}
      <div className="space-y-4">
        <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-zinc-600 dark:text-zinc-500 uppercase">
          DERMASYNTAX // TECHNICAL DOCUMENTATION
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
          System Architecture Reference
        </h2>
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
      <section className="space-y-6">
        <div>
          <span className="font-mono text-4xl md:text-6xl font-black tracking-wider text-emerald-500 dark:text-emerald-400 select-none block mb-1">01</span>
          <h3 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
            System Overview
          </h3>
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
      <section className="space-y-6">
        <div>
          <span className="font-mono text-4xl md:text-6xl font-black tracking-wider text-rose-500 dark:text-rose-400 select-none block mb-1">02</span>
          <h3 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
            Epidermal Matrix Taxonomy
          </h3>
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
      <section className="space-y-6">
        <div>
          <span className="font-mono text-4xl md:text-6xl font-black tracking-wider text-blue-500 dark:text-blue-400 select-none block mb-1">03</span>
          <h3 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
            Molecular Compatibility Protocol
          </h3>
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
        <div className="flex flex-col sm:flex-row gap-3">
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
      <section className="space-y-6">
        <div>
          <span className="font-mono text-4xl md:text-6xl font-black tracking-wider text-cyan-500 dark:text-cyan-400 select-none block mb-1">04</span>
          <h3 className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase font-mono">
            API &amp; Telemetry Schema
          </h3>
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
    </div>
  );
}
