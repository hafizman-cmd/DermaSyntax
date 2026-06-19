'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnimatedThemeToggler from './AnimatedThemeToggler';

const NAV_LINKS = [
  { label: 'MANUAL', href: '/manual' },
  { label: 'DOCUMENTATION', href: '/docs' },
] as const;

interface GatewayNavProps {
  statusLabel?: string;
  logoLabel?: string;
}

export default function GatewayNav({
  statusLabel = 'GATEWAY_READY',
  logoLabel = 'DERMASYNTAX // GATEWAY_v1.0.0',
}: GatewayNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 z-50 flex items-center justify-between px-8 bg-zinc-50/70 dark:bg-[#121212]/40 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          localStorage.removeItem('dermasyntax_onboarded');
          window.location.href = '/';
        }}
        className="text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-600 dark:text-zinc-400 select-none hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
      >
        {logoLabel}
      </Link>

      <nav className="flex items-center">
        <div className="hidden lg:flex items-center space-x-4 font-mono text-[10px] tracking-widest text-zinc-500 dark:text-zinc-500 mr-6 border-r border-zinc-200 dark:border-zinc-800 pr-6">
          <div className="flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span>CORE // NOMINAL</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-800">|</span>
          <span>NET_LATENCY // 14MS</span>
          <span className="text-zinc-300 dark:text-zinc-800">|</span>
          <span>SYS_SECURE</span>
        </div>
        {NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-[0.15em] font-semibold transition-colors mx-4 ${
                isActive
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <AnimatedThemeToggler />
        <span className="text-[9px] font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase select-none">
          &bull; {statusLabel}
        </span>
      </div>
    </header>
  );
}
