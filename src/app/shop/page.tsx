"use client";

import React, { useState, useEffect } from "react";
import GatewayNav from "@/components/GatewayNav";
import type { Product } from "@/types/product";
import { sanitizeProductData } from "@/lib/data-adapter";
import productsData from "@/data/products.json";
import { useRoutineStore } from "@/store/useRoutineStore";

// Bind to the canonical product registry (same source as /api/products route).
// Run the same sanitizer the API uses so the client view mirrors engine output.
const products: Product[] = (productsData as unknown[]).map(
  (raw) => sanitizeProductData(raw) as Product
);

// Clinical skin-profile compatibility matrix — maps each cataloged SKU to the
// skin matrices it is formulated for. Drives the live "PROFILE MATCH" tag.
const SKIN_PROFILE_MATRIX: Record<string, string[]> = {
  "prod-skintific-cleanser": ["Sensitive", "Dry", "Combination"],
  "prod-skintific-toner": ["Oily", "Normal", "Combination"],
  "prod-skintific-serum": ["Sensitive", "Dry", "Combination"],
  "prod-skintific-moisturizer": ["Sensitive", "Dry", "Combination"],
  "prod-cosrx-cleanser": ["Oily", "Combination"],
  "prod-cosrx-toner": ["Oily", "Normal"],
  "prod-axisy-serum": ["Sensitive", "Oily", "Dry", "Normal", "Combination"],
};

type CatalogProduct = Product & { suitableSkinTypes: string[] };

const productCatalog: CatalogProduct[] = products.map((p) => ({
  ...p,
  suitableSkinTypes: SKIN_PROFILE_MATRIX[p.id] ?? [],
}));

