import { NextResponse } from "next/server";

const SUGGEST_URL =
  "https://world.openbeautyfacts.org/cgi/suggest.pl";

// ---------------------------------------------------------------------------
// Route handler — single fast fetch, no crawling
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  const params = new URLSearchParams({
    tagtype: "ingredients",
    term: query,
  });
  const url = `${SUGGEST_URL}?${params.toString()}`;

  console.log("[PROXY DEBUG] Fetching =>", url);
  const start = Date.now();

  try {
    const res = await fetch(url);
    const elapsed = Date.now() - start;

    console.log(`[PROXY DEBUG] Status ${res.status} in ${elapsed}ms`);

    if (!res.ok) {
      console.error(`[PROXY ERROR] HTTP ${res.status}`);
      return NextResponse.json([]);
    }

    const text = await res.text();
    console.log(
      `[PROXY DEBUG] Raw response (first 500 chars):`,
      text.slice(0, 500)
    );

    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      console.error("[PROXY ERROR] Response is not valid JSON");
      return NextResponse.json([]);
    }

    if (!Array.isArray(raw)) {
      console.log("[PROXY DEBUG] Unexpected response shape:", typeof raw);
      return NextResponse.json([]);
    }

    const strings = raw.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );

    console.log(
      `[PROXY DEBUG] Found ${strings.length} matching ingredients`
    );

    if (strings.length === 0) {
      return NextResponse.json([]);
    }

    const results = strings.map((str) => {
      const name = cleanName(str);
      const id = nameToId(name);
      return {
        id,
        name,
        category: inferCategory(name),
        defaultTime: "BOTH" as const,
        description: `Matched from the Open Beauty Facts ingredient taxonomy.`,
      };
    });

    console.log(
      `[PROXY DEBUG] Returning ${results.length} cleaned results`
    );
    return NextResponse.json(results);
  } catch (err) {
    console.error(
      "[PROXY ERROR] Unhandled exception:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json([]);
  }
}

// ---------------------------------------------------------------------------
// String cleaners
// ---------------------------------------------------------------------------
function cleanName(raw: string): string {
  let cleaned = raw.trim();

  // Remove language prefixes like "en:", "fr:", "de:" at word boundaries
  cleaned = cleaned.replace(/\b[a-z]{2}:/gi, "");

  // Convert underscores to spaces
  cleaned = cleaned.replace(/_/g, " ");

  // Collapse multiple spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Title case each word
  cleaned = cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return cleaned;
}

function nameToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// ---------------------------------------------------------------------------
// Category inference
// ---------------------------------------------------------------------------
const CATEGORY_KEYWORDS: [string, string][] = [
  ["retin", "RETINOID"],
  ["glycolic", "AHA"],
  ["lactic", "AHA"],
  ["mandelic", "AHA"],
  ["malic", "AHA"],
  ["citric", "AHA"],
  ["alpha hydroxy", "AHA"],
  ["salicylic", "BHA"],
  ["beta hydroxy", "BHA"],
  ["ascorbic", "PURE_VIT_C"],
  ["vitamin c", "PURE_VIT_C"],
  ["niacinamide", "BRIGHTENER"],
  ["azelaic", "BRIGHTENER"],
  ["arbutin", "BRIGHTENER"],
  ["tranexamic", "BRIGHTENER"],
  ["kojic", "BRIGHTENER"],
  ["licorice", "BRIGHTENER"],
  ["ferulic", "ANTIOXIDANT"],
  ["resveratrol", "ANTIOXIDANT"],
  ["coenzyme q10", "ANTIOXIDANT"],
  ["tocopherol", "ANTIOXIDANT"],
  ["benzoyl", "ACNE_TREATMENT"],
  ["sulfur", "ACNE_TREATMENT"],
  ["hyaluronic", "HUMECTANT"],
  ["glycerin", "HUMECTANT"],
  ["panthenol", "HUMECTANT"],
  ["sodium hyaluronate", "HUMECTANT"],
  ["polyglutamic", "HUMECTANT"],
  ["ceramide", "BARRIER_REPAIR"],
  ["squalane", "BARRIER_REPAIR"],
  ["centella", "BARRIER_REPAIR"],
  ["cica", "BARRIER_REPAIR"],
  ["allantoin", "BARRIER_REPAIR"],
  ["cholesterol", "BARRIER_REPAIR"],
  ["peptide", "BARRIER_REPAIR"],
  ["madecassoside", "BARRIER_REPAIR"],
];

function inferCategory(name: string): string {
  const lower = name.toLowerCase();
  for (const [keyword, category] of CATEGORY_KEYWORDS) {
    if (lower.includes(keyword)) return category;
  }
  return "ANTIOXIDANT";
}
