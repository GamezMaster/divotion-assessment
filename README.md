# Bare Minimum™

A premium-looking, deliberately sarcastic webshop for ordinary products marketed
with extraordinary confidence.

**Brand line:** _Unreasonably average. Surprisingly expensive._

The interface looks like a credible premium lifestyle store — restrained, editorial,
responsive, and easy to use. The sarcasm lives in product descriptions and microcopy,
not in the controls.

## Tech stack

- React + TypeScript (strict) + Vite
- Zustand with `localStorage` persistence for wishlist state
- Plain CSS with CSS Modules for component styles
- Lucide React for icons
- Vitest + React Testing Library for unit/component tests
- Playwright for one end-to-end persistence flow

## Setup

Node 26 is recommended (see `.nvmrc`; `nvm use` picks it up). CI reads the same `.nvmrc`,
so local and CI run on the same version.

```bash
npm install
npm run dev
```

## Commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite dev server                |
| `npm run build`        | Type-check (`tsc -b`) + production build |
| `npm run type-check`   | Type-check only                          |
| `npm run lint`         | ESLint                                   |
| `npm run test`         | Run the Vitest suite once                |
| `npm run test:watch`   | Vitest in watch mode                     |
| `npm run e2e`          | Run the Playwright end-to-end test       |
| `npm run format`       | Format source with Prettier              |
| `npm run format:check` | Check formatting without writing         |

## Architecture

```
src/
  data/        # products.json catalogue + typed accessor (single source of truth)
  types/       # Product and WishlistEntry types
  lib/         # formatting, persisted-data validation, focus-trap,
               #   safe storage, taste-report scoring
  stores/      # Zustand wishlist + description-mode stores
  components/  # Header, ModeToggle, ProductListing, ProductCard, ProductImage,
               #   WishlistPanel, WishlistItem, TasteReport
```

- **Catalogue as source of truth.** Products live in `src/data/products.json` and are
  read through `src/data/catalogue.ts`. Components never duplicate catalogue data, and a
  `getProductById` helper supports resolving products by stable ID. Each product carries
  both a `marketing` and an `honest` description (see the Honesty Toggle below).
- **Prices** are formatted once via `Intl.NumberFormat` (`en-NL`, EUR) in
  `src/lib/format.ts` for consistent display.
- **Images** are served from the Unsplash image CDN (an external dependency — see below).
  `ProductImage` renders a neutral, accessible fallback tile if an image fails to load.
- **Responsive grid** in `ProductListing` scales from one column on mobile up to four on
  wide desktops.

**Why these choices.** This is a small, self-contained front-end assignment with no
backend, auth, or real inventory, so local JSON is the right weight for the catalogue and
`localStorage` is the right weight for persistence — they keep the app fully functional and
reviewable with zero infrastructure. Zustand (rather than Redux or Context gymnastics)
gives a tiny, typed store with built-in `persist`, which is proportionate to two pieces of
shared state (wishlist + description mode). Anything heavier would be architecture for its
own sake.

## Wishlist state and persistence

The wishlist lives in a focused Zustand store (`src/stores/wishlist.ts`) persisted to
`localStorage` under the key `bare-minimum:wishlist`.

- **Entries store `{ productId, quantity }` only** — never duplicated product objects.
  Product details and prices are resolved from the catalogue at render time.
- **Derived values, never persisted.** Total units (the badge count), total value, and
  distinct count are computed from state via selectors. Stale product IDs (no longer in
  the catalogue) are skipped when computing value, so a changed catalogue can't crash or
  mis-total the wishlist.
- **Decisions:**
  - The badge shows **total units**, not distinct product types.
  - Adding an already-wishlisted product from the listing is a membership toggle and does
    **not** change its quantity; quantity is adjusted in the wishlist panel.
  - Decrementing quantity from one removes the entry.
  - Quantities are always positive integers (floats are floored; values below one remove
    the entry).
- **Untrusted persisted data.** On rehydration the store sanitizes storage
  (`src/lib/wishlist-validation.ts`): non-array data, bad shapes, invalid quantities, and
  duplicate IDs are dropped. Corrupt JSON is tolerated without crashing the app.
