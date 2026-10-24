import type { WishlistEntry } from '../types/wishlist'

/**
 * Coerce an unknown value into a valid positive-integer quantity, or `null`
 * if it cannot be salvaged. Floors floats, rejects zero/negative/NaN.
 */
export function normalizeQuantity(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  const floored = Math.floor(value)
  return floored >= 1 ? floored : null
}

/**
 * Validate and normalize a list of persisted wishlist entries. Persisted data
 * is untrusted: this tolerates malformed JSON shapes, invalid quantities, and
 * duplicate product IDs. Stale product IDs are intentionally NOT filtered here
 * (the catalogue may change independently); they are resolved and skipped at
 * render/derivation time instead.
 *
 * - Non-array input yields an empty list.
 * - Entries without a string `productId` are dropped.
 * - Invalid quantities are dropped (not silently reset to a magic number).
 * - Duplicate product IDs are merged, keeping the first valid quantity.
 */
export function sanitizeEntries(value: unknown): WishlistEntry[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  const result: WishlistEntry[] = []

  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue
    const candidate = raw as Record<string, unknown>

    const productId = candidate.productId
    if (typeof productId !== 'string' || productId.length === 0) continue
    if (seen.has(productId)) continue

    const quantity = normalizeQuantity(candidate.quantity)
    if (quantity === null) continue

    seen.add(productId)
    result.push({ productId, quantity })
  }

  return result
}
