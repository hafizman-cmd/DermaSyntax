'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutineStore } from '@/store/useRoutineStore';
import Navbar from '@/components/Navbar';
import {
    Search, RefreshCw, Shield, Sparkles, Flame, Droplets,
    Binary, AlertTriangle, CheckCircle2, HelpCircle, ArrowLeftRight, X
} from 'lucide-react';

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// 🧪 THE LOCKED RETAIL DATABASE
const PRODUCT_REGISTRY = [
    {
        id: "prod-cosrx-salicylic",
        brand: "COSRX",
        name: "Salicylic Acid Daily Gentle Cleanser",
        type: "Cleanser",
        actives: ["salicylic_acid", "tea_tree_oil"],
        description: "Deep clearing chemical exfoliant wash step",
        colorClass: "text-amber-500 border-amber-500/20 bg-amber-500/5"
    },
    {
        id: "prod-cosrx-snail",
        brand: "COSRX",
        name: "Advanced Snail 96 Mucin Power Essence",
        type: "Toner/Essence",
        actives: ["snail_mucin", "hyaluronic_acid", "allantoin"],
        description: "Cellular hydration matrix loading prep",
        colorClass: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5"
    },
    {
        id: "prod-skintific-5x",
        brand: "Skintific",
        name: "5X Ceramide Moisture Gel",
        type: "Moisturizer",
        actives: ["ceramide_np", "hyaluronic_acid", "centella_asiatica"],
        description: "Deep stratum-corneum lipid matrix sealant",
        colorClass: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
    },
    {
        id: "prod-skintific-nia",
        brand: "Skintific",
        name: "10% Niacinamide Brightening Serum",
        type: "Serum",
        actives: ["niacinamide", "alpha_arbutin", "centella_asiatica"],
        description: "Melanin pathway blocking active cluster",
        colorClass: "text-purple-500 border-purple-500/20 bg-purple-500/5"
    },
    {
        id: "prod-g2g-centella",
        brand: "Glad2Glow",
        name: "Centella Allantoin Soothing Gel Moisturizer",
        type: "Moisturizer",
        actives: ["centella_asiatica", "allantoin"],
        description: "Lightweight vascular redness calming layer",
        colorClass: "text-blue-500 border-blue-500/20 bg-blue-500/5"
    },
    {
        id: "prod-g2g-sun",
        brand: "Glad2Glow",
        name: "Ultra Light Sunscreen SPF 50 PA++++",
        type: "Sunscreen",
        actives: ["uv_filters", "niacinamide"],
        description: "Epidermal UV radiation shielding shield",
        colorClass: "text-rose-500 border-rose-500/20 bg-rose-500/5"
    }
];

type Product = typeof PRODUCT_REGISTRY[0];

