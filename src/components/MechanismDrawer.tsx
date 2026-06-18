'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRoutineStore } from '@/store/useRoutineStore';
import { X, Activity, Layers, Droplet } from 'lucide-react';

export default function MechanismDrawer() {
    const selectedIngredient = useRoutineStore((state) => state.selectedDrawerIngredient);
    const closeDrawer = useRoutineStore((state) => state.closeDrawer);
    const skinType = useRoutineStore((state) => state.skinType);

    if (!selectedIngredient) return null;

    // ── BIO-CHEMICAL DATA GENERATOR ──
    const getBiometrics = () => {
        const cat = selectedIngredient.category;
        const name = selectedIngredient.name.toLowerCase();

        let ph = '5.0 - 5.5 (Skin Neutral)';
        let weight = 'Mid Weight (300 Da)';
        let depth = 'Stratum Corneum Layer';
        let summary = 'Provides standard antioxidant barriers and surface cell matrix balancing.';

        if (cat === 'AHA' || cat === 'PURE_VIT_C') {
            ph = '3.0 - 3.5 (Highly Acidic)';
            weight = 'Low Weight (76 Da)';
            depth = 'Basal Cellular Layers';
            summary = 'Low molecular profile allows deep penetration to trigger immediate micro-exfoliation and cellular turnover.';
        } else if (cat === 'BHA') {
            ph = '3.5 - 4.0 (Lipid Acidic)';
            weight = 'Low Weight (138 Da)';
            depth = 'Sebaceous Pores & Follicles';
            summary = 'Lipid-soluble vector structure directly dissolves sebum plugs inside the interior follicular tracking walls.';
        } else if (cat === 'RETINOID') {
            ph = '6.0 - 6.5 (Neutral)';
            weight = 'Mid Weight (286 Da)';
            depth = 'Dermal Fibroblast Layer';
            summary = 'Triggers gene expression pathways directly converting into retinoic acid to accelerate production metrics.';
        } else if (cat === 'BARRIER_REPAIR' || cat === 'HUMECTANT') {
            ph = '5.5 (Optimal Barrier)';
            weight = 'High Weight (1000+ Da)';
            depth = 'Stratum Corneum Surface';
            summary = 'Forms a cross-linked protective moisture net across intercellular lipid structures to stop dehydration.';
        }

        return { ph, weight, depth, summary };
    };

    const bio = getBiometrics();

    return (
        <>
            {/* Translucent Backdrop Blur Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDrawer}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* ── THE LUXURY MEDICAL SPECIFICATION DRAWER ── */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-slate-700 bg-zinc-950/80 backdrop-blur-2xl p-6 shadow-[-10px_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            >
                <div>
                    {/* Header Panel */}
                    <div className="flex items-center justify-between border-b border-slate-700 pb-5">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                                Molecular Inspection Engine
                            </span>
                            <h2 className="text-sm font-semibold tracking-wide text-zinc-100">
                                {selectedIngredient.name}
                            </h2>
                        </div>
                        <button
                            onClick={closeDrawer}
                             className="rounded-lg border border-slate-700 bg-zinc-950/40 p-2 text-zinc-500 hover:border-slate-600 hover:text-zinc-200 transition-all"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* Diagnostic Metrics Stack */}
                    <div className="mt-8 space-y-4">

                        {/* Stat Box 1: pH Layer */}
                        <div className="rounded-xl border border-slate-700 bg-slate-700/10 p-4 flex items-start gap-3.5">
                            <div className="p-2 rounded-lg border border-slate-700 bg-zinc-950 text-zinc-400 mt-0.5">
                                <Activity className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Chemical pH Level</span>
                                <span className="text-xs font-mono text-zinc-200 mt-1">{bio.ph}</span>
                            </div>
                        </div>

                        {/* Stat Box 2: Target Depth */}
                        <div className="rounded-xl border border-slate-700 bg-slate-700/10 p-4 flex items-start gap-3.5">
                            <div className="p-2 rounded-lg border border-slate-700 bg-zinc-950 text-zinc-400 mt-0.5">
                                <Layers className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Absorption Depth</span>
                                <span className="text-xs font-medium text-zinc-200 mt-1">{bio.depth}</span>
                                <span className="text-[9px] font-mono text-zinc-500 mt-0.5">{bio.weight}</span>
                            </div>
                        </div>

                        {/* Stat Box 3: Mechanism Text Block */}
                        <div className="rounded-xl border border-slate-700 bg-slate-700/10 p-4 flex items-start gap-3.5">
                            <div className="p-2 rounded-lg border border-slate-700 bg-zinc-950 text-zinc-400 mt-0.5">
                                <Droplet className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Mechanism of Action</span>
                                <p className="text-[11px] leading-relaxed text-zinc-400 mt-1.5">{bio.summary}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Bio-Compatibility Alignment Readout */}
                <div className="border-t border-slate-700 pt-5">
                    <div className="rounded-xl border border-slate-700/80 bg-zinc-950/40 p-4 flex flex-col gap-2">
                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                            Active Calibration Parameters
                        </span>
                        <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="text-zinc-400">Target Profile:</span>
                            <span className="font-bold tracking-widest text-zinc-200 uppercase text-[10px] px-2 py-0.5 border border-slate-700 bg-slate-700 rounded">
                                {skinType || 'None'}
                            </span>
                        </div>
                    </div>
                </div>

            </motion.div>
        </>
    );
}