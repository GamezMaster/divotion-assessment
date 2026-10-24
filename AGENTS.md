# Agent Instructions — Bare Minimum™ Product Listing & Wishlist

## Assignment context
Build a polished Product Listing Page for a fictional webshop as a Senior Software Engineer / Staff Engineer interview assignment with Divotion (Conflux).

The shop is **Bare Minimum™**, a premium-looking, deliberately sarcastic lifestyle webshop. It sells ordinary, slightly overpriced everyday products and markets them with dry, cynical copy.

**Brand line:** `Unreasonably average. Surprisingly expensive.`

The central creative idea is contrast: the interface should look like a credible, high-end editorial webshop, while product copy and microcopy gently roast the customer, modern marketing, and the products themselves. Keep the humour sharp and consistent, not childish or relentlessly loud.

Required functionality:
- Product listing populated from a locally authored JSON file.
- Add/remove products from a wishlist.
- Adjustable quantity per wishlist item.
- Wishlist persistence between browser sessions.
- Header with the Bare Minimum™ wordmark and wishlist icon.
- Badge on the wishlist icon showing the total number of units saved.
- Wishlist shown in a side panel overlaying the listing.
- A crafted, creative implementation that demonstrates sound technical judgment.

The goal is not to maximize technologies or features. Build a coherent, attractive, accessible, well-tested experience and be ready to explain trade-offs.

## Brand and content direction
- Personality: dry, confident, understated, cynical and sarcastic.
- The brand acts like it is selling ordinary products with extraordinary confidence.
- Prefer concise punchlines over paragraphs of jokes.
- Design remains premium and calm; humour appears in product copy, labels, empty states, and interaction feedback.
- Keep essential instructions clear. Do not make accessibility labels, errors, or important actions ambiguous for the sake of a joke.

Starting copy:
- Brand: `BARE MINIMUM™`
- Tagline: `Unreasonably average. Surprisingly expensive.`
- Hero heading: `Finally. Products.`
- Hero body: `No life-changing innovations. No revolutionary breakthroughs. Just ordinary things, marketed with extraordinary confidence.`
- Wishlist title: `Your questionable taste`
- Wishlist intro: `A curated collection of things you didn't need before visiting this website.`
- Empty wishlist: `Nothing here.` / `A rare moment of financial responsibility. Enjoy it while it lasts.`
- Add feedback: `Excellent choice. Your bank account disagrees.`
- Remove feedback: `We've removed it. Your life remains unchanged.`
- Footer: `We could do better. But then we'd have to charge more.`

