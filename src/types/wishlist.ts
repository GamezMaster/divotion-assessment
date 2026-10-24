/**
 * A single wishlist entry. The wishlist stores only a product ID and quantity;
 * product details are resolved from the catalogue at render time so there is no
 * duplicated or stale product data in persisted state.
 */
export interface WishlistEntry {
  productId: string
  /** Always a positive integer (>= 1). Enforced by the store. */
  quantity: number
}
