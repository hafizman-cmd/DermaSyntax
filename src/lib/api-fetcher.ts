import type { Product } from "@/types/product";
import type { Ingredient } from "@/types/skincare";
import { sanitizeProductData } from "@/lib/data-adapter";

const CACHE_TTL_MS = 5 * 60 * 1000;
const STORAGE_PREFIX = "ds_cache_";

interface CacheEntry {
  data: Product[];
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

function loadCacheFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const entry = JSON.parse(raw) as CacheEntry;
      if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
        memoryCache.set(key.slice(STORAGE_PREFIX.length), entry);
      } else {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage unavailable or corrupt — ignore
  }
}

function persistCacheEntry(brand: string, entry: CacheEntry): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_PREFIX + brand,
      JSON.stringify(entry)
    );
  } catch {
    // Storage full — in-memory cache still works
  }
}

function checkCache(brand: string): Product[] | null {
  const key = brand.toLowerCase();
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  if (entry) {
    memoryCache.delete(key);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_PREFIX + key);
      } catch {
        // ignore
      }
    }
  }
  return null;
}

function setCache(brand: string, products: Product[]): void {
  const key = brand.toLowerCase();
  const entry: CacheEntry = { data: products, timestamp: Date.now() };
  memoryCache.set(key, entry);
  persistCacheEntry(key, entry);
}

interface OBFProduct {
  _id?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  categories?: string;
  ingredients_text_en?: string;
  ingredients_text?: string;
}

interface OBFResponse {
  products?: OBFProduct[];
}

function brandMatches(product: OBFProduct, brand: string): boolean {
  if (!product.brands) return false;
  const target = brand.toLowerCase().trim();
  const found = product.brands
    .toLowerCase()
    .split(",")
    .map((b) => b.trim())
    .some((b) => b === target);
  return found;
}

function mapOBFToRaw(obf: OBFProduct): Record<string, unknown> {
  return {
    id: obf._id ?? "",
    productName: obf.product_name_en || obf.product_name || "Unknown Product",
    brand: obf.brands || "Unknown Brand",
    category: obf.categories || "",
    ingredients: obf.ingredients_text_en || obf.ingredients_text || "",
  };
}

let cacheLoaded = false;

/**
 * Fetches skincare products for a given brand from the Open Beauty Facts
 * live database. Results pass through sanitizeProductData before being
 * returned, guaranteeing engine-compatible Product objects.
 *
 * Caching: in-memory + localStorage with a 5-minute TTL to avoid
 * redundant network requests during a session.
 */
export async function fetchProductsByBrand(
  brand: string
): Promise<Product[]> {
  if (!cacheLoaded) {
    loadCacheFromStorage();
    cacheLoaded = true;
  }

  const cached = checkCache(brand);
  if (cached) return cached;

  const params = new URLSearchParams({
    search_terms: brand,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "100",
  });

  const url = `https://world.openbeautyfacts.org/cgi/search.pl?${params.toString()}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`[API Fetcher] ${brand}: HTTP ${res.status}`);
      return [];
    }

    const json: OBFResponse = await res.json();

    if (!json.products || !Array.isArray(json.products)) {
      console.warn(`[API Fetcher] ${brand}: no products array in response`);
      return [];
    }

    const rawProducts = json.products
      .filter((p) => brandMatches(p, brand))
      .map(mapOBFToRaw);

    if (rawProducts.length === 0) {
      console.warn(`[API Fetcher] ${brand}: matched 0 products after brand filter`);
    }

    const sanitized = rawProducts.map((raw) => sanitizeProductData(raw));

    setCache(brand, sanitized);
    return sanitized;
  } catch (err) {
    console.warn(
      `[API Fetcher] ${brand}: network failure —`,
      err instanceof Error ? err.message : err
    );
    return [];
  }
}

/**
 * Searches the Open Beauty Facts ingredient taxonomy for ingredients
 * matching the given query string. Results are returned as Ingredient
 * objects compatible with the routine builder's card system.
 *
 * Uses a server-side proxy route that caches the full taxonomy in memory
 * and returns the top 20 matches sorted by product prevalence.
 */
export async function fetchIngredientsByQuery(
  query: string
): Promise<Ingredient[]> {
  const params = new URLSearchParams({ q: query });
  try {
    const res = await fetch(
      `/api/ingredients/search?${params.toString()}`
    );
    if (!res.ok) return [];
    const data: Ingredient[] = await res.json();
    return data;
  } catch (err) {
    console.warn(
      "[fetchIngredientsByQuery] failed —",
      err instanceof Error ? err.message : err
    );
    return [];
  }
}
