/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '76': '19rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        // IDE chrome
        'ide-bg':      '#020816',
        'ide-surface': '#0d1117',
        'ide-border':  '#1e2d3d',
        'ide-panel':   '#0a0f1a',
        // Semantic severity
        'err-red':    '#ff4444',
        'warn-amber': '#f59e0b',
        'ok-green':   '#22c55e',
        'info-blue':  '#38bdf8',
        // Category badge palette
        'cat-retinoid':    '#a855f7',
        'cat-acid':        '#f97316',
        'cat-vitc':        '#eab308',
        'cat-antioxidant': '#22d3ee',
        'cat-brightener':  '#ec4899',
        'cat-acne':        '#ef4444',
        'cat-humectant':   '#3b82f6',
        'cat-barrier':     '#10b981',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
