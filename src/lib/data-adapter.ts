import type { Product } from "@/types/product";

// -----------------------------------------------------------------------------
// Data Sanitizer — Bridge external API payloads to the internal Product schema
// -----------------------------------------------------------------------------
// This module owns every translation step between messy upstream data and the
// canonical Product shape consumed by the compatibility engine.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// 1. FILLER FILTER
//    Non-essential excipients that should not participate in engine logic.
// -----------------------------------------------------------------------------
const FILLER_INGREDIENTS = new Set([
  "aqua",
  "water",
  "butylene glycol",
  "propylene glycol",
  "pentylene glycol",
  "hexylene glycol",
  "caprylyl glycol",
  "ethylhexylglycerin",
  "phenoxyethanol",
  "sodium benzoate",
  "potassium sorbate",
  "disodium edta",
  "tetrasodium edta",
  "carbomer",
  "xanthan gum",
  "cellulose gum",
  "microcrystalline cellulose",
  "silica",
  "dimethicone",
  "cyclopentasiloxane",
  "cyclohexasiloxane",
  "triethanolamine",
  "tromethamine",
  "fragrance",
  "parfum",
  "polysorbate 20",
  "polysorbate 80",
  "peg-40 hydrogenated castor oil",
  "cetearyl alcohol",
  "stearyl alcohol",
  "cetyl alcohol",
]);

// -----------------------------------------------------------------------------
// 2. INGREDIENT ALIAS DICTIONARY
//    Maps noisy/raw strings -> canonical snake_case ingredient ids.
// -----------------------------------------------------------------------------
const INGREDIENT_ALIASES: Record<string, string> = {
  "salicylic acid": "salicylic_acid",
  "bha": "salicylic_acid",
  "beta hydroxy acid": "salicylic_acid",
  "betaine salicylate": "betaine_salicylate",
  "capryloyl salicylic acid": "lha",
  "lha": "lha",

  "glycolic acid": "glycolic_acid",
  "aha": "glycolic_acid",
  "alpha hydroxy acid": "glycolic_acid",
  "lactic acid": "lactic_acid",
  "mandelic acid": "mandelic_acid",
  "lactobionic acid": "lactobionic_acid",
  "phytic acid": "phytic_acid",
  "citric acid": "citric_acid",
  "tartaric acid": "tartaric_acid",
  "malic acid": "malic_acid",
  "pyrus malus fruit water": "pyrus_malus_fruit_water",
  "apple fruit water": "pyrus_malus_fruit_water",

  "hyaluronic acid": "hyaluronic_acid",
  "sodium hyaluronate": "sodium_hyaluronate",
  "hydrolyzed hyaluronic acid": "hydrolyzed_hyaluronic_acid",
  "acetyl hyaluronate": "acetyl_hyaluronate",
  "acetylated hyaluronic acid": "acetyl_hyaluronate",

  "niacinamide": "niacinamide",
  "vitamin b3": "niacinamide",
  "centella asiatica": "centella_asiatica",
  "cica": "centella_asiatica",
  "madecassoside": "madecassoside",
  "allantoin": "allantoin",
  "panthenol": "panthenol",
  "vitamin b5": "panthenol",
  "glycerin": "glycerin",
  "glycerol": "glycerin",

  "ceramide np": "ceramide_np",
  "ceramide ap": "ceramide_ap",
  "ceramide eop": "ceramide_eop",
  "ceramides": "ceramide_np",
  "cholesterol": "cholesterol",
  "squalane": "squalane",

  "tocopherol": "tocopherol",
  "vitamin e": "tocopherol",
  "l-ascorbic acid": "l_ascorbic_acid",
  "ascorbic acid": "ascorbic_acid",
  "vitamin c": "ascorbic_acid",
  "sodium ascorbyl phosphate": "sodium_ascorbyl_phosphate",
  "magnesium ascorbyl phosphate": "magnesium_ascorbyl_phosphate",
  "ascorbyl glucoside": "ascorbyl_glucoside",

  "retinol": "retinol",
  "vitamin a": "retinol",
  "adenosine": "adenosine",

  "tea tree oil": "tea_tree_oil",
  "melaleuca alternifolia leaf oil": "tea_tree_oil",

  "snail secretion filtrate": "snail_mucin",
  "snail mucin": "snail_mucin",
  "aloe barbadensis extract": "aloe_barbadensis_extract",
  "aloe vera": "aloe_barbadensis_extract",
  "aloe vera leaf extract": "aloe_barbadensis_extract",
  "green tea extract": "green_tea_extract",
  "camellia sinensis leaf extract": "green_tea_extract",
  "matcha extract": "matcha_extract",
  "black tea extract": "black_tea_extract",

  "kaolin": "kaolin",
  "bentonite": "bentonite",
  "volcanic ash": "volcanic_ash",
  "sunflower seed oil": "sunflower_seed_oil",
  "zinc oxide": "zinc_oxide",
  "titanium dioxide": "titanium_dioxide",
  "artichoke extract": "artichoke_extract",
  "zinc gluconate": "zinc_gluconate",
  "shea butter": "shea_butter",
  "butyrospermum parkii butter": "shea_butter",
  "mexoryl 400": "mexoryl_400",
  "thermal spring water": "thermal_spring_water",
  "petrolatum": "petrolatum",
  "petroleum jelly": "petrolatum",
  "panax ginseng extract": "panax_ginseng_extract",
  "ginseng extract": "panax_ginseng_extract",
  "prunus mume extract": "prunus_mume_extract",
  "propolis extract": "propolis_extract",
  "rice bran water": "rice_bran_water",
  "rice extract": "rice_extract",
  "probiotic lysate": "probiotic_lysate",
  "tranexamic acid": "tranexamic_acid",
  "alpha arbutin": "alpha_arbutin",
  "licorice root extract": "licorice_root_extract",
  "uv filters": "uv_filters",
  "cocoyl glutamate": "cocoyl_glutamate",
  "bis ethylhexyloxyphenol methoxyphenyl triazine":
    "bis_ethylhexyloxyphenol_methoxyphenyl_triazine",
};

