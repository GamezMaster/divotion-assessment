# Technology Stack & Commands

## Package manager

Use **npm** (a `package-lock.json` is present). Do not switch package managers.

## Preferred stack

- React + TypeScript with **strict** type checking
- Vite
- **Zustand** for shared wishlist state, with the `persist` middleware backed by `localStorage`
- CSS Modules or well-structured plain CSS
- **Lucide React** for icons
- **Vitest** + **React Testing Library** for unit/component tests
- **Playwright** for one or two end-to-end flows only if proportionate
- ESLint + Prettier, using mutually compatible versions

## Stack constraints

- Before adding a dependency, check whether existing capabilities are sufficient.
- Implement the smallest complete solution that meets requirements.
- Do **not** add Next.js — no SSR, routing, backend, or SEO infrastructure is required.
- Do **not** add Redux; Zustand is sufficient.
- Avoid component libraries and CSS frameworks unless there is a clear reason.
- Do not over-engineer: no repositories, dependency injection, generic CRUD layers,
  or elaborate domain frameworks for this small assignment.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the Vite dev server
npm run build      # type-check (tsc -b) + production build
npm run lint       # ESLint
npm run preview    # preview the production build
# Add once configured:
npm run test       # Vitest
```

Note: the dev server, `preview`, and Vitest watch mode are long-running. For single-run
testing use a `--run` flag (e.g. `vitest run`). Prefer letting the user start long-running
processes manually.

## Verification discipline

- After each phase, run the relevant lint, type-check, test, and build commands.
- Fix failures before continuing.
- Never claim a command or test passed unless it was actually run. Report exact commands and outcomes.
