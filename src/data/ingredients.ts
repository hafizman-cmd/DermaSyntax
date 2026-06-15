import { Ingredient } from '@/types/skincare';

export const INGREDIENTS: Ingredient[] = [
  // ── 1. RETINOIDS (Cellular Turnover Engines) ───────────────────────────
  {
    id: 'tretinoin',
    name: 'Tretinoin (Retin-A)',
    description: 'Prescription-strength pure retinoic acid. Bypasses metabolic conversion paths to directly bind cell DNA receptors, accelerating cell turnover and collagen building.',
    category: 'RETINOID',
    defaultTime: 'PM'
  },
  {
    id: 'retinol',
    name: 'Pure Retinol',
    description: 'Gold-standard anti-aging derivative. Requires a two-step intracellular conversion path into retinoic acid to smooth fine lines and address sun damage.',
    category: 'RETINOID',
    defaultTime: 'PM'
  },
  {
    id: 'retinaldehyde',
    name: 'Retinaldehyde (Retinal)',
    description: 'Next-generation retinoid requiring only a single conversion step to retinoic acid. Delivers clinical power up to 11x faster than standard retinol with less surface irritation.',
    category: 'RETINOID',
    defaultTime: 'PM'
  },
  {
    id: 'adapalene',
    name: 'Adapalene',
    description: 'A highly stable, third-generation topical retinoid specifically calibrated to target follicular acne pathways, modulate skin peeling, and calm inflammation.',
    category: 'RETINOID',
    defaultTime: 'PM'
  },

  // ── 2. AHA EXFOLIANTS (Surface Texturizers) ───────────────────────────
  {
    id: 'glycolic_acid',
    name: 'Glycolic Acid',
    description: 'The smallest Alpha-Hydroxy Acid molecule. Penetrates deeply to break down the intercellular glue holding dead skin cells together, revealing vibrant surface clarity.',
    category: 'AHA',
    defaultTime: 'PM'
  },
  {
    id: 'lactic_acid',
    name: 'Lactic Acid',
    description: 'A larger, gentler AHA molecule. Sloughs away dull, damaged skin cells while acting as a natural humectant to actively draw water molecules into the newly exposed barrier.',
    category: 'AHA',
    defaultTime: 'PM'
  },
  {
    id: 'mandelic_acid',
    name: 'Mandelic Acid',
    description: 'An aromatic AHA derived from bitter almonds. Its high molecular weight slows down absorption, making it an incredibly safe exfoliating option for sensitive or deeply pigmented skin.',
    category: 'AHA',
    defaultTime: 'PM'
  },

  // ── 3. BHA EXFOLIANTS (Pore Clarifiers) ───────────────────────────────
  {
    id: 'salicylic_acid',
    name: 'Salicylic Acid',
    description: 'Oil-soluble Beta-Hydroxy Acid. Tunnels effortlessly through surface oils to deep-clean the interior pore walls, breaking down stubborn sebum plugs and stopping blemishes.',
    category: 'BHA',
    defaultTime: 'PM'
  },

  // ── 4. PURE VITAMIN C (Antioxidant Shields) ────────────────────────────
  {
    id: 'l_ascorbic_acid',
    name: 'Pure Vitamin C (L-Ascorbic Acid)',
    description: 'The biologically active form of Vitamin C. Neutralizes atmospheric free radical vectors, boots UV shield efficiency, and upregulates fresh structural collagen synthesis.',
    category: 'PURE_VIT_C',
    defaultTime: 'AM'
  },

  // ── 5. VITAMIN C DERIVATIVES (Stable Brighteners) ─────────────────────
  {
    id: 'thd_ascorbate',
    name: 'Tetrahexyldecyl Ascorbate (THD)',
    description: 'An ultra-stable, lipid-soluble Vitamin C derivative. Penetrates past the skin lipid barrier effortlessly to target hyperpigmentation without causing acidic irritation.',
    category: 'VIT_C_DERIVATIVE',
    defaultTime: 'BOTH'
  },
  {
    id: 'sodium_ascorbyl_phosphate',
    name: 'Sodium Ascorbyl Phosphate (SAP)',
    description: 'A stable, water-soluble Vitamin C salt. Converts to ascorbic acid on the skin surface and exhibits distinct antimicrobial properties that neutralize acne-causing bacteria.',
    category: 'VIT_C_DERIVATIVE',
    defaultTime: 'AM'
  },

  // ── 6. ANTIOXIDANTS (Environmental Protectors) ────────────────────────
  {
    id: 'ferulic_acid',
    name: 'Ferulic Acid',
    description: 'A plant-derived organic compound. Acts as a stabilization anchor for fragile vitamins C and E, doubling their photoprotective capabilities against ambient UV strain.',
    category: 'ANTIOXIDANT',
    defaultTime: 'AM'
  },
  {
    id: 'resveratrol',
    name: 'Resveratrol',
    description: 'A potent polyphenolic molecule. Works overnight to stimulate internal cellular antioxidant production pathways while down-regulating inflammatory skin markers.',
    category: 'ANTIOXIDANT',
    defaultTime: 'PM'
  },
  {
    id: 'coenzyme_q10',
    name: 'Coenzyme Q10 (Ubiquinone)',
    description: 'A vital cellular energy co-factor. Neutralizes free radicals and visibly reduces the depth of wrinkles caused by environmental photo-aging.',
    category: 'ANTIOXIDANT',
    defaultTime: 'BOTH'
  },

  // ── 7. BRIGHTENERS (Melanin Regulators) ────────────────────────────────
  {
    id: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    description: 'A versatile cellular energy engine. Blocks the transfer of pigment-carrying melonosomes into skin cells, reduces redness, and regulates sebaceous oil flow.',
    category: 'BRIGHTENER',
    defaultTime: 'BOTH'
  },
  {
    id: 'azelaic_acid',
    name: 'Azelaic Acid',
    description: 'A dicarboxylic acid that targets hyperactive melanocytes to fade dark marks. Calms vascular redness and sweeps micro-congestion out of pore openings.',
    category: 'BRIGHTENER',
    defaultTime: 'BOTH'
  },
  {
    id: 'alpha_arbutin',
    name: 'Alpha Arbutin',
    description: 'A safe hydroquinone derivative. Competitively blocks tyrosinase enzyme activity to stop melanin overproduction, fading dark marks and uniforming skin tone.',
    category: 'BRIGHTENER',
    defaultTime: 'BOTH'
  },
  {
    id: 'tranexamic_acid',
    name: 'Tranexamic Acid',
    description: 'An amino acid derivative that interrupts the inflammatory chemical signals triggered by UV exposure, preventing chronic discoloration and dark spots.',
    category: 'BRIGHTENER',
    defaultTime: 'BOTH'
  },
  {
    id: 'kojic_acid',
    name: 'Kojic Acid',
    description: 'A natural chelation agent derived from fungi. Inhibits free tyrosinase production to dramatically fade stubborn UV sun spots and post-inflammatory marks.',
    category: 'BRIGHTENER',
    defaultTime: 'BOTH'
  },
  {
    id: 'licorice_root',
    name: 'Licorice Root Extract',
    description: 'Contains liquiritin, which actively disperses existing melanin clusters to safely brighten skin tone while providing robust anti-inflammatory protection.',
    category: 'BRIGHTENER',
    defaultTime: 'BOTH'
  },

  // ── 8. ACNE TREATMENTS (Pathogen Neutralizers) ────────────────────────
  {
    id: 'benzoyl_peroxide',
    name: 'Benzoyl Peroxide',
    description: 'An oxygenating antimicrobial compound. Floods clogged pores with oxygen to instantly neutralize anaerobic acne bacteria at the root.',
    category: 'ACNE_TREATMENT',
    defaultTime: 'BOTH'
  },
  {
    id: 'sulfur',
    name: 'Clinical Sulfur',
    description: 'A traditional mineral treatment. Absorbs excess surface oils, gently breaks down surface debris, and acts as a natural antiseptic to calm painful blemishes.',
    category: 'ACNE_TREATMENT',
    defaultTime: 'PM'
  },

  // ── 9. HUMECTANTS (Moisture Catchers) ──────────────────────────────────
  {
    id: 'hyaluronic_acid',
    name: 'Hyaluronic Acid',
    description: 'A powerful humectant molecule that holds up to 1,000x its molecular weight in moisture, pulling deep hydration straight into the skin matrix.',
    category: 'HUMECTANT',
    defaultTime: 'BOTH'
  },
  {
    id: 'glycerin',
    name: 'Pure Glycerin',
    description: 'An essential skin-identical humectant. Reaches past surface layers to hydrate the intercellular lipid grid and mimic the skins natural moisturizing factor (NMF).',
    category: 'HUMECTANT',
    defaultTime: 'BOTH'
  },
  {
    id: 'panthenol',
    name: 'Panthenol (Vitamin B5)',
    description: 'A restorative alcohol analog of Vitamin B5. Acts as a moisture-grabbing humectant while boosting systemic skin healing and soothing deep cellular irritation.',
    category: 'HUMECTANT',
    defaultTime: 'BOTH'
  },
  {
    id: 'polyglutamic_acid',
    name: 'Polyglutamic Acid',
    description: 'A giant peptide mesh that holds up to 5,000x its weight in water. Creates a breathable moisture seal over the skin surface to lock in underlying hydration.',
    category: 'HUMECTANT',
    defaultTime: 'BOTH'
  },

  // ── 10. BARRIER REPAIRS (Lipid Plugs) ──────────────────────────────────
  {
    id: 'ceramides',
    name: 'Ceramides (NP, AP, EOP)',
    description: 'Essential skin lipids that form the structural mortar between skin cell bricks, sealing the outer skin barrier against environmental irritants and preventing water loss.',
    category: 'BARRIER_REPAIR',
    defaultTime: 'BOTH'
  },
  {
    id: 'squalane',
    name: 'Pure Squalane Oil',
    description: 'A stable, biocompatible oil that mimics natural skin sebum. Delivers intense surface softening and locks in hydration without blocking pore pathways.',
    category: 'BARRIER_REPAIR',
    defaultTime: 'BOTH'
  },
  {
    id: 'centella_asiatica',
    name: 'Centella Asiatica (Cica / Madecassoside)',
    description: 'An ancient, soothing plant extract rich in saponins. Suppresses active inflammatory cascades, builds collagen networks, and speeds up structural skin healing.',
    category: 'BARRIER_REPAIR',
    defaultTime: 'BOTH'
  },
  {
    id: 'allantoin',
    name: 'Allantoin',
    description: 'A soothing botanical compound that promotes skin cell shedding, sloughs away rough texture, scales down inflammation, and draws deep water into cell structures.',
    category: 'BARRIER_REPAIR',
    defaultTime: 'BOTH'
  },
  {
    id: 'cholesterol',
    name: 'Plant Cholesterol',
    description: 'A fundamental lipid component required for structural skin health. Works with ceramides and fatty acids to rebuild and reinforce compromised cellular barriers.',
    category: 'BARRIER_REPAIR',
    defaultTime: 'BOTH'
  },
  {
    id: 'peptides',
    name: 'Peptide Complex',
    description: 'Short chains of amino acids that act as cellular messengers, signaling the skin matrix to synthesize fresh structural collagen and elastin proteins.',
    category: 'BARRIER_REPAIR',
    defaultTime: 'BOTH'
  }
];