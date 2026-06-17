import type { Product } from "@/types/product";

export interface CompatibilityReport {
  status: "safe" | "caution" | "conflict";
  reason: string;
  tuning: string;
}

function hasBHAorAHA(groups: string[]): boolean {
  return groups.some(
    (g) => g === "beta_hydroxy_acid" || g === "alpha_hydroxy_acid"
  );
}

const WEIGHT_ORDER: Record<Product["molecularWeightProfile"], number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function buildSequencingAdvice(
  productA: Product,
  productB: Product
): string {
  const rankA = WEIGHT_ORDER[productA.molecularWeightProfile];
  const rankB = WEIGHT_ORDER[productB.molecularWeightProfile];

  if (rankA === rankB) return "";

  const first = rankA < rankB ? productA : productB;
  const second = rankA < rankB ? productB : productA;

  return `Apply ${first.name} (${first.molecularWeightProfile} MW) before ${second.name} (${second.molecularWeightProfile} MW) for optimal transdermal absorption.`;
}

export function analyzeCompatibility(
  productA: Product,
  productB: Product
): CompatibilityReport {
  const groupsA = productA.functionalGroups;
  const groupsB = productB.functionalGroups;

  const bothExfoliants = hasBHAorAHA(groupsA) && hasBHAorAHA(groupsB);
  const pHDifference = Math.abs(productA.pH - productB.pH);
  const sequencingAdvice = buildSequencingAdvice(productA, productB);

  if (bothExfoliants) {
    return {
      status: "conflict",
      reason: `Exfoliation overload detected. ${productA.name} and ${productB.name} both carry BHA/AHA functional groups, risking epidermal barrier disruption and chemical irritation.`,
      tuning: `These products must not be layered in the same session. Assign one to AM and the other to PM, or alternate on non-consecutive days.${sequencingAdvice ? " " + sequencingAdvice : ""}`,
    };
  }

  if (pHDifference > 1.5) {
    const low = productA.pH < productB.pH ? productA : productB;
    const high = productA.pH < productB.pH ? productB : productA;

    return {
      status: "caution",
      reason: `pH gradient detected (Δ${pHDifference.toFixed(1)}). ${low.name} (pH ${low.pH}) may neutralise active compounds in ${high.name} (pH ${high.pH}), reducing formulation efficacy.`,
      tuning: `Insert a 3–5 minute intermission between applications to allow cutaneous pH re-equilibration.${sequencingAdvice ? " " + sequencingAdvice : ""}`,
    };
  }

  const seqA = productA.applicationSequence;
  const seqB = productB.applicationSequence;

  if (
    (seqA === "AM" && seqB === "PM") ||
    (seqA === "PM" && seqB === "AM")
  ) {
    const amProduct = seqA === "AM" ? productA : productB;
    const pmProduct = seqA === "AM" ? productB : productA;

    return {
      status: "caution",
      reason: `SEQUENCE MISMATCH DETECTED. You are attempting to layer an AM-designated formulation with a PM-designated formulation.`,
      tuning: `Protocol inefficiency identified. Move ${amProduct.name} to your morning routine and reserve ${pmProduct.name} for evening repair.${sequencingAdvice ? " " + sequencingAdvice : ""}`,
    };
  }

  return {
    status: "safe",
    reason: `No chemical antagonism identified between ${productA.name} and ${productB.name}. Ingredient matrices and pH ranges are compatible for concurrent layering.`,
    tuning: `${sequencingAdvice ? sequencingAdvice : "Standard application protocol confirmed. Proceed with routine as scheduled."}`,
  };
}
