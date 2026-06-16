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
  /* UPGRADED: Set bg-white to bg-white/70 and appended backdrop-blur-md for a frosty, transparent effect */
  let consoleBorder = 'border-2 border-black bg-white/70 backdrop-blur-md text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-zinc-950/40 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]';
  let headerText = 'CORE_IDLE';

  if (isActive) {
    if (hasErrors) {
      pulseColor = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
      consoleBorder = 'border-2 border-red-600 bg-red-50/70 backdrop-blur-md text-red-900 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] dark:border-red-500 dark:bg-red-950/20 dark:text-red-400 dark:shadow-none';
      headerText = 'CRITICAL_CONFLICT';
    } else if (hasWarnings) {
      pulseColor = 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]';
      consoleBorder = 'border-2 border-amber-600 bg-amber-50/70 backdrop-blur-md text-amber-900 shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-400 dark:shadow-none';
      headerText = 'PRECAUTION_WARNING';
    } else {
      pulseColor = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]';
      consoleBorder = 'border-2 border-black bg-white/70 backdrop-blur-md text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-zinc-950/40 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]';
      headerText = 'SEQUENCE_STABLE';
    }
  }

  return (
    <motion.div
      key={`${hasErrors}-${hasWarnings}-${results.length}`}
      animate={hasErrors ? { opacity: [0.85, 1, 0.9, 1, 0.95, 1] } : { opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className={`flex h-48 w-full flex-col rounded-2xl p-5 font-mono select-none transition-all duration-500 ${consoleBorder}`}
    >

      {/* ── MONITOR TERMINAL TOP HEADER BAR ── */}
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-4 text-[9px] font-black tracking-widest text-black dark:text-white transition-colors duration-300">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-black dark:text-white transition-colors duration-300">
            <Terminal className="h-3 w-3 stroke-[2.5]" />
            <span>[ DIAGNOSTIC_PARSER ]</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l-2 border-black dark:border-white pl-5 transition-colors duration-300">
            <Cpu className="h-3 w-3 text-black dark:text-white stroke-[2.5]" />
            <span>STATE: <span className={hasErrors ? 'text-red-600 font-black' : hasWarnings ? 'text-amber-600 font-black' : isActive ? 'text-emerald-600 font-black' : 'text-black dark:text-white'}>[{headerText}]</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-black dark:text-white font-bold hidden md:inline transition-colors duration-300">SYS_MONITOR // LINK_01</span>
          <span className="text-white bg-black dark:text-white font-black dark:bg-zinc-900/30 border-2 border-black dark:border-white px-2 py-0.5 rounded transition-colors duration-300">
            {timestamp || 'INITIALIZING_CLOCK...'}
          </span>

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
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-black dark:text-white tracking-wide font-bold flex items-center gap-2 py-1 transition-colors duration-300"
            >
              <Radio className="h-3.5 w-3.5 text-black dark:text-white animate-pulse shrink-0 stroke-[2.5]" />
              <span>[SYSTEM_RESTING]: Awaiting formulation sequence mount inputs... drop chemical actives onto pipeline rails.</span>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-emerald-900 dark:text-emerald-400 tracking-wide font-black border-2 border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/10 rounded-xl p-3.5 flex items-start gap-2.5 transition-colors duration-300"
            >
              <span className="shrink-0 font-extrabold">[ OK_STATUS ] ──</span>
              <p className="text-black dark:text-zinc-200 font-bold transition-colors duration-300">
                No chemical matrix collisions detected across timeline sequences. The current active alignment provides stabilized skin layer absorption vectors with zero compromised tracking barriers.
              </p>
            </motion.div>
          ) : (
            results.map((log, index) => {
              const isErr = log.status === 'ERROR';

              const textVariantColor = isErr
                ? 'text-red-900 border-2 border-red-600 bg-red-50 dark:text-red-400 dark:border-red-950/50 dark:bg-red-950/10'
                : 'text-amber-900 border-2 border-amber-600 bg-amber-50 dark:text-amber-400 dark:border-amber-950/50 dark:bg-amber-950/10';

              const bracketLabel = isErr ? 'SYNTAX_ERROR' : 'METRIC_CAUTION';
              const processIndex = String(index + 1).padStart(2, '0');

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className={`border rounded-xl p-3.5 flex items-start gap-3 tracking-wide transition-colors duration-300 ${textVariantColor}`}
                >
                  <span className="font-black font-mono text-[10px] shrink-0 mt-0.5 opacity-100">
                    LN_{processIndex} // [{bracketLabel}] ──
                  </span>

                  <p className="text-black dark:text-zinc-200 text-[11px] font-bold leading-relaxed transition-colors duration-300">
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