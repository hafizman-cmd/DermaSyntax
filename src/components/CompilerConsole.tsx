'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutineStore } from '@/store/useRoutineStore';
import { Terminal, Cpu, Radio } from 'lucide-react';

export default function CompilerConsole() {
  const results = useRoutineStore((state) => state.compilationResults);
  const amRoutine = useRoutineStore((state) => state.amRoutine);
  const pmRoutine = useRoutineStore((state) => state.pmRoutine);

  const isActive = amRoutine.length > 0 || pmRoutine.length > 0;
  const hasErrors = results.some((r) => r.status === 'ERROR');
  const hasWarnings = results.some((r) => r.status === 'WARNING');

  // ── LIVE-UPDATING METRIC CLOCK LOG ──
  const [timestamp, setTimestamp] = React.useState('');

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimestamp(`${year}-${month}-${day} // ${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine terminal node metrics
  let pulseColor = 'bg-zinc-600 shadow-[0_0_8px_rgba(113,113,122,0.4)]';
  let consoleBorder = 'border-zinc-900';
  let headerText = 'CORE_IDLE';

  if (isActive) {
    if (hasErrors) {
      pulseColor = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
      consoleBorder = 'border-red-950/60 bg-red-950/5';
      headerText = 'CRITICAL_CONFLICT';
    } else if (hasWarnings) {
      pulseColor = 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]';
      consoleBorder = 'border-amber-950/60 bg-amber-950/5';
      headerText = 'PRECAUTION_WARNING';
    } else {
      pulseColor = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]';
      consoleBorder = 'border-zinc-900';
      headerText = 'SEQUENCE_STABLE';
    }
  }

  return (
    /* ── CORE WRAPPER: Implements keyframe opacity flicker when state changes ── */
    <motion.div
      key={`${hasErrors}-${hasWarnings}-${results.length}`}
      animate={hasErrors ? { opacity: [0.85, 1, 0.9, 1, 0.95, 1] } : { opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className={`flex h-48 w-full flex-col rounded-2xl border bg-zinc-950/40 backdrop-blur-md p-5 font-mono select-none transition-all duration-500 ${consoleBorder}`}
    >

      {/* ── MONITOR TERMINAL TOP HEADER BAR ── */}
      <div className="flex items-center justify-between border-b border-zinc-900/80 pb-3 mb-4 text-[9px] font-bold tracking-widest text-zinc-500">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="h-3 w-3 text-zinc-500" />
            <span>[ DIAGNOSTIC_PARSER ]</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-zinc-900 pl-5">
            <Cpu className="h-3 w-3 text-zinc-600" />
            <span>STATE: <span className={hasErrors ? 'text-red-400' : hasWarnings ? 'text-amber-400' : isActive ? 'text-emerald-400' : 'text-zinc-500'}>[{headerText}]</span></span>
          </div>
        </div>

        {/* Real-time Hardware System Log Clock Line */}
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 font-medium hidden md:inline">SYS_MONITOR // LINK_01</span>
          <span className="text-zinc-400 font-semibold bg-zinc-900/30 border border-zinc-900 px-2 py-0.5 rounded">
            {timestamp || 'INITIALIZING_CLOCK...'}
          </span>

          {/* Pulsating Diagnostic Heartbeat Pulse Node */}
          <div className="relative flex h-2 w-2 ml-1">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor}`} />
          </div>
        </div>
      </div>

      {/* ── MONITOR STREAM CONTENT VIEWPORT ── */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar text-[11px] leading-relaxed">
        <AnimatePresence mode="popLayout">

          {!isActive ? (
            /* System Resting IDLE Layout Frame */
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-zinc-600 tracking-wide font-medium flex items-center gap-2 py-1"
            >
              <Radio className="h-3.5 w-3.5 text-zinc-700 animate-pulse shrink-0" />
              <span>[SYSTEM_RESTING]: Awaiting formulation sequence mount inputs... drop chemical actives onto pipeline rails.</span>
            </motion.div>
          ) : results.length === 0 ? (
            /* System Matrix Complete - Perfect Synergy Layout Frame */
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-emerald-500/90 tracking-wide font-semibold border border-emerald-950/40 bg-emerald-950/10 rounded-xl p-3.5 flex items-start gap-2.5"
            >
              <span className="shrink-0 font-bold">[ OK_STATUS ] ──</span>
              <p className="text-zinc-300 font-normal">
                No chemical matrix collisions detected across timeline sequences. The current active alignment provides stabilized skin layer absorption vectors with zero compromised tracking barriers.
              </p>
            </motion.div>
          ) : (
            /* Active Sequence Alert Multi-Stream Compiler Logs */
            results.map((log, index) => {
              const isErr = log.status === 'ERROR';

              const textVariantColor = isErr
                ? 'text-red-400 border-red-950/50 bg-red-950/10'
                : 'text-amber-400 border-amber-950/50 bg-amber-950/10';

              const bracketLabel = isErr ? 'SYNTAX_ERROR' : 'METRIC_CAUTION';
              const processIndex = String(index + 1).padStart(2, '0');

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className={`border rounded-xl p-3.5 flex items-start gap-3 tracking-wide ${textVariantColor}`}
                >
                  {/* Stylized Digital Parsing Identifiers */}
                  <span className="font-bold font-mono text-[10px] shrink-0 mt-0.5 opacity-60">
                    LN_{processIndex} // [{bracketLabel}] ──
                  </span>

                  <p className="text-zinc-300 text-[11px] font-normal leading-relaxed">
                    {log.message}
                  </p>
                </motion.div>
              );
            })
          )}

        </AnimatePresence>
      </div>

    </motion.div>
  );
}