# AGENTS.md

## Commands
- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — lint via `next lint` (ESLint + eslint-config-next)

There is no separate typecheck script; TypeScript is checked through `next build` (strict mode is on, `noEmit`).

## Tech Stack
- **Framework**: Next.js 14.2 (App Router) — `src/app/` layout, client components via `'use client'`.
- **Language**: TypeScript 5 (strict). Path alias `@/*` → `./src/*`.
- **React**: 18.
- **Styling**: Tailwind CSS 3.4 + PostCSS/Autoprefixer. `darkMode: 'class'` (root `<html className="dark">`). Custom design tokens defined in `tailwind.config.js` under `theme.extend` (ide-bg/surface/border, err/warn/ok/info severity colors, cat-* category badge palette, fade-in/slide-up/pulse-slow animations). Fonts: Inter (sans), JetBrains Mono (mono).
- **Animation**: framer-motion (motion components, AnimatePresence, layout animations).
- **State**: Zustand (`src/store/useRoutineStore.ts`) — single store with `create()`; selectors used per-field at call sites.
- **UI primitives**: Radix UI (scroll-area, tooltip), `lucide-react` icons, Spline (`@splinetool/react-spline`) for hero 3D.
- **Class composition**: `cn()` helper in `src/lib/utils.ts` using `clsx` + `tailwind-merge` (cva available). Note: `page.tsx` defines a *local* `cn` for plain string concatenation — prefer the `@/lib/utils` `cn` for new code.
- **No test framework configured.**

## Folder Structure
```
src/
  app/            # Next.js App Router: layout.tsx, page.tsx (home), globals.css, + routes (docs, manual, product-base, shop, api)
  components/     # Feature components (Navbar, IngredientCard, RoutineSlotPanel, CompilerConsole, MechanismDrawer, ExportPanel, SplineScene, GatewayNav, AnimatedThemeToggler)
    ui/           # Reusable primitives (origin-button.tsx)
  data/           # Static domain data: ingredients.ts, products.json, rules.ts (rule-engine source)
  lib/            # Logic + utils: compatibility-engine.ts, data-adapter.ts, api-fetcher.ts, utils.ts (cn)
  store/          # Zustand stores (useRoutineStore.ts)
  types/          # Domain types: skincare.ts (Ingredient/CompilationResult), product.ts
```

## Coding Conventions
- **Domain types are the single source of truth.** `src/types/skincare.ts` is intentionally framework-free; reuse it across data, rule, store and UI layers. Do not duplicate ingredient shapes.
- **Rule engine terminology mirrors compiler diagnostics**: `CompilationResult.status` is one of `SUCCESS | WARNING | ERROR | INFO` and drives color coding in the Compiler Console. Keep new rules emitting these severities.
- **Ingredient categories** (`IngredientCategory`) drive ALL rule logic — extend the union in `types/skincare.ts` and the `LAYER_WEIGHTS` map in `useRoutineStore.ts` together.
- **Zustand**: one `create()` store, field-level selectors at call sites (`useRoutineStore(s => s.x)`) to avoid re-renders. Mutations call `recompile()` to keep `compilationResults` in sync.
- **Imports**: use `@/` alias (e.g. `@/components/...`, `@/store/...`, `@/types/...`). Relative imports only within a single component group (see `Navbar.tsx` → `./AnimatedThemeToggler`).
- **Client vs server**: mark interactive components with `'use client'` at top. Root `layout.tsx` stays a server component; route pages that use hooks/state are client.
- **Theming**: every color usage must support both light and dark via `dark:` variants. Light defaults `bg-zinc-50 text-zinc-800`; dark `bg-[#121212] text-zinc-100`. Theme-agnostic scrollbars are styled in `globals.css`.
- **Styling ergonomics**: combine classes with `cn()` from `@/lib/utils`. Prefer Tailwind utility composition; reserve custom CSS (`globals.css`) for scrollbar, `.report-line` and `.clinical-card` effects.
- **Aesthetic**: clinical/IDE/compiler vocabulary in copy (e.g. "MATRIX SEC //", "[ROUTINE CONFLICT //]", uppercase tracking-widest font-mono micro-labels). Match this tone in new UI text.
- **No comments in component JSX** unless documenting a non-obvious system reset (see Navbar logo comment). File-level docstrings (e.g. `skincare.ts`, `useRoutineStore.ts`) are encouraged for domain modules.
- **Do not commit secrets.** API fetcher (`src/lib/api-fetcher.ts`) hits the public Open Beauty Facts taxonomy — no auth keys.