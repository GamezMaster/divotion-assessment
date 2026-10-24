# Project Structure & Conventions

## Suggested module boundaries

Keep responsibilities clear without creating a component for every tiny fragment.

- `src/data/` — local product catalogue JSON.
- `src/types/` — product and wishlist types.
- `src/stores/` — Zustand wishlist store with its selectors/actions.
- `src/components/` — product listing, product card, header, wishlist panel,
  wishlist item, and reusable controls.
- `src/utils/` or `src/lib/` — storage validation and formatting helpers where useful.
- Tests colocated with code, or in a consistent `tests/` directory.

## Code quality principles

- Prefer cohesive components over fragment-sized ones.
- Explicit types; semantic HTML.
- Pure, testable business logic separated from rendering.
- Stable IDs; derive values instead of duplicating state.
- Consistent formatting (Prettier).
- Robust handling of persisted browser data — treat it as untrusted.

## Accessibility conventions

- Clear hover, focus, active, selected, and disabled states.
- Favorites buttons have accessible names and communicate selected state.
- The header favorites control exposes its purpose; the badge is not the only
  accessible indication of count.
- The side panel has an accessible name and suitable dialog semantics.
- Opening the panel moves focus into it; Escape closes it; closing restores focus to the trigger.
- If modal, contain keyboard focus and prevent background interaction appropriately.
- Backdrop click may close the panel; clicks inside must not.
- Quantity controls have accessible names identifying the product.
- Core interactions work by keyboard.
- Respect `prefers-reduced-motion`; motion is brief, purposeful, and non-blocking.
- Support narrow mobile and desktop layouts.
- Provide a considered empty state. Do not rely on color alone.

## Testing conventions

Use accessible queries in React Testing Library; avoid testing implementation details.
At minimum cover: add / duplicate add / remove / quantity updates, valid quantity
enforcement, derived unit count and total value, valid persisted-state restoration,
malformed and stale persisted data, listing rendering, wishlist button and badge
behaviour, panel open/close, quantity/removal controls, empty state, and keyboard
interactions where practical. If Playwright is configured, cover:
add → open wishlist → change quantity → reload → verify persistence.

## Working approach

1. Inspect the repository before changing anything; preserve useful conventions.
2. Work through `tasks/01`–`tasks/07` in order unless constraints justify otherwise.
3. Read the relevant task file before implementing it.
4. Resolve minor ambiguities with sensible defaults; document important choices.
5. Do not overwrite or remove user work without a clear reason.
6. Keep `README.md` accurate and explain *why* choices were made, not just which libraries were used.
7. At completion, summarize implementation, decisions, commands run, test results, and limitations.