- **Storage that never throws.** `localStorage` can be unavailable or throw (private
  mode, quota, security policy). `src/lib/safeStorage.ts` wraps every access in a guard,
  so if persistence is impossible the wishlist still works in-memory for the session —
  reads return null and writes are dropped rather than crashing.

## External dependencies

Product imagery is loaded from `images.unsplash.com`. This is an intentional external
dependency for the assignment. If a URL ever breaks, the UI degrades gracefully to a
labelled placeholder rather than a broken-image icon. A production store would host and
optimize its own product imagery.

## Header and wishlist panel

- The header is sticky and holds the wordmark, tagline, and a wishlist trigger. The
  trigger's accessible name includes the live count (e.g. _"Open wishlist, 3 items"_),
  so the numeric badge is never the only indication of the count.
- The panel is a modal dialog (`role="dialog"`, `aria-modal`, labelled by its title and
  described by its intro) that slides in over the listing with a backdrop.
- **Focus management** (`src/lib/useFocusTrap.ts`): opening moves focus into the panel,
  Tab/Shift+Tab are trapped within it, and closing restores focus to the trigger.
- Closes via the close button, backdrop click, or Escape. Background scroll is locked
  while open; clicks inside the panel do not close it.
- Each item shows image, name, unit price, quantity stepper, line total, and a remove
  button. Decrementing from one removes the item, and that button's accessible name says
  so explicitly (distinct from the dedicated remove button).
- The total is framed as _"Total value of your questionable decisions"_ — deliberately a
  wishlist value, not an order total.
- Empty state gives the brand copy plus a clear "Back to browsing" action.
- Add/remove feedback is announced through a single polite `aria-live` status region
  rather than a stream of toasts.

## The Honesty Toggle

The signature feature: a toggle that switches every product description between polished
**Marketing Mode** copy and the brand's dry **Honesty Mode** copy ("It's a mug. You
already own three.").

- **One source of truth.** Each product in `products.json` holds
  `description: { marketing, honest }` (typed as `ProductDescription`). There is no second
  catalogue — the displayed voice is _derived_ at render time from the current mode and
  the product data, so the selected copy is never duplicated into state.
- **State.** A small, focused Zustand store (`src/stores/mode.ts`) mirrors the wishlist
  store's approach: persisted to `localStorage` (`bare-minimum:mode`) through the same
  `safeStorage` guard. Default is **Marketing Mode**, so visitors meet the polished
  storefront before discovering the joke. Missing, invalid, or unavailable stored values
  fall back to marketing via `coerceMode`.
- **Control.** `ModeToggle` is a segmented control implemented as a `radiogroup` (two
  radios), giving correct roles, per-option selected state, arrow-key navigation, and a
  meaningful accessible name. The active option is shown by a filled segment _and_ the
  native checked state — never colour alone.
- **Interaction.** Switching is immediate and leaves name, price, image, wishlist state,
  quantities, and scroll position untouched (only the description text changes). The card
  description reserves ~3 lines of height so differing copy lengths don't make the grid
  jump. Transitions respect `prefers-reduced-motion`.

## Your Questionable Taste Report

Inside the wishlist panel, the storefront generates a dry, editorial "Questionable Taste
Report" that judges the current selection.

- **Pure, deterministic scoring.** All logic lives in `src/lib/taste-report.ts`, separate
  from presentation. `generateReport(items)` derives the financial commitment (accounting
  for quantities), the most expensive "most questionable decision", a shopping personality,
  and a closing verdict. The same wishlist always yields the same report — no randomness,
  nothing persisted.
- **Explicit personality rules.** `selectPersonality` applies a short, ordered rule set
  (productivity-heavy → _Aspiring Executive_; few but pricey comfort items → _Luxury
  Minimalist_; many varied categories → _Indecisive Collector_) with an unconditional
  fallback (_Reluctantly Responsible Adult_), so every non-empty wishlist resolves to a
  valid profile. The "most questionable" quip reuses the product's own honest description.
