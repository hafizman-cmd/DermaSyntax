"use client";

import React, { useState } from "react";
import GatewayNav from "@/components/GatewayNav";
import type { Product } from "@/types/product";
import { sanitizeProductData } from "@/lib/data-adapter";
import productsData from "@/data/products.json";

// Bind to the canonical product registry (same source as /api/products route).
// Run the same sanitizer the API uses so the client view mirrors engine output.
const products: Product[] = (productsData as unknown[]).map(
  (raw) => sanitizeProductData(raw) as Product
);

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

  // Normalize the query once — lowercase + trim permanently fixes the case
  // mismatch and stray-whitespace dropouts that were breaking the filter.
  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(normalizedQuery) ||
    p.brand.toLowerCase().includes(normalizedQuery) ||
    (p.category && p.category.toLowerCase().includes(normalizedQuery))
  );

  const groupedByBrand: { [key: string]: typeof products } = {};
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
                <span>REGISTRY // {products.length} SKUs</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>BRANDS // {new Set(products.map((p) => p.brand)).size}</span>
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
                    {brandProducts.map((product) => {
                      const assetType = inferAssetType(product);
                      const url = getOfficialBrandUrl(product.brand);
                      return (
                        <div
                          key={product.id}
                          className="bg-zinc-50/80 dark:bg-[#0c0c0e] border-2 border-zinc-900 dark:border-white/10 hover:border-zinc-500 dark:hover:border-zinc-400 p-4 rounded-xl flex flex-col justify-between h-72 transition-all shadow-sm group"
                        >
                          {/* TECHNICAL GRAPHIC BLUEPRINT BOX */}
                          <div>
                            <div className="w-full h-28 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-3 flex flex-col items-center justify-center border-2 border-dashed border-zinc-400 dark:border-zinc-800/80 relative overflow-hidden group-hover:bg-zinc-100/60 dark:group-hover:bg-zinc-900/60 transition-colors">
                              {/* Geometric Blueprint Outlines */}
                              <div className="w-8 h-14 border border-zinc-400 dark:border-zinc-700 rounded-sm relative flex flex-col justify-between p-1">
                                <div className="w-full h-2 border-b border-zinc-400 dark:border-zinc-700" />
                                <div className="w-full h-1/2 bg-zinc-400/10 dark:bg-white/5 border-t border-dashed border-zinc-400 dark:border-zinc-700" />
                              </div>
                              <span className="font-mono text-[8px] text-zinc-600 dark:text-zinc-500 font-bold mt-2 tracking-widest">
                                [{assetType}]
                              </span>
                            </div>
                            {/* TEXTUAL METADATA */}
                            <span className="text-[9px] font-mono text-zinc-600 dark:text-zinc-400 font-bold tracking-wider uppercase">
                              {product.brand}
                            </span>
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5 truncate">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-500 font-medium mt-1 uppercase font-mono tracking-wide">
                              {product.category}
                            </p>
                          </div>
                          {/* INTERACTION ACTION ROW */}
                          <div className="mt-4 flex items-center justify-end border-t border-zinc-300 dark:border-zinc-800 pt-3">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[9px] bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:opacity-90 px-3 py-2 rounded-lg font-bold tracking-wider transition-all uppercase"
                            >
                              BUY_FROM_BRAND ↗
                            </a>
                          </div>
                        </div>
                      );
                    })}
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