Create around 8–12 products, using examples such as The Everyday Mug (“Holds approximately one coffee. Just like the mug you already own.”), Premium Water Bottle (“It holds water. Revolutionary, we know.”), Productivity Planner (“For organizing all the things you won't do.”), Noise-Cancelling Headphones (“Because people are exhausting.”), Luxury Notebook (“For your million-dollar ideas. And grocery lists.”), Premium Socks (“They're socks. We added a logo.”), Ergonomic Office Chair (“For sitting through meetings that could've been emails.”), Meditation Cushion (“Sit down and discover 47 new things to worry about.”), Meal Prep Containers (“For the meals you'll order instead.”), Alarm Clock (“Because your dreams were getting out of hand.”), and Self-Help Journal (“Write down your problems. Now they're organized.”). Prices should be plausible for the joke, not absurd on every item.

## Working approach
1. Inspect the repository before changing anything. Preserve useful conventions.
2. If empty, initialize according to `tasks/01-project-setup.md`.
3. Work through tasks 01–07 in order unless repository constraints justify a different order.
4. Read the relevant task file before implementation.
5. Before adding a dependency, check whether existing capabilities are sufficient.
6. Implement the smallest complete solution that meets requirements.
7. After each phase, run relevant lint, type-check, and tests. Fix failures before continuing.
8. Never claim a command or test passed unless it was actually run.
9. Resolve minor ambiguities with sensible defaults and document important choices.
10. Do not overwrite or remove user work without a clear reason.
11. At completion, summarize implementation, decisions, commands run, test results, and limitations.

## Preferred stack
- React, TypeScript with strict checking, Vite
- Zustand with `persist` middleware and `localStorage`
- CSS Modules or well-structured plain CSS
- Lucide React for icons
- Vitest and React Testing Library
- Playwright for one or two end-to-end flows if proportionate

Use the repository's package manager. If none exists, use npm. Do not add Next.js solely to demonstrate familiarity: SSR, routing, a backend, and SEO infrastructure are not required. Do not add Redux when Zustand is sufficient. Avoid component libraries unless clearly justified.

## Architecture and quality
Suggested boundaries: `data/` for local product JSON; `types/`; `stores/`; `components/` for header, listing, product card, wishlist panel and wishlist item; `utils/` or `lib/` for validation and formatting; tests colocated or in a consistent test directory.

Prefer cohesive components, explicit types, semantic HTML, pure/testable business logic, stable IDs, derived values instead of duplicated state, and robust handling of persisted browser data. Store product IDs and quantities in the wishlist, not duplicate product objects. Resolve details from the catalogue and handle stale IDs gracefully. Do not over-engineer with repositories, dependency injection, generic CRUD layers, or elaborate domain frameworks.

## Wishlist behaviour
- Adding an existing product must not create duplicate entries; adding from the listing leaves its quantity unchanged.
- Removing a product removes its entry.
- Quantities must be positive integers. Pick a consistent decrement-at-one behaviour; removing at one is acceptable if clearly communicated.
- Badge shows total units, not only unique product types.
- Derive counts and totals rather than persisting mutable totals.
- Persist wishlist changes between sessions.
- Treat stored data as untrusted: tolerate malformed JSON, unexpected shapes, invalid quantities, and stale product IDs.
- If storage access fails, keep the current session usable where feasible.

## UX, visual design, and accessibility
Use a restrained premium editorial system: warm off-white or soft neutral background, dark ink text, one deliberate accent, generous whitespace, strong typography, and high-quality imagery. The brand should feel like a real DTC lifestyle store, not a meme page. Sarcasm belongs in copy, not as a substitute for clear UX.

- Product images load reliably and have useful alt text.
- Clear hover, focus, active, selected, and disabled states.
- Wishlist buttons have accessible names and communicate selected state.
- Header wishlist control exposes its purpose; the badge is not the only accessible count.
- Side panel has an accessible name and suitable dialog semantics.
- Opening moves focus into the panel; Escape closes it; closing restores focus to the trigger.
- If modal, contain keyboard focus and prevent background interaction as appropriate.
- Backdrop click may close the panel; clicks inside must not.
- Quantity controls have accessible names identifying the product.
- Core interactions work by keyboard; respect `prefers-reduced-motion`.
- Support narrow mobile and desktop layouts; provide a considered empty state.
- Do not rely on colour alone. Motion should be brief and purposeful.

## Testing
At minimum test add, duplicate add, remove, quantity updates, positive integer enforcement, derived unit count and total value, valid persistence restoration, malformed/stale persisted data, listing rendering, button/badge behaviour, panel interactions, empty state and keyboard interactions where practical. Use accessible React Testing Library queries. If Playwright is configured, cover add → open wishlist → change quantity → reload → verify persistence.

## Documentation and definition of done
Keep README accurate: setup/run commands, lint/type-check/test/build, architecture trade-offs, persistence, accessibility, limitations, and what would change for a production webshop. Explain why choices were made and do not overstate production readiness.

Done means required functionality works; the responsive UI is coherent; Bare Minimum™ branding and voice are consistent; persistence and invalid-data handling are robust; accessibility essentials are addressed; checks pass or are honestly reported; README explains setup and trade-offs; no unrelated features/dependencies were added.
