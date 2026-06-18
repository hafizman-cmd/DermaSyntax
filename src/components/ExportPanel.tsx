'use client';

import React from 'react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Copy, MessageSquare, Send, Check } from 'lucide-react';

export default function ExportPanel() {
    const amRoutine = useRoutineStore((state) => state.amRoutine);
    const pmRoutine = useRoutineStore((state) => state.pmRoutine);
    const skinType = useRoutineStore((state) => state.skinType);

    const [copied, setCopied] = React.useState(false);

    const generateManifestText = () => {
        const amList = amRoutine.map((i, idx) => `  Step 0${idx + 1}: ${i.name} [${i.category}]`).join('\n') || '  No actives assigned.';
        const pmList = pmRoutine.map((i, idx) => `  Step 0${idx + 1}: ${i.name} [${i.category}]`).join('\n') || '  No actives assigned.';

        return `[DERMASYNTAX BLUEPRINT MANIFEST]\nProfile Matrix: ${skinType || 'Not Set'}\n\nAM SEQUENCE:\n${amList}\n\nPM SEQUENCE:\n${pmList}\n\nGenerated secure barrier framework protocol successfully.`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generateManifestText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to dispatch layout packet to clipboard:', err);
        }
    };

    const shareToApp = (platform: 'whatsapp' | 'telegram') => {
        const text = encodeURIComponent(generateManifestText());
        const url = platform === 'whatsapp'
            ? `https://api.whatsapp.com/send?text=${text}`
            : `https://t.me/share/url?url=${text}`;
        window.open(url, '_blank');
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-700 select-none flex flex-col gap-2.5 transition-colors duration-300">

            <span className="text-[9px] font-black tracking-[0.2em] text-black dark:text-white uppercase transition-colors duration-300">
                Blueprint Dispatch Hub
            </span>

            {/* UPGRADED: Button is now white with a thick black border in light mode, switching to dark mode properly */}
            <button
                onClick={handleCopy}
                className="group relative flex w-full h-11 items-center justify-center gap-2 overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-xs font-black tracking-wider uppercase transition-all duration-300"
            >
                {copied ? (
                    <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                        <span className="text-emerald-600 dark:text-emerald-400">Blueprint Copied!</span>
                    </>
                ) : (
                    <>
                        <Copy className="h-3.5 w-3.5 text-black dark:text-white group-hover:scale-110 transition-transform stroke-[2.5]" />
                        <span>Copy Core Manifest</span>
                    </>
                )}
            </button>

            <div className="flex items-center gap-2">
                  <button
                    onClick={() => shareToApp('whatsapp')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-black hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-[10px] h-10 rounded-xl transition-all uppercase tracking-wide"
                  >
                    <MessageSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                    <span>WhatsApp</span>
                </button>

                  <button
                    onClick={() => shareToApp('telegram')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-black hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-[10px] h-10 rounded-xl transition-all uppercase tracking-wide"
                  >
                    <Send className="h-3 w-3 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                    <span>Telegram</span>
                </button>
            </div>
        </div>
    );
}