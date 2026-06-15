'use client';

import React, { useState } from 'react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Clipboard, MessageCircle, Send, Check } from 'lucide-react';

export default function ExportPanel() {
    const amRoutine = useRoutineStore((state) => state.amRoutine);
    const pmRoutine = useRoutineStore((state) => state.pmRoutine);
    const skinType = useRoutineStore((state) => state.skinType);
    const results = useRoutineStore((state) => state.compilationResults);

    const [copied, setCopied] = useState(false);

    const hasErrors = results.some((r) => r.status === 'ERROR');
    const score = hasErrors ? 20 : Math.max(0, 100 - results.filter((r) => r.status === 'WARNING').length * 15);

    // ── CLINICAL MANIFEST STRING ENGINE ──
    const generateManifestString = (): string => {
        let manifest = `🧪 DERMASYNTAX // CLINICAL BLUEPRINT\n`;
        manifest += `[ CALIBRATION PROFILE: ${skinType?.toUpperCase() || 'NOT_INITIALIZED'} ]\n`;
        manifest += `──────────────────────────────\n\n`;

        manifest += `☀️ AM PIPELINE SEQUENCE:\n`;
        if (amRoutine.length === 0) {
            manifest += `  • [EMPTY_SLOT]\n`;
        } else {
            amRoutine.forEach((ing, i) => {
                manifest += `  • Step 0${i + 1}: ${ing.name}\n`;
            });
        }

        manifest += `\n🌙 PM PIPELINE SEQUENCE:\n`;
        if (pmRoutine.length === 0) {
            manifest += `  • [EMPTY_SLOT]\n`;
        } else {
            pmRoutine.forEach((ing, i) => {
                manifest += `  • Step 0${i + 1}: ${ing.name}\n`;
            });
        }

        manifest += `\n──────────────────────────────\n`;
        manifest += `🛡️ BARRIER ACCURACY SCORE: ${score}%\n`;
        manifest += `System Status: ${hasErrors ? 'CRITICAL_CONFLICT' : 'STABLE_METRIC_PASSED'}\n\n`;
        manifest += `Compiled via DermaSyntax Operational Kernel.`;

        return manifest;
    };

    // Action 1: System Clipboard Write
    const handleCopyToClipboard = async () => {
        try {
            const text = generateManifestString();
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset toast state
        } catch (err) {
            console.error('Failed to parse text matrix to clipboard buffer', err);
        }
    };

    // Action 2: WhatsApp Broadcast Router
    const handleWhatsAppShare = () => {
        const text = generateManifestString();
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };

    // Action 3: Telegram Broadcast Router
    const handleTelegramShare = () => {
        const text = generateManifestString();
        const encodedText = encodeURIComponent(text);
        // Official Telegram share parameters target endpoint
        const telegramUrl = `https://t.me/share/url?url=https://dermasyntax.io&text=${encodedText}`;
        window.open(telegramUrl, '_blank');
    };

    return (
        <div className="mt-4 border-t border-zinc-900/80 pt-4 flex flex-col gap-2">
            <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">
                Blueprint Dispatch Hub
            </span>

            {/* Primary Action Row */}
            <button
                onClick={handleCopyToClipboard}
                className={`w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 ${copied
                        ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
                        : 'border-zinc-900 bg-zinc-950/50 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200 hover:bg-zinc-900/40'
                    }`}
            >
                {copied ? (
                    <>
                        <Check className="h-3 w-3" />
                        <span>Manifest Copied</span>
                    </>
                ) : (
                    <>
                        <Clipboard className="h-3 w-3" />
                        <span>Copy Core Manifest</span>
                    </>
                )}
            </button>

            {/* Network Split Row */}
            <div className="grid grid-cols-2 gap-2">
                {/* WhatsApp Router Trigger */}
                <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/50 py-2 text-[9px] font-semibold tracking-wider text-zinc-400 uppercase transition-all duration-300 hover:border-emerald-900/60 hover:bg-emerald-950/10 hover:text-emerald-400"
                >
                    <MessageCircle className="h-3 w-3 text-emerald-500/60" />
                    <span>WhatsApp</span>
                </button>

                {/* Telegram Router Trigger */}
                <button
                    onClick={handleTelegramShare}
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950/50 py-2 text-[9px] font-semibold tracking-wider text-zinc-400 uppercase transition-all duration-300 hover:border-sky-900/60 hover:bg-sky-950/10 hover:text-sky-400"
                >
                    <Send className="h-3 w-3 text-sky-400/60" />
                    <span>Telegram</span>
                </button>
            </div>
        </div>
    );
}