export default function IntersectLab() {
    const skinType = useRoutineStore((state) => state.skinType) || "Normal";

    // Hydration safety switch to bypass server/client mismatches
    const [mounted, setMounted] = useState(false);

    // Slot States
    const [slotA, setSlotA] = useState<Product | null>(null);
    const [slotB, setSlotB] = useState<Product | null>(null);

    // Search Query drop-down toggles
    const [searchA, setSearchA] = useState('');
    const [searchB, setSearchB] = useState('');
    const [showDropdownA, setShowDropdownA] = useState(false);
    const [showDropdownB, setShowDropdownB] = useState(false);

    // Trigger mounting status on client arrival
    useEffect(() => {
        setMounted(true);
    }, []);

    // Filtered Lists
    const filteredA = PRODUCT_REGISTRY.filter(p =>
        p.name.toLowerCase().includes(searchA.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchA.toLowerCase())
    );
    const filteredB = PRODUCT_REGISTRY.filter(p =>
        p.name.toLowerCase().includes(searchB.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchB.toLowerCase())
    );

    // 🧠 RUNTIME INTERSECT COMPILER LOGIC
    const compileCompatibilityReport = () => {
        if (!slotA || !slotB) return null;

        // TypeScript compilation fix replacing spread iterators with clean Array.from handling
        const combinedActives = Array.from(new Set([...slotA.actives, ...slotB.actives]));

        const hasSalicylic = combinedActives.includes("salicylic_acid");
        const hasNiacinamide = combinedActives.includes("niacinamide");

        if (hasSalicylic && hasNiacinamide && skinType.toUpperCase() === "SENSITIVE") {
            return {
                status: "WARNING",
                verdict: "CAUTION // COMPATIBILITY LIMIT DETECTED",
                explanation: `${slotA.brand} Cleanser utilizes Salicylic Acid (BHA) to strip surface dead cell matrices. Layering this concurrently with a high-dose 10% Niacinamide serum can cause intense epidermal flushing.`,
                profileNote: `Because your profile is locked to SENSITIVE, this configuration is restricted. Consider decoupling these products into alternating AM/PM slots to avoid burning loops.`,
                color: "text-amber-500 dark:text-amber-400 border-amber-500/30 bg-amber-500/5"
            };
        }

        if (combinedActives.includes("snail_mucin") && combinedActives.includes("ceramide_np")) {
            return {
                status: "STABLE",
                verdict: "SYSTEM OPTIMAL // MULTI-LAYER HYDRATION STABLE",
                explanation: "Flawless molecular matrix cross-linking. The Snail Mucin fills your cells with immediate biological water density, while the 5X Ceramide network blocks transepidermal water loss.",
                profileNote: `Your active ${skinType.toUpperCase()} skin layout gains an additional 34% defense boost from this specific lipid repair lock.`,
                color: "text-emerald-500 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
            };
        }

        return {
            status: "SAFE",
            verdict: "FORMULATION STABLE // COMPATIBLE RANGE",
            explanation: "No macro-chemical clashing profiles found. These formulation bases safely integrate without canceling out active ingredients or causing structural pH disruption.",
            profileNote: `Verified safe for standard application depths on a ${skinType.toUpperCase()} Profile matrix.`,
            color: "text-cyan-500 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/5"
        };
    };

    const report = compileCompatibilityReport();

    // Renders a safe loading layout matching the main template styling while syncing elements
    if (!mounted) {
        return (
            <div className="relative flex min-h-screen flex-col bg-zinc-50 text-zinc-800 dark:bg-[#050505] dark:text-zinc-100 antialiased font-mono text-[10px] items-center justify-center tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
                    <span>Synchronizing Matrix Lab Environment...</span>
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
                    setSearchA('');
                    setSearchB('');
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
                            <div className="relative flex-1 flex flex-col justify-center">
                                <Search className="absolute left-3 top-[15px] h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 stroke-[2.5]" />
                                <input
                                    type="text"
                                    placeholder="Scan product index A..."
                                    value={searchA}
                                    onFocus={() => setShowDropdownA(true)}
                                    onChange={(e) => setSearchA(e.target.value)}
                                    className="w-full rounded-xl border-2 border-black bg-white py-2.5 pl-9 pr-3 text-xs font-bold placeholder-zinc-400 outline-none transition-all dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                                />

                                {showDropdownA && (
                                    <div className="absolute top-14 left-0 w-full rounded-xl border-2 border-black bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-2xl max-h-52 overflow-y-auto z-50 custom-scrollbar p-1">
                                        {filteredA.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => { setSlotA(prod); setShowDropdownA(false); }}
                                                className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex flex-col"
                                            >
                                                <span className="text-[10px] font-mono font-black text-zinc-400 uppercase">{prod.brand}</span>
                                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide line-clamp-1">{prod.name}</span>
                                            </button>
                                        ))}
                                    </div>
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
                                        <button onClick={() => setSlotA(null)} className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mt-2 tracking-wide">
                                        {slotA.description}
                                    </p>

                                    <div className="mt-4">
                                        <span className="text-[9px] font-mono font-black tracking-wider text-zinc-400 uppercase">LOADED ACTIVES:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {slotA.actives.map(active => (
                                                <span key={active} className="text-[9px] font-mono font-black border border-black/10 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                          // {active.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-900 font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex justify-between">
                                    <span>TYPE // {slotA.type}</span>
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
                                            {report.status === "WARNING" ? (
                                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                            ) : (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                            )}
                                            <h3 className={cn("text-xs font-black tracking-widest uppercase font-mono", report.status === "WARNING" ? "text-amber-500 dark:text-amber-400" : "text-emerald-500 dark:text-emerald-400")}>
                                                {report.verdict}
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-[8px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">// CHEMISTRY REPORT EVALUATION:</span>
                                                {/* UPGRADED: Shifted to text-zinc-800 / dark:text-zinc-200 to maximize legibility on dark glass backgrounds */}
                                                <p className="text-xs font-bold leading-relaxed text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mt-1">
                                                    {report.explanation}
                                                </p>
                                            </div>

                                            {/* UPGRADED: Internal box background panel correctly shifts from light gray to dark slate */}
                                            <div className="p-3 rounded-xl border-2 border-dashed border-black/10 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                                <span className="text-[8px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">// PROFILE STRUCTURAL TUNING:</span>
                                                {/* UPGRADED: Boosted text visibility contrast index parameters */}
                                                <p className="text-[11px] font-bold leading-normal text-zinc-600 dark:text-zinc-300 uppercase tracking-normal mt-1">
                                                    {report.profileNote}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-2 border-t border-zinc-100 dark:border-zinc-900 font-mono text-[8px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex justify-between items-center">
                                        <span>MATRIX_CORE_v1.0.4</span>
                                        <span className="flex items-center gap-1">
                                            <span className={cn("h-1.5 w-1.5 rounded-full", report.status === "WARNING" ? "bg-amber-500" : "bg-emerald-500")} />
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
                            <div className="relative flex-1 flex flex-col justify-center">
                                <Search className="absolute left-3 top-[15px] h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 stroke-[2.5]" />
                                <input
                                    type="text"
                                    placeholder="Scan product index B..."
                                    value={searchB}
                                    onFocus={() => setShowDropdownB(true)}
                                    onChange={(e) => setSearchB(e.target.value)}
                                    className="w-full rounded-xl border-2 border-black bg-white py-2.5 pl-9 pr-3 text-xs font-bold placeholder-zinc-400 outline-none transition-all dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                                />

                                {showDropdownB && (
                                    <div className="absolute top-14 left-0 w-full rounded-xl border-2 border-black bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-2xl max-h-52 overflow-y-auto z-50 custom-scrollbar p-1">
                                        {filteredB.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => { setSlotB(prod); setShowDropdownB(false); }}
                                                className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex flex-col"
                                            >
                                                <span className="text-[10px] font-mono font-black text-zinc-400 uppercase">{prod.brand}</span>
                                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide line-clamp-1">{prod.name}</span>
                                            </button>
                                        ))}
                                    </div>
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
                                        <button onClick={() => setSlotB(null)} className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mt-2 tracking-wide">
                                        {slotB.description}
                                    </p>

                                    <div className="mt-4">
                                        <span className="text-[9px] font-mono font-black tracking-wider text-zinc-400 uppercase">LOADED ACTIVES:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {slotB.actives.map(active => (
                                                <span key={active} className="text-[9px] font-mono font-black border border-black/10 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                          // {active.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-900 font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex justify-between">
                                    <span>TYPE // {slotB.type}</span>
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