- **Synced to state.** The report reads the same resolved wishlist items the panel renders,
  so it updates on add, remove, and quantity change, survives a reload with the wishlist,
  and returns to no-report when the last item is removed (the panel's empty state shows).
- **Accessible + on-brand.** Rendered as a labelled `<section>` with a semantic heading and
  a `<dl>` of figures, restrained editorial styling, and a subtle disclaimer ("Not
  financial advice. Barely advice at all."). Profile/verdict differences are conveyed in
  text, not colour.

## Design system

Design tokens live in `src/index.css` (`:root`): a warm off-white palette with a single
terracotta accent, a 4px-based spacing scale, radii, three shadow levels, and shared
motion/focus tokens. Components consume the tokens rather than hard-coded values, so the
system stays consistent.

- **Layout.** One shared max width (1200px) and grid gap; the product grid scales 1 → 4
  columns across mobile, tablet, and desktop. Cards are flex columns with a flexible
  description row, so prices align across cards regardless of description length.
- **Imagery.** Product images use a fixed 4:5 aspect ratio with `object-fit: cover` for
  consistent cropping, and degrade to a labelled placeholder on load failure.
- **Contrast (WCAG AA, verified).** Body text 15.9:1, muted text 4.9:1, accent 4.5:1,
  white-on-accent 5.0:1 — all pass for normal text.

## Accessibility notes

- Product images have descriptive alt text; the fallback preserves it via `aria-label`.
- Wishlist buttons have explicit accessible names identifying the product and expose
  selected state with `aria-pressed`. Selection is shown by the heart **filling in**
  (a shape change), not colour alone.
- Every interactive control is keyboard operable. A global `:focus-visible` baseline
  guarantees a visible accent focus ring, which components tune where needed.
- A global `prefers-reduced-motion` rule collapses animations and transitions, on top of
  per-component reduced-motion handling.

## Testing

- **Unit + component (Vitest + RTL):** 92 tests across 14 files, using accessible queries
  and asserting observable behaviour rather than implementation details. Coverage spans
  the catalogue and price formatting, the store (add, duplicate-add no-op, remove,
  increment/decrement, decrement-at-one, derived totals, stale IDs), persisted-data
  sanitization (malformed JSON, bad shapes, invalid quantities), header count and selected
  button state, panel open/close including Escape, the empty state, quantity/remove
  controls, graceful behaviour when `localStorage` throws, the Honesty Toggle (default
  mode, switching updates all descriptions, switching back, wishlist/price/image untouched,
  persistence, and invalid-stored-value fallback), and the Taste Report (empty / single /
  multiple wishlists, quantity-aware totals, personality rules and fallback, determinism,
  and live updates on add/remove/quantity change).
- **End-to-end (Playwright, Chromium):** one flow that jsdom can only approximate — add an
  item, open the panel, raise the quantity, **reload the real page**, and verify the item
  and quantity persist. Run with `npm run e2e`; it builds and serves the preview
  automatically. Kept intentionally minimal and separate from the default `npm run test`.

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request targeting `main`
and every push to `main`. It reads the Node version from `.nvmrc` (Node 26, matching local
development), installs reproducibly with `npm ci` from `package-lock.json`, and then runs
the same scripts you run locally:

```bash
npm ci            # reproducible install from the lockfile
npm run lint      # ESLint
npm run format:check
npm run type-check # tsc -b --noEmit
npm run test      # Vitest (unit + component)
npm run build     # tsc -b + production build
```

Any failed step fails the workflow — no commands mask their exit code. The Playwright
`e2e` flow is intentionally **not** part of this gate (it needs a browser download); run it
locally with `npm run e2e`.

A pull request template lives at `.github/pull_request_template.md`.

**Manual GitHub setup (cannot be configured from the repo):** to enforce the gate, add the
CI job as a required status check under the branch protection rules for `main` in the
repository settings.

## Status / limitations

All nine tasks are complete: project tooling (01); brand, catalogue, and responsive
product listing (02); the wishlist state store with persistence (03); the header wishlist
control/badge plus the accessible side panel (04); the premium design system, responsive
polish, and accessibility pass (05); the testing, quality, and resilience pass (06); the
Honesty Toggle feature (07); the Questionable Taste Report (08); and the CI engineering
quality gate (09). The full experience — browse, toggle between marketing and honest copy,
wishlist items, adjust quantities in the panel, read the generated taste report, and have
both the wishlist and the selected mode persist across a real reload — works end to end and
is covered by tests.

This is an interview assignment and is not production-hardened. Notably, product imagery
depends on an external CDN (`images.unsplash.com`) and would be self-hosted and optimized
in production.