// -----------------------------------------------------------------------------
// 3. FUNCTIONAL GROUP MAP
//    Canonical ingredient id -> compatibility functional groups.
//    Mirrors the functionalGroups used in products.json / compatibility-engine.
// -----------------------------------------------------------------------------
const FUNCTIONAL_GROUP_MAP: Record<string, string[]> = {
  salicylic_acid: ["beta_hydroxy_acid"],
  betaine_salicylate: ["beta_hydroxy_acid"],
  lha: ["beta_hydroxy_acid"],

  glycolic_acid: ["alpha_hydroxy_acid"],
  lactic_acid: ["alpha_hydroxy_acid"],
  mandelic_acid: ["alpha_hydroxy_acid"],
  citric_acid: ["alpha_hydroxy_acid"],
  tartaric_acid: ["alpha_hydroxy_acid"],
  malic_acid: ["alpha_hydroxy_acid"],
  pyrus_malus_fruit_water: ["alpha_hydroxy_acid"],

  lactobionic_acid: ["polyhydroxy_acid"],
  phytic_acid: ["polyhydroxy_acid"],

  hyaluronic_acid: ["glycosaminoglycan"],
  sodium_hyaluronate: ["glycosaminoglycan"],
  hydrolyzed_hyaluronic_acid: ["glycosaminoglycan"],
  acetyl_hyaluronate: ["carboxylic_acid", "amide"],

  niacinamide: ["pyridine_carboxamide"],
  centella_asiatica: ["triterpenoid"],
  madecassoside: ["triterpenoid"],
  allantoin: ["urea_derivative"],
  panthenol: ["alcohol"],
  glycerin: ["polyol"],

  ceramide_np: ["ceramide"],
  ceramide_ap: ["ceramide"],
  ceramide_eop: ["ceramide"],
  cholesterol: ["sterol"],
  squalane: ["triterpene"],

  tocopherol: ["phenol"],
  ascorbic_acid: ["ascorbic_acid"],
  l_ascorbic_acid: ["ascorbic_acid"],
  sodium_ascorbyl_phosphate: ["ascorbic_acid"],
  magnesium_ascorbyl_phosphate: ["ascorbic_acid"],
  ascorbyl_glucoside: ["ascorbic_acid"],

  retinol: ["retinoid"],
  adenosine: ["nucleoside"],

  tea_tree_oil: ["phenol"],
  snail_mucin: ["glycosaminoglycan", "carboxylic_acid"],
  aloe_barbadensis_extract: ["polysaccharide"],
  green_tea_extract: ["catechin"],
  matcha_extract: ["catechin"],
  black_tea_extract: ["polyphenol"],

  kaolin: ["silicate"],
  bentonite: ["silicate"],
  volcanic_ash: ["mineral_oxide"],
  sunflower_seed_oil: ["triglyceride"],
  zinc_oxide: ["metal_oxide"],
  titanium_dioxide: ["metal_oxide"],
  artichoke_extract: ["ceramide"],
  zinc_gluconate: ["metal_salt"],
  shea_butter: ["triglyceride"],
  mexoryl_400: ["triazine"],
  petrolatum: ["hydrocarbon"],
  panax_ginseng_extract: ["saponin"],
  prunus_mume_extract: ["organic_acid"],
  propolis_extract: ["flavonoid"],
  rice_bran_water: ["polysaccharide"],
  rice_extract: ["polysaccharide"],
  probiotic_lysate: ["peptide"],
  tranexamic_acid: ["amino_acid"],
  alpha_arbutin: ["glycoside"],
  licorice_root_extract: ["flavonoid"],
  uv_filters: ["triazine"],
  cocoyl_glutamate: ["amino_acid_surfactant"],
  bis_ethylhexyloxyphenol_methoxyphenyl_triazine: ["triazine"],
};

