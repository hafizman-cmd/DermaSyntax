'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnimatedThemeToggler from './AnimatedThemeToggler';

const NAV_LINKS = [
  { label: 'INGREDIENT BASE', href: '/' },
  { label: 'PRODUCT BASE', href: '/product-base' },
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
        className="text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-400 dark:text-zinc-500 select-none hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
      >
        {logoLabel}
      </Link>

      <nav className="flex items-center">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

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