function ProductCard({
  product,
  activeProfile,
}: {
  product: CatalogProduct;
  activeProfile: string | null;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const assetType = inferAssetType(product);

  return (
    <div
      className="w-full h-[340px] [perspective:1000px] select-none"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${
        isFlipped
          ? '[transform:rotateY(180deg)_translateY(-16px)] shadow-xl'
          : '[transform:rotateY(0deg)_translateY(0px)]'
      }`}>

        {/* ================= FRONT SIDE PANEL ================= */}
        <div className="absolute inset-0 w-full h-full border-2 border-zinc-900 dark:border-white/10 bg-white dark:bg-[#0c0c0e] p-4 rounded-xl flex flex-col justify-between [backface-visibility:hidden] z-20">

          {/* Top Static Outline Sketch Container */}
          <div className="w-full h-28 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex flex-col items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800/80">
            <div className="w-8 h-14 border border-zinc-400 dark:border-zinc-700 rounded-sm relative flex flex-col justify-between p-1">
              <div className="w-full h-2 border-b border-zinc-400 dark:border-zinc-700" />
              <div className="w-full h-1/2 bg-zinc-400/20 dark:bg-white/5 border-t border-dashed border-zinc-400 dark:border-zinc-700" />
            </div>
            <span className="font-mono text-[8px] text-zinc-500 mt-2 tracking-widest font-bold">[{assetType}]</span>
          </div>
          {/* Metadata Rigid Spacing Area */}
          <div className="h-7 my-2 flex items-center">
            {activeProfile && product.suitableSkinTypes.map(s => s.toLowerCase()).includes(activeProfile.toLowerCase()) ? (
              <div className="text-emerald-600 dark:text-emerald-400 border border-emerald-600/30 dark:border-emerald-400/20 bg-emerald-500/5 px-2 py-1 rounded-md font-mono text-[9px] font-bold tracking-wider uppercase select-none w-max">
                [ PROFILE MATCH // {product.category} ]
              </div>
            ) : (
              <div className="h-px w-full pointer-events-none opacity-0" />
            )}
          </div>
          {/* Brand Name & Info */}
          <div className="flex-1 flex flex-col justify-start">
            <span className="text-[9px] font-mono font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase block mb-0.5">
              {product.brand}
            </span>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {product.name}
            </h3>
            <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block mt-1">
              {product.category}
            </span>
          </div>
          {/* Action Trigger Row */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900/60 flex justify-end">
            <a
              href={getOfficialBrandUrl(product.brand)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[9px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-3 py-1.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
            >
              BUY_FROM_BRAND ↗
            </a>
          </div>
        </div>
        {/* ================= BACK SIDE PANEL ================= */}
        <div className="absolute inset-0 w-full h-full border-2 border-zinc-900 dark:border-white/20 bg-zinc-50 dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 p-4 rounded-xl flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] z-10 shadow-lg">
              {/* Top Content Scroll Container */}
          <div className="flex-1 flex flex-col justify-start overflow-hidden text-left">
              {/* Section 1: Target Benefits Checklist */}
            <span className="font-mono text-[8px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1.5">// TARGET BENEFITS</span>
            <ul className="space-y-1 mb-3">
              {product.benefits?.map((benefit, bIdx) => (
                <li key={bIdx} className="text-[10px] font-mono tracking-wide font-medium flex items-center text-zinc-700 dark:text-zinc-300">
                  <span className="text-emerald-500 dark:text-emerald-400 mr-1.5 font-bold">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
            {/* Section 2: Key Ingredients Component Tags */}
            <span className="font-mono text-[8px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1.5">// KEY ACTIVES</span>
            <div className="flex flex-wrap gap-1 mb-3">
              {product.keyActives?.map((ingredient, iIdx) => (
                <span key={iIdx} className="text-[9px] font-mono border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 font-medium">
                  {ingredient}
                </span>
              ))}
            </div>
            {/* Section 3: User Friendly Application Tips */}
            <span className="font-mono text-[8px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1">// HOW TO USE</span>
            <p className="text-[10px] font-mono leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
              {product.howToUse}
            </p>
          </div>
          {/* Bottom Persistent Action Row */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex justify-end">
            <a
              href={getOfficialBrandUrl(product.brand)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[9px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-3 py-1.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
            >
              BUY_FROM_BRAND ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple assetType inference — falls back to TUBE_CREAM when no signal matches.
function inferAssetType(product: Product): string {
  const name = product.name.toLowerCase();
  const category = product.category.toLowerCase();
  if (name.includes("serum") || category.includes("serum")) return "SERUM_DROPPER";
  if (
    name.includes("cleanser") ||
    name.includes("cleansing") ||
    category.includes("cleanser")
  ) {
    return "PUMP_FLUID";
  }
  if (name.includes("toner") || category.includes("toner")) return "TONER_BOTTLE";
  return "TUBE_CREAM";
}

// Domain router — maps each brand to its official web address. Falls back to a
// directed Google search for the brand's official store when no canonical entry exists.
const getOfficialBrandUrl = (brand: string): string => {
  const domains: { [key: string]: string } = {
    "skintific": "https://www.skintific.com",
    "cosrx": "https://www.cosrx.com",
    "the ordinary": "https://theordinary.com",
    "obagi": "https://www.obagi.com",
    "cerave": "https://www.cerave.com",
    "la roche-posay": "https://www.laroche-posay.us",
    "paula's choice": "https://www.paulaschoice.com",
    "the inkey list": "https://www.theinkeylist.com",
    "axis-y": "https://www.axis-y.com/",
    "glad2glow": "https://glad2glow.com/",
    "hada labo": "https://hadalabo.com.my/",
    "innisfree": "https://my.innisfree.com/",
    "some by mi": "https://thesomebymi.com/"
  };
  const key = brand.toLowerCase().trim();
  return domains[key] || `https://www.google.com/search?q=${encodeURIComponent(brand + ' official store')}`;
};

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Pull the calibrated skin profile from the Zustand routine store (the
  // canonical holder of the onboarding selection) inside an effect so the
  // server-rendered pass stays null and no hydration mismatch occurs.
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  useEffect(() => {
    const storedProfile = useRoutineStore.getState().skinType;
    if (storedProfile) {
      setActiveProfile(storedProfile);
    }
  }, []);

  // Normalize the query once — lowercase + trim permanently fixes the case
  // mismatch and stray-whitespace dropouts that were breaking the filter.
  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredProducts = productCatalog.filter(p =>
    p.name.toLowerCase().includes(normalizedQuery) ||
    p.brand.toLowerCase().includes(normalizedQuery) ||
    (p.category && p.category.toLowerCase().includes(normalizedQuery))
  );

  const groupedByBrand: { [key: string]: CatalogProduct[] } = {};
  filteredProducts.forEach(product => {
    if (!groupedByBrand[product.brand]) {
      groupedByBrand[product.brand] = [];
    }
    groupedByBrand[product.brand].push(product);
  });

  const sortedBrands = Object.keys(groupedByBrand).sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-zinc-200 antialiased transition-colors duration-500">
      {/* ── FIXED GATEWAY TOP NAVIGATION BAR (z-50 keeps theme toggle above sticky search) ── */}
      <GatewayNav statusLabel="SHOP_READY" logoLabel="DERMASYNTAX // SHOP_v1.0.4" />

      {/* ── MAIN SPLIT LAYOUT (mirrors docs/manual page flow) ── */}
      <div className="flex pt-16">
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16">

            {/* PAGE HEADINGS */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
              <span className="font-mono text-[10px] tracking-widest text-zinc-500 dark:text-zinc-500 uppercase">
                // CERTIFIED SOURCE LIST
              </span>
              <h1 className="text-2xl font-bold tracking-tight mt-1 text-zinc-900 dark:text-zinc-50">
                CANONICAL PRODUCT CATALOG
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                Verified formulation index mapped against the canonical product database. Procure directly via authorized brand stores.
              </p>
              <div className="mt-3 flex items-center gap-3 text-[9px] font-mono tracking-widest text-zinc-500 dark:text-zinc-500 uppercase">
                <span>REGISTRY // {productCatalog.length} SKUs</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>BRANDS // {new Set(productCatalog.map((p) => p.brand)).size}</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>SYNC // NOMINAL</span>
              </div>
            </div>

            {/* STICKY SEARCH FILTER CONTROL — wrapper is fully transparent so no black bar blocks the page; the input itself keeps pointer events + sharp borders */}
            <div className="sticky top-16 z-30 bg-transparent py-4 mb-6 w-full pointer-events-none">
              <input
                type="text"
                placeholder="SEARCH BY INGREDIENT, BRAND, OR COMPONENT CATEGORY..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md font-mono text-xs bg-zinc-100 dark:bg-[#0c0c0e] border-2 border-zinc-800 dark:border-white/10 rounded-xl px-4 py-3 outline-none tracking-wider text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 pointer-events-auto"
              />
            </div>

            {/* ALPHABETICAL BRAND-GROUPED SECTIONS */}
            {sortedBrands.map((brand, idx) => {
              const brandProducts = groupedByBrand[brand];
              return (
                <section key={brand} className="mb-4">
                  {idx > 0 && <hr className="border-t border-zinc-200 dark:border-zinc-900 my-12 clear-both" />}
                  <h2 className="text-xs font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 mt-8 uppercase">
                    // BRAND // {brand}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {brandProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        activeProfile={activeProfile}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* COMPLIANCE DISCLOSURE FOOTER */}
            <div className="mt-16 border-t border-zinc-200 dark:border-zinc-900 pt-6 text-[10px] font-mono text-zinc-500 dark:text-zinc-500">
              <span>
                [ NOTICE // TRANSPARENCY MANUAL ] — DERMASYNTAX REPLICA IS A RESEARCH TAXONOMY MATRIX. OUTBOUND EXTERNAL HYPERLINKS ARE DIRECTED TO RESPECTIVE INTELLECTUAL TRADEMARK OWNERS FOR NOMINATIVE USE CASES ONLY.
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
