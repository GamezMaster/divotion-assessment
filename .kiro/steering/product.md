# Product Overview — Bare Minimum™

A polished **Product Listing Page with a Wishlist** for a fictional webshop, built as a
Senior/Staff Engineer interview assignment for Divotion (Conflux).

The shop is **Bare Minimum™**, a premium-looking, deliberately sarcastic lifestyle
webshop. It sells ordinary, slightly overpriced everyday products and markets them with
dry, cynical copy. The creative idea is **contrast**: the interface looks like a credible
high-end editorial webshop, while product copy and microcopy gently roast the customer,
modern marketing, and the products themselves.

The goal is a coherent, attractive, accessible, well-tested experience that demonstrates
sound technical judgment — not the maximum number of technologies or features.

## Brand voice

- Personality: dry, confident, understated, cynical, sarcastic.
- Acts like it's selling ordinary products with extraordinary confidence.
- Prefer concise punchlines over paragraphs of jokes. Sharp and consistent, not childish or loud.
- Design stays premium and calm; humour lives in product copy, labels, empty states,
  and interaction feedback — never in accessibility labels, errors, or important actions,
  which must stay clear and unambiguous.

## Canonical copy

- Brand wordmark: `BARE MINIMUM™`
- Tagline: `Unreasonably average. Surprisingly expensive.`
- Hero heading: `Finally. Products.`
- Hero body: `No life-changing innovations. No revolutionary breakthroughs. Just ordinary things, marketed with extraordinary confidence.`
- Wishlist title: `Your questionable taste`
- Wishlist intro: `A curated collection of things you didn't need before visiting this website.`
- Empty wishlist: `Nothing here.` / `A rare moment of financial responsibility. Enjoy it while it lasts.`
- Add feedback: `Excellent choice. Your bank account disagrees.`
- Remove feedback: `We've removed it. Your life remains unchanged.`
- Footer: `We could do better. But then we'd have to charge more.`

## Core requirements

- Product listing populated from a locally authored JSON file (~8–12 products).
- Add/remove products from a wishlist.
- Adjustable quantity per wishlist item.
- Wishlist persistence between browser sessions (localStorage).
- Header with the `BARE MINIMUM™` wordmark and a wishlist icon.
- Badge on the wishlist icon showing the **total number of units** saved.
- Wishlist shown in a side panel overlaying the listing.

## Example products

Dry product copy, e.g.: The Everyday Mug, Premium Water Bottle, Productivity Planner,
Noise-Cancelling Headphones, Luxury Notebook, Premium Socks, Ergonomic Office Chair,
Meditation Cushion, Meal Prep Containers, Alarm Clock, Self-Help Journal. Prices should
be plausible for the joke, not absurd on every item.

## Wishlist behaviour

- Adding an existing product must not create duplicate entries; adding from the listing
  leaves its quantity unchanged.
- Removing a product removes its entry.
- Quantities must be positive integers. Use one consistent decrement-at-one behaviour;
  removing at one is acceptable if clearly communicated.
- The badge shows **total units**, not only unique product types.
- Derive counts and totals from current state; never persist mutable totals.
- The wishlist stores product **IDs and quantities**, not duplicated product objects.
  Resolve product details from the catalogue at render time; handle stale IDs gracefully.
- Treat stored data as untrusted: tolerate malformed JSON, unexpected shapes, invalid
  quantities, and stale product IDs. If storage access fails, keep the session usable.

## Visual direction

Restrained premium editorial system: warm off-white / soft neutral background, dark ink
text, one deliberate accent, generous whitespace, strong typography, high-quality imagery.
It should feel like a real DTC lifestyle store, not a meme page. Sarcasm belongs in copy,
not as a substitute for clear UX. Motion is brief and purposeful.

## Definition of done

- Required functionality works; responsive UI is coherent.
- Bare Minimum™ branding and voice are consistent.
- Persistence and invalid-data handling are robust.
- Accessibility essentials are addressed.
- Type-check, lint, tests, and production build pass — or unavailable checks are reported honestly.
- README explains setup and trade-offs; production readiness is not overstated.
- No unrelated features or dependencies introduced.
