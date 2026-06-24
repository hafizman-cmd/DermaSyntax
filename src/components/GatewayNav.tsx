'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnimatedThemeToggler from './AnimatedThemeToggler';

const NAV_LINKS = [
  { label: 'MANUAL', href: '#manual-section' },
  { label: 'DOCUMENTATION', href: '#doc-section' },
  { label: 'SHOP', href: '#shop-section' },
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

  const [headerSkinType, setHeaderSkinType] = useState<string | null>(null);
  useEffect(() => {
    // Function to read the saved skin type fresh from memory
    const updateHeaderType = () => {
      const savedType = localStorage.getItem('selectedSkinType');
      setHeaderSkinType(savedType);
    };
    // Run it once when the page first loads
    updateHeaderType();
    // Listen for the silent broadcast signal from the boot button
    window.addEventListener('skinTypeChanged', updateHeaderType);
    // Clean up the listener if the user leaves the page
    return () => {
      window.removeEventListener('skinTypeChanged', updateHeaderType);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 z-50 flex items-center justify-between px-8 bg-zinc-50/70 dark:bg-[#121212]/40 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <a
        href="#hero-section"
        onClick={(e) => {
          e.preventDefault();

          // Try scrolling the inner container first, fallback to the main window
          const scrollContainer = document.querySelector('.overflow-y-auto');
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          // Cleanly update the browser URL hash without causing a page jump
          window.history.pushState(null, '', window.location.pathname);
        }}
        className="font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-600 dark:text-zinc-400 select-none hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
      >
        {logoLabel}
      </a>

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
          <span className="text-zinc-300 dark:text-zinc-800">|</span>
          <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[10px] tracking-wider uppercase flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1.5" />
            SKIN TYPE // {headerSkinType ? headerSkinType : 'NOT SELECTED'}
          </span>
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