// -----------------------------------------------------------------------------
// Internal extraction helpers (tolerates multiple upstream naming conventions)
// -----------------------------------------------------------------------------
function extractString(raw: unknown, keys: string[]): string {
  for (const key of keys) {
    const value = (raw as Record<string, unknown>)?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }

    if (key.includes(".")) {
      const parts = key.split(".");
      let current: unknown = raw;
      for (const part of parts) {
        current = (current as Record<string, unknown>)?.[part];
        if (current === undefined || current === null) break;
      }
      if (typeof current === "string" && current.trim().length > 0) {
        return current.trim();
      }
    }
  }
  return "";
}

function extractNumber(raw: unknown, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = (raw as Record<string, unknown>)?.[key];
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return fallback;
}

function extractArray(raw: unknown, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = (raw as Record<string, unknown>)?.[key];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function normalizeIngredient(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function generateProductId(raw: unknown, name: string, brand: string): string {
  const rawId = (raw as Record<string, unknown>)?.id;
  if (typeof rawId === "string" && rawId.trim().length > 0) {
    return rawId.trim();
  }
  const slug = `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `prod-${slug}` : `prod-${Date.now()}`;
}

function normalizeSolubility(value: unknown): Product["solubility"] {
  if (typeof value !== "string") return "aqueous";
  const v = value.toLowerCase();
  if (v.includes("water") || v.includes("aqua")) return "aqueous";
  if (v.includes("oil") || v.includes("lipid") || v.includes("fat"))
    return "lipophilic";
  if (v.includes("both") || v.includes("amphi")) return "amphiphilic";
  return "aqueous";
}

function normalizeMolecularWeight(
  value: unknown
): Product["molecularWeightProfile"] {
  if (typeof value === "number") {
    if (value < 200) return "low";
    if (value > 500) return "high";
    return "medium";
  }
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v.includes("low")) return "low";
    if (v.includes("high")) return "high";
    if (v.includes("medium") || v.includes("mid")) return "medium";
  }
  return "medium";
}

function normalizeSequence(
  value: unknown
): Product["applicationSequence"] {
  if (typeof value !== "string") return "All-Day";
  const v = value.toLowerCase();
  if (v.includes("am") && !v.includes("pm")) return "AM";
  if (v.includes("pm") && !v.includes("am")) return "PM";
  if (v.includes("all") || v.includes("day") || v.includes("both"))
    return "All-Day";
  return "All-Day";
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Maps a single canonical or raw ingredient name to its compatibility
 * functional groups. Accepts either snake_case ids or human-readable names.
 *
 * Examples:
 *   getFunctionalGroup("Salicylic Acid") // ["beta_hydroxy_acid"]
 *   getFunctionalGroup("salicylic_acid") // ["beta_hydroxy_acid"]
 *   getFunctionalGroup("BHA")            // ["beta_hydroxy_acid"]
 */
export function getFunctionalGroup(ingredient: string): string[] {
  const normalized = ingredient.toLowerCase().trim();
  if (!normalized) return [];

  // Direct canonical lookup: "salicylic_acid"
  const asCanonical = normalized.replace(/\s+/g, "_");
  const directGroups = FUNCTIONAL_GROUP_MAP[asCanonical];
  if (directGroups) return [...directGroups];

  // Alias lookup: "bha" -> "salicylic_acid"
  const asAlias = normalized.replace(/_/g, " ");
  const canonicalId = INGREDIENT_ALIASES[asAlias];
  if (canonicalId) {
    const aliasedGroups = FUNCTIONAL_GROUP_MAP[canonicalId];
    if (aliasedGroups) return [...aliasedGroups];
  }

  return [];
}

/**
 * Sanitizer entry point.
 *
 * - Extracts product metadata from a variety of common API shapes.
 * - Normalizes raw ingredient strings to canonical snake_case ids.
 * - Filters non-essential filler ingredients.
 * - Populates functionalGroups via getFunctionalGroup().
 * - Returns a fully typed Product object ready for the compatibility engine.
 */
export function sanitizeProductData(rawData: unknown): Product {
  const name = extractString(rawData, [
    "name",
    "productName",
    "product_name",
    "title",
    "productTitle",
    "display_name",
  ]);
  const brand = extractString(rawData, [
    "brand",
    "brandName",
    "brand_name",
    "manufacturer",
    "company",
  ]);
  const category = extractString(rawData, [
    "category",
    "productCategory",
    "product_category",
    "type",
    "product_type",
  ]);

  const rawIngredients = extractArray(rawData, [
    "ingredients",
    "ingredientList",
    "ingredient_list",
    "components",
    "ingredient",
    "details.ingredients",
  ]);

  const ingredients = rawIngredients
    .filter((item): item is string => typeof item === "string")
    .map(normalizeIngredient)
    .filter((normalized) => {
      if (!normalized) return false;
      if (FILLER_INGREDIENTS.has(normalized)) return false;
      return true;
    })
    .map((normalized) => {
      const aliasKey = normalized.replace(/_/g, " ");
      return (
        INGREDIENT_ALIASES[aliasKey] ||
        normalized.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
      );
    })
    .filter((id) => id.length > 0)
    .filter((id, index, self) => self.indexOf(id) === index);

  const functionalGroups = Array.from(
    new Set(ingredients.flatMap((ingredient) => getFunctionalGroup(ingredient)))
  );

  const id = generateProductId(rawData, name, brand);

  return {
    id,
    name: name || "Untitled Product",
    brand: brand || "Unknown Brand",
    category: category || "Unknown",
    ingredients,
    safetyRating: extractNumber(
      rawData,
      ["safetyRating", "safety_rating", "safety", "rating"],
      3
    ),
    pH: extractNumber(rawData, ["pH", "ph", "pHLevel", "ph_level"], 5.5),
    solubility: normalizeSolubility(
      (rawData as Record<string, unknown>)?.solubility ??
        (rawData as Record<string, unknown>)?.solubilityProfile
    ),
    functionalGroups,
    molecularWeightProfile: normalizeMolecularWeight(
      (rawData as Record<string, unknown>)?.molecularWeightProfile ??
        (rawData as Record<string, unknown>)?.molecular_weight_profile
    ),
    applicationSequence: normalizeSequence(
      (rawData as Record<string, unknown>)?.applicationSequence ??
        (rawData as Record<string, unknown>)?.application_sequence ??
        (rawData as Record<string, unknown>)?.timeOfUse
    ),
  };
}
