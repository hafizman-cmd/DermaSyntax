'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutineStore } from '@/store/useRoutineStore';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';
import { analyzeCompatibility, type CompatibilityReport } from '@/lib/compatibility-engine';
import {
    RefreshCw, Binary, AlertTriangle, CheckCircle2, ArrowLeftRight, X, XCircle
} from 'lucide-react';

export default function IntersectLab() {
    const skinType = useRoutineStore((state) => state.skinType) || "Normal";

    const [mounted, setMounted] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [slotA, setSlotA] = useState<Product | null>(null);
    const [slotB, setSlotB] = useState<Product | null>(null);

    const [activeBrandA, setActiveBrandA] = useState<string | null>(null);
    const [activeBrandB, setActiveBrandB] = useState<string | null>(null);
    const [brandFilterA, setBrandFilterA] = useState('');
    const [brandFilterB, setBrandFilterB] = useState('');

    // Trigger mounting status on client arrival
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data: Product[] = await res.json();
                setProducts(data);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Unique brand list
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));

    const filteredBrandsA = uniqueBrands.filter(b =>
        b.toLowerCase().includes(brandFilterA.toLowerCase())
    );
    const filteredBrandsB = uniqueBrands.filter(b =>
        b.toLowerCase().includes(brandFilterB.toLowerCase())
    );

    const productsForBrandA = activeBrandA
        ? products.filter(p => p.brand === activeBrandA)
        : [];
    const productsForBrandB = activeBrandB
        ? products.filter(p => p.brand === activeBrandB)
        : [];

    // 🧠 RUNTIME INTERSECT COMPILER LOGIC
    const report: CompatibilityReport | null =
        slotA && slotB ? analyzeCompatibility(slotA, slotB) : null;

    // Renders a safe loading layout matching the main template styling while syncing elements
    if (!mounted || loading) {
        return (
            <div className="relative flex min-h-screen flex-col bg-zinc-50 text-zinc-800 dark:bg-[#050505] dark:text-zinc-100 antialiased font-mono text-[10px] items-center justify-center tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
                    <span>Fetching Product Registry...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-zinc-50 text-zinc-800 dark:bg-[#050505] dark:text-zinc-100 antialiased transition-colors duration-500">

            {/* Background canvas lighting matrix */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-300/40 dark:from-zinc-500/[0.02] via-transparent to-emerald-300/20 dark:to-emerald-500/[0.01] blur-3xl" />
            </div>

            <Navbar
                resetLabel="RESET MATRIX"
                onReset={() => {
                    setSlotA(null);
                    setSlotB(null);
                    setActiveBrandA(null);
                    setActiveBrandB(null);
                    setBrandFilterA('');
                    setBrandFilterB('');
                }} />

            {/* Main Sandbox Frame */}
            <main className="relative z-10 flex flex-col flex-1 max-w-[1500px] w-full mx-auto px-4 py-6 md:p-8 overflow-y-auto">

                {/* Core Deck Label Header Area */}
                <div className="mb-8 border-b-2 border-black dark:border-zinc-800 pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                                <Binary className="h-3 w-3" /> INTERSECT MATRIX MODULE // REGION 02
                            </div>
                            <h1 className="text-2xl font-black tracking-wider text-zinc-900 dark:text-zinc-50 uppercase mt-1">
                                OPEN PRODUCT ANALYZER
                            </h1>
                        </div>
                        <div className="py-1.5 px-3 rounded-lg border-2 border-black bg-white dark:border-zinc-700 dark:bg-zinc-950/40 font-mono text-[10px] text-zinc-600 dark:text-zinc-300 uppercase tracking-widest font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                            PROFILE CONFIG // {skinType.toUpperCase()}_STABLE
                        </div>
                    </div>
                </div>

                {/* ── THREE-COLUMN TRANSFORMATION BENCH ── */}
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 items-start flex-1 min-h-0">

                    {/* ANALYTICAL CARD DOCK A */}
                    <div className="xl:col-span-2 flex flex-col rounded-2xl border-2 border-black bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md dark:border-zinc-800 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] min-h-[360px]">
                        <h2 className="text-xs font-black tracking-widest text-zinc-900 dark:text-zinc-400 uppercase mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" /> COMPONENT CHAMBER A
                        </h2>

                        {!slotA ? (
                            <div className="flex-1 flex flex-col min-h-0">
                                {activeBrandA === null ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Filter Brands..."
                                            value={brandFilterA}
                                            onChange={(e) => setBrandFilterA(e.target.value)}
                                            className="w-full rounded-xl border-2 border-black bg-white py-2 px-3 text-xs font-bold placeholder-zinc-400 outline-none dark:border-zinc-700 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-50 mb-3 shrink-0"
                                        />
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                            {filteredBrandsA.map(brand => (
                                                <button
                                                    key={brand}
                                                    onClick={() => setActiveBrandA(brand)}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">{brand}</span>
                                                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
                                                        {products.filter(p => p.brand === brand).length} products
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-3 shrink-0">
                                            <span className="text-[9px] font-mono font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                                Selected Brand: {activeBrandA}
                                            </span>
                                            <button
                                                onClick={() => { setActiveBrandA(null); setBrandFilterA(''); }}
                                                className="text-[9px] font-mono font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                            >
                                                ← Back to Brands
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                            {productsForBrandA.map(prod => (
                                                <button
                                                    key={prod.id}
                                                    onClick={() => setSlotA(prod)}
                                                    className="w-full text-left p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                                                >
                                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">{prod.name}</span>
                                                    <span className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5">{prod.category} &middot; {prod.applicationSequence}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col justify-between pt-2">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <span className="text-[9px] font-mono font-black tracking-widest bg-zinc-950 text-white dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase border border-zinc-700">
                                                {slotA.brand}
                                            </span>
                                            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-wide uppercase mt-2">
                                                {slotA.name}
                                            </h3>
                                        </div>
                                        <button onClick={() => { setSlotA(null); setActiveBrandA(null); }} className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mt-2 tracking-wide">
                                        {slotA.category}
                                    </p>

                                    <div className="mt-4">
                                        <span className="text-[9px] font-mono font-black tracking-wider text-zinc-400 uppercase">LOADED INGREDIENTS:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {slotA.ingredients.map(ingredient => (
                                                <span key={ingredient} className="text-[9px] font-mono font-black border border-black/10 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                          // {ingredient.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-zinc-400 uppercase tracking-wider">
                                        <span>pH // {slotA.pH}</span>
                                        <span>SOL // {slotA.solubility}</span>
                                        <span>MW // {slotA.molecularWeightProfile}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-900 font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex justify-between">
                                    <span>CAT // {slotA.category}</span>
                                    <span>SEQ // {slotA.applicationSequence}</span>
                                    <span>SYS_LOC_A</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ⚡ UPGRADED: FIXED CENTER INTERSECT DIAGNOSTIC BOX INTERFACE */}
                    {/* Added 'bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md' to adapt perfectly across theme shifts */}
                    <div className="xl:col-span-3 flex flex-col rounded-2xl border-2 border-black bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md dark:border-zinc-800 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] min-h-[360px] self-stretch justify-center items-center text-center relative overflow-hidden">

                        <AnimatePresence mode="wait">
                            {!report ? (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center p-6"
                                >
                                    <div className="h-12 w-12 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4 animate-spin [animation-duration:12s]">
                                        <ArrowLeftRight className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xs font-black tracking-widest text-zinc-900 dark:text-zinc-400 uppercase">
                                        Awaiting Analytical Datasets
                                    </h3>
                                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 max-w-xs mt-1.5 uppercase leading-normal tracking-wide">
                                        Load retail skincare formulations into both Chamber A and Chamber B to compile cross-chemical alignment logs.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="report"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="w-full h-full flex flex-col justify-between text-left"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 border-b-2 border-black dark:border-zinc-800 pb-3 mb-4">
                                            {report.status === "conflict" ? (
                                                <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                                            ) : report.status === "caution" ? (
                                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                            ) : (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                            )}
                                            <h3 className={cn(
                                                "text-xs font-black tracking-widest uppercase font-mono",
                                                report.status === "conflict" && "text-rose-500 dark:text-rose-400",
                                                report.status === "caution" && "text-amber-500 dark:text-amber-400",
                                                report.status === "safe" && "text-emerald-500 dark:text-emerald-400"
                                            )}>
                                                {report.status === "conflict"
                                                    ? "CONFLICT DETECTED"
                                                    : report.status === "caution"
                                                        ? "CAUTION // COMPATIBILITY LIMIT"
                                                        : "SYSTEM OPTIMAL // SAFE RANGE"}
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-[8px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">// CHEMISTRY REPORT EVALUATION:</span>
                                                <p className="text-xs font-bold leading-relaxed text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mt-1">
                                                    {report.reason}
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-xl border-2 border-dashed border-black/10 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                                <span className="text-[8px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">// PROFILE STRUCTURAL TUNING:</span>
                                                <p className="text-[11px] font-bold leading-normal text-zinc-600 dark:text-zinc-300 uppercase tracking-normal mt-1">
                                                    {report.tuning}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-2 border-t border-zinc-100 dark:border-zinc-900 font-mono text-[8px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex justify-between items-center">
                                        <span>ENGINE_CORE_v2.0.0</span>
                                        <span className="flex items-center gap-1">
                                            <span className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                report.status === "conflict" && "bg-rose-500",
                                                report.status === "caution" && "bg-amber-500",
                                                report.status === "safe" && "bg-emerald-500"
                                            )} />
                                            DIAGNOSTIC_COMPLETE
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ANALYTICAL CARD DOCK B */}
                    <div className="xl:col-span-2 flex flex-col rounded-2xl border-2 border-black bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md dark:border-zinc-800 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] min-h-[360px]">
                        <h2 className="text-xs font-black tracking-widest text-zinc-900 dark:text-zinc-400 uppercase mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" /> COMPONENT CHAMBER B
                        </h2>

                        {!slotB ? (
                            <div className="flex-1 flex flex-col min-h-0">
                                {activeBrandB === null ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Filter Brands..."
                                            value={brandFilterB}
                                            onChange={(e) => setBrandFilterB(e.target.value)}
                                            className="w-full rounded-xl border-2 border-black bg-white py-2 px-3 text-xs font-bold placeholder-zinc-400 outline-none dark:border-zinc-700 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-50 mb-3 shrink-0"
                                        />
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                            {filteredBrandsB.map(brand => (
                                                <button
                                                    key={brand}
                                                    onClick={() => setActiveBrandB(brand)}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">{brand}</span>
                                                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
                                                        {products.filter(p => p.brand === brand).length} products
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-3 shrink-0">
                                            <span className="text-[9px] font-mono font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                                Selected Brand: {activeBrandB}
                                            </span>
                                            <button
                                                onClick={() => { setActiveBrandB(null); setBrandFilterB(''); }}
                                                className="text-[9px] font-mono font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                            >
                                                ← Back to Brands
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                            {productsForBrandB.map(prod => (
                                                <button
                                                    key={prod.id}
                                                    onClick={() => setSlotB(prod)}
                                                    className="w-full text-left p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                                                >
                                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">{prod.name}</span>
                                                    <span className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5">{prod.category} &middot; {prod.applicationSequence}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col justify-between pt-2">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <span className="text-[9px] font-mono font-black tracking-widest bg-zinc-950 text-white dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase border border-zinc-700">
                                                {slotB.brand}
                                            </span>
                                            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-wide uppercase mt-2">
                                                {slotB.name}
                                            </h3>
                                        </div>
                                        <button onClick={() => { setSlotB(null); setActiveBrandB(null); }} className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mt-2 tracking-wide">
                                        {slotB.category}
                                    </p>

                                    <div className="mt-4">
                                        <span className="text-[9px] font-mono font-black tracking-wider text-zinc-400 uppercase">LOADED INGREDIENTS:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {slotB.ingredients.map(ingredient => (
                                                <span key={ingredient} className="text-[9px] font-mono font-black border border-black/10 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                          // {ingredient.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-zinc-400 uppercase tracking-wider">
                                        <span>pH // {slotB.pH}</span>
                                        <span>SOL // {slotB.solubility}</span>
                                        <span>MW // {slotB.molecularWeightProfile}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-900 font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex justify-between">
                                    <span>CAT // {slotB.category}</span>
                                    <span>SEQ // {slotB.applicationSequence}</span>
                                    <span>SYS_LOC_B</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </main>
        </div>
    );
}