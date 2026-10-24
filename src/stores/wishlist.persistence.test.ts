import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useWishlistStore } from './wishlist'

const STORAGE_KEY = 'bare-minimum:wishlist'

function writePersisted(entries: unknown) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ state: { entries }, version: 0 }),
  )
}

beforeEach(() => {
  localStorage.clear()
  useWishlistStore.setState({ entries: [] })
})

afterEach(() => {
  localStorage.clear()
})

describe('wishlist persistence', () => {
  it('restores valid persisted entries on rehydrate', async () => {
    writePersisted([
      { productId: 'premium-socks', quantity: 3 },
      { productId: 'luxury-notebook', quantity: 1 },
    ])

    await useWishlistStore.persist.rehydrate()

    expect(useWishlistStore.getState().entries).toEqual([
      { productId: 'premium-socks', quantity: 3 },
      { productId: 'luxury-notebook', quantity: 1 },
    ])
  })

  it('tolerates malformed persisted data without crashing', async () => {
    writePersisted([
      { productId: 'premium-socks', quantity: 2 },
      { productId: 42, quantity: 1 },
      { productId: 'bad-qty', quantity: -5 },
      'garbage',
      null,
    ])

    await useWishlistStore.persist.rehydrate()

    expect(useWishlistStore.getState().entries).toEqual([
      { productId: 'premium-socks', quantity: 2 },
    ])
  })

  it('tolerates a corrupt (non-array) entries value', async () => {
    writePersisted('not-an-array')

    await useWishlistStore.persist.rehydrate()

    expect(useWishlistStore.getState().entries).toEqual([])
  })

  it('tolerates completely invalid JSON in storage', async () => {
    localStorage.setItem(STORAGE_KEY, '{ this is not valid json')

    await expect(useWishlistStore.persist.rehydrate()).resolves.not.toThrow()
    expect(Array.isArray(useWishlistStore.getState().entries)).toBe(true)
  })

  it('persists changes back to localStorage', async () => {
    useWishlistStore.getState().add('premium-socks')

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    expect(stored).toContain('premium-socks')
  })
})
