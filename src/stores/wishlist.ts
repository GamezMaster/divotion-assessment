import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { WishlistEntry } from '../types/wishlist'
import { getProductById } from '../data/catalogue'
import { createSafeStorage } from '../lib/safeStorage'
import { normalizeQuantity, sanitizeEntries } from '../lib/wishlist-validation'

/**
 * Storage that never throws. If `localStorage` is unavailable or throws, reads
 * return null and writes are dropped, so the wishlist still works in-memory for
 * the current session.
 */
const safeStorage = createSafeStorage(() =>
  typeof localStorage !== 'undefined' ? localStorage : undefined,
)

const STORAGE_KEY = 'bare-minimum:wishlist'

export interface WishlistState {
  entries: WishlistEntry[]
  /**
   * Add a product to the wishlist. If it is already present, its quantity is
   * left unchanged (adding from the listing is a membership toggle, not a
   * quantity bump). No-op if the quantity argument is invalid.
   */
  add: (productId: string) => void
  /** Remove a product's entry entirely. */
  remove: (productId: string) => void
  /** Toggle membership: remove if present, otherwise add with quantity 1. */
  toggle: (productId: string) => void
  /**
   * Set an exact quantity. Values are floored to positive integers; a value
   * below 1 removes the entry.
   */
  setQuantity: (productId: string, quantity: number) => void
  /** Increase a product's quantity by one (adds it if not present). */
  increment: (productId: string) => void
  /**
   * Decrease a product's quantity by one. Decrementing from one removes the
   * entry (the UI communicates this).
   */
  decrement: (productId: string) => void
  /** Remove all entries. */
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      entries: [],

      add: (productId) =>
        set((state) => {
          if (state.entries.some((e) => e.productId === productId)) {
            return state
          }
          return { entries: [...state.entries, { productId, quantity: 1 }] }
        }),

      remove: (productId) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.productId !== productId),
        })),

      toggle: (productId) =>
        set((state) => {
          if (state.entries.some((e) => e.productId === productId)) {
            return {
              entries: state.entries.filter((e) => e.productId !== productId),
            }
          }
          return { entries: [...state.entries, { productId, quantity: 1 }] }
        }),

      setQuantity: (productId, quantity) =>
        set((state) => {
          const normalized = normalizeQuantity(quantity)
          if (normalized === null) {
            // Below 1 / invalid -> remove the entry.
            return {
              entries: state.entries.filter((e) => e.productId !== productId),
            }
          }
          return {
            entries: state.entries.map((e) =>
              e.productId === productId ? { ...e, quantity: normalized } : e,
            ),
          }
        }),

      increment: (productId) =>
        set((state) => {
          const existing = state.entries.find((e) => e.productId === productId)
          if (!existing) {
            return { entries: [...state.entries, { productId, quantity: 1 }] }
          }
          return {
            entries: state.entries.map((e) =>
              e.productId === productId
                ? { ...e, quantity: e.quantity + 1 }
                : e,
            ),
          }
        }),

      decrement: (productId) =>
        set((state) => {
          const existing = state.entries.find((e) => e.productId === productId)
          if (!existing) return state
          if (existing.quantity <= 1) {
            return {
              entries: state.entries.filter((e) => e.productId !== productId),
            }
          }
          return {
            entries: state.entries.map((e) =>
              e.productId === productId
                ? { ...e, quantity: e.quantity - 1 }
                : e,
            ),
          }
        }),

      clear: () => set({ entries: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      // Persist only the entries; everything else is behaviour.
      partialize: (state) => ({ entries: state.entries }),
      // Persisted data is untrusted: sanitize whatever we read back.
      merge: (persisted, current) => {
        const raw = (persisted as { entries?: unknown } | undefined)?.entries
        return { ...current, entries: sanitizeEntries(raw) }
      },
    },
  ),
)

// ---------------------------------------------------------------------------
// Derived selectors. Totals are computed from current state and the catalogue,
// never persisted. Stale product IDs (no longer in the catalogue) are skipped.
// ---------------------------------------------------------------------------

/** Total number of units across all wishlist entries (the badge count). */
export function selectTotalUnits(state: WishlistState): number {
  return state.entries.reduce((sum, e) => sum + e.quantity, 0)
}

/** Total monetary value, resolving prices from the catalogue. */
export function selectTotalValue(state: WishlistState): number {
  return state.entries.reduce((sum, e) => {
    const product = getProductById(e.productId)
    return product ? sum + product.price * e.quantity : sum
  }, 0)
}

/** Number of distinct products in the wishlist. */
export function selectDistinctCount(state: WishlistState): number {
  return state.entries.length
}

/** Whether a given product is currently in the wishlist. */
export function selectIsWishlisted(
  state: WishlistState,
  productId: string,
): boolean {
  return state.entries.some((e) => e.productId === productId)
}
