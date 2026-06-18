import type { Metadata } from 'next';
import './globals.css';
import { sanitizeProductData } from '@/lib/data-adapter';

// -----------------------------------------------------------------------------
// Data Adapter verification log — runs once on server startup / first render.
// Passes a deliberately messy mock API payload through the sanitizer and
// prints the clean Product shape so the engine integration is visible.
// -----------------------------------------------------------------------------
const MOCK_RAW_PRODUCT = {
  productName: '  Raw API Salicylic Acid Cleanser  ',
  brand: 'COSRX',
  ingredientList: ['  Salicylic Acid ', 'BHA', ' Glycerin ', 'WATER', 'Fragrance'],
  category: 'Cleanser',
  pH: '4.5',
  solubility: 'aqueous',
  molecularWeightProfile: 'low',
  applicationSequence: 'All-Day',
};

if (typeof globalThis !== 'undefined' && !(globalThis as Record<string, unknown>).__dataAdapterVerified) {
  (globalThis as Record<string, unknown>).__dataAdapterVerified = true;
  console.log('[DataAdapter] Sanitizer verification:', JSON.stringify(sanitizeProductData(MOCK_RAW_PRODUCT), null, 2));
}

export const metadata: Metadata = {
  title: 'DermaSyntax — Skincare Routine Simulator & Conflict Compiler',
  description:
    'An IDE for your face. Build your AM/PM skincare routine and let the compiler detect chemical conflicts, oxidation warnings, and synergy opportunities.',
  keywords: ['skincare', 'routine', 'ingredient conflict', 'retinol', 'vitamin c', 'IDE'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ide-bg text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
