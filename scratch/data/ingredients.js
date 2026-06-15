/**
 * ingredients.ts — Curated database of active skincare ingredients
 *
 * This is a pure data file. It has no side-effects and no framework imports.
 * The rule engine (rules.ts) and Zustand store (useRoutineStore.ts) both
 * import from here. UI components should never hard-code ingredient data.
 */
export var INGREDIENTS = [
    // ── Retinoids ─────────────────────────────────────────────────────────────
    {
        id: 'retinol',
        name: 'Retinol',
        category: 'RETINOID',
        defaultTime: 'PM',
        description: 'Gold standard anti-aging derivative that accelerates cell turnover.',
    },
    {
        id: 'retinal',
        name: 'Retinaldehyde (Retinal)',
        category: 'RETINOID',
        defaultTime: 'PM',
        description: 'Potent retinoid that converts faster than retinol for quicker results.',
    },
    {
        id: 'tretinoin',
        name: 'Tretinoin (Retin-A)',
        category: 'RETINOID',
        defaultTime: 'PM',
        description: 'Prescription-strength pure retinoic acid. Highly bioactive.',
    },
    // ── Vitamin C ─────────────────────────────────────────────────────────────
    {
        id: 'l-ascorbic-acid',
        name: 'Pure Vitamin C (L-Ascorbic Acid)',
        category: 'PURE_VIT_C',
        defaultTime: 'AM',
        description: 'Highly potent antioxidant that brightens but is highly unstable at unstable pH.',
    },
    {
        id: 'vit-c-derivative',
        name: 'Vitamin C Derivative (THD Ascorbate/SAP)',
        category: 'VIT_C_DERIVATIVE',
        defaultTime: 'BOTH',
        description: 'Stable, non-irritating Vitamin C alternative that plays well with others.',
    },
    // ── Brighteners ───────────────────────────────────────────────────────────
    {
        id: 'niacinamide',
        name: 'Niacinamide (Vitamin B3)',
        category: 'BRIGHTENER',
        defaultTime: 'BOTH',
        description: 'Versatile anti-inflammatory that regulates oil and strengthens skin barrier.',
    },
    {
        id: 'azelaic-acid',
        name: 'Azelaic Acid',
        category: 'BRIGHTENER',
        defaultTime: 'BOTH',
        description: 'Dicarboxylic acid that reduces redness, rosacea, and post-acne marks.',
    },
    {
        id: 'alpha-arbutin',
        name: 'Alpha Arbutin',
        category: 'BRIGHTENER',
        defaultTime: 'BOTH',
        description: 'Safe hydroquinone derivative that blocks melanin production to fade dark spots.',
    },
    {
        id: 'tranexamic-acid',
        name: 'Tranexamic Acid',
        category: 'BRIGHTENER',
        defaultTime: 'BOTH',
        description: 'Amino acid derivative that targets stubborn hyperpigmentation and melasma.',
    },
    // ── Chemical Exfoliants ───────────────────────────────────────────────────
    {
        id: 'salicylic-acid',
        name: 'Salicylic Acid (BHA)',
        category: 'BHA',
        defaultTime: 'PM',
        description: 'Oil-soluble acid that penetrates deep into pores to clear sebum and acne.',
    },
    {
        id: 'glycolic-acid',
        name: 'Glycolic Acid (AHA)',
        category: 'AHA',
        defaultTime: 'PM',
        description: 'Smallest AHA molecule. Deeply exfoliates surface dead skin cells.',
    },
    {
        id: 'lactic-acid',
        name: 'Lactic Acid (AHA)',
        category: 'AHA',
        defaultTime: 'PM',
        description: 'Gentle, hydrating AHA that exfoliates surface layers without heavy irritation.',
    },
    // ── Acne Treatment ────────────────────────────────────────────────────────
    {
        id: 'benzoyl-peroxide',
        name: 'Benzoyl Peroxide',
        category: 'ACNE_TREATMENT',
        defaultTime: 'PM',
        description: 'Powerful antimicrobial agent that kills acne-causing bacteria.',
    },
    // ── Humectants ────────────────────────────────────────────────────────────
    {
        id: 'hyaluronic-acid',
        name: 'Hyaluronic Acid',
        category: 'HUMECTANT',
        defaultTime: 'BOTH',
        description: 'Powerful moisture binder that pulls water into the upper skin layers.',
    },
    {
        id: 'squalane',
        name: 'Squalane Oil',
        category: 'HUMECTANT',
        defaultTime: 'BOTH',
        description: 'Lightweight, non-comedogenic bio-mimetic oil that seals in hydration.',
    },
    // ── Barrier Repair ────────────────────────────────────────────────────────
    {
        id: 'ceramides',
        name: 'Ceramides',
        category: 'BARRIER_REPAIR',
        defaultTime: 'BOTH',
        description: 'Essential lipids that glue skin cells together to repair a damaged barrier.',
    },
    {
        id: 'centella-asiatica',
        name: 'Centella Asiatica (Cica)',
        category: 'BARRIER_REPAIR',
        defaultTime: 'BOTH',
        description: 'Traditional soothing botanical that stops irritation and calms redness.',
    },
    {
        id: 'panthenol',
        name: 'Panthenol (Vitamin B5)',
        category: 'BARRIER_REPAIR',
        defaultTime: 'BOTH',
        description: 'Deeply hydrating humectant and emollient that accelerates skin healing.',
    },
    {
        id: 'peptides',
        name: 'Peptides',
        category: 'BARRIER_REPAIR',
        defaultTime: 'BOTH',
        description: 'Amino acid chains that signal the skin to generate more structural collagen.',
    },
    // ── Antioxidants ──────────────────────────────────────────────────────────
    {
        id: 'ferulic-acid',
        name: 'Ferulic Acid',
        category: 'ANTIOXIDANT',
        defaultTime: 'AM',
        description: 'Plant-based antioxidant that doubles the stability and power of Vitamin C.',
    },
];
