/**
 * skincare.ts — Core domain types for DermaSyntax
 *
 * This file is the single source of truth for all skincare data shapes.
 * It has zero imports and zero framework dependencies so it can be safely
 * consumed by data layers, rule engines, stores, and UI components alike.
 */

// ---------------------------------------------------------------------------
// Ingredient category — drives ALL rule-engine logic in rules.ts
// ---------------------------------------------------------------------------
export type IngredientCategory =
  | 'RETINOID'
  | 'AHA'
  | 'BHA'
  | 'PURE_VIT_C'
  | 'VIT_C_DERIVATIVE'
  | 'ANTIOXIDANT'
  | 'BRIGHTENER'
  | 'ACNE_TREATMENT'
  | 'HUMECTANT'
  | 'BARRIER_REPAIR';

// ---------------------------------------------------------------------------
// Ingredient — the canonical unit used everywhere in the application
// ---------------------------------------------------------------------------
export interface Ingredient {
  /** Unique, URL-safe identifier (e.g. 'retinol', 'l-ascorbic-acid') */
  id: string;
  name: string;
  category: IngredientCategory;
  /** When this ingredient should ideally be used */
  defaultTime: 'AM' | 'PM' | 'BOTH';
  /** Short educational description shown in cards and tooltips */
  description: string;
  /** Consolidated ceramide variant names when multiple lipid forms are merged into one complex */
  variants?: string[];
}

// ---------------------------------------------------------------------------
// RoutineSlot — identifies which half of the daily routine we're editing
// ---------------------------------------------------------------------------
export type RoutineSlot = 'AM' | 'PM';

// ---------------------------------------------------------------------------
// CompilationResult — output of the rule engine (rules.ts)
// Maps 1-to-1 with compiler diagnostic severity levels
// ---------------------------------------------------------------------------
export interface CompilationResult {
  /** Diagnostic severity — determines colour coding in the Compiler Console */
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  /** Short one-liner headline (like a compiler error code) */
  title: string;
  /** Full human-readable explanation with a suggested fix */
  message: string;
  /** IDs of the ingredients that triggered this result */
  targetIngredients: string[];
}
