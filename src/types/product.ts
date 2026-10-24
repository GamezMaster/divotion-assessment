/**
 * A single catalogue product. Shapes the locally authored JSON in
 * `src/data/products.json` and is the source of truth for product details.
 *
 * The wishlist stores only `id` + quantity and resolves the rest of these
 * fields from the catalogue at render time, so IDs must be stable.
 */
/**
 * The two description voices for a product. Marketing is the polished,
 * exaggerated storefront copy; honest is the dry, truthful version revealed by
 * the Honesty Toggle. Both live in the catalogue so no copy is hardcoded in UI.
 */
export interface ProductDescription {
  marketing: string
  honest: string
}

export interface Product {
  /** Stable, human-readable identifier. Never reused or reordered. */
  id: string
  name: string
  /** Both description voices; the displayed one is derived from the mode. */
  description: ProductDescription
  /** Price in major currency units (e.g. euros), a positive number. */
  price: number
  category: string
  /** Absolute image URL. See README for the external image dependency note. */
  image: string
  /** Descriptive alt text for the product image. */
  alt: string
}
