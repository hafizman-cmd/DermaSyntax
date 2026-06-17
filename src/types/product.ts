export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string[];
  safetyRating: number;
  pH: number;
  solubility: "aqueous" | "lipophilic" | "amphiphilic";
  functionalGroups: string[];
  molecularWeightProfile: "low" | "medium" | "high";
  applicationSequence: "AM" | "PM" | "All-Day";
}
