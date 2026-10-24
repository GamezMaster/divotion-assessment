import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { products } from '../data/catalogue'
import {
  selectDistinctCount,
  selectIsWishlisted,
  selectTotalUnits,
  selectTotalValue,
  useWishlistStore,
} from './wishlist'

const PRODUCT_A = products[0].id
const PRODUCT_B = products[1].id

function resetStore() {
  useWishlistStore.setState({ entries: [] })
}

beforeEach(() => {
  localStorage.clear()
  resetStore()
})

afterEach(() => {
  localStorage.clear()
})

describe('wishlist store actions', () => {
  it('adds a product with quantity 1', () => {
    useWishlistStore.getState().add(PRODUCT_A)
    expect(useWishlistStore.getState().entries).toEqual([
      { productId: PRODUCT_A, quantity: 1 },
    ])
  })

  it('does not create duplicate entries or change quantity on re-add', () => {
    const store = useWishlistStore.getState()
    store.add(PRODUCT_A)
    store.increment(PRODUCT_A) // quantity now 2
    store.add(PRODUCT_A) // should be a no-op
    const entries = useWishlistStore.getState().entries
    expect(entries).toHaveLength(1)
    expect(entries[0].quantity).toBe(2)
  })

  it('removes an entry', () => {
    const store = useWishlistStore.getState()
    store.add(PRODUCT_A)
    store.add(PRODUCT_B)
    store.remove(PRODUCT_A)
    expect(useWishlistStore.getState().entries).toEqual([
      { productId: PRODUCT_B, quantity: 1 },
    ])
  })

  it('toggles membership', () => {
    const store = useWishlistStore.getState()
    store.toggle(PRODUCT_A)
    expect(selectIsWishlisted(useWishlistStore.getState(), PRODUCT_A)).toBe(
      true,
    )
    store.toggle(PRODUCT_A)
    expect(selectIsWishlisted(useWishlistStore.getState(), PRODUCT_A)).toBe(
      false,
    )
  })

  it('increments quantity, adding the product if absent', () => {
    const store = useWishlistStore.getState()
    store.increment(PRODUCT_A)
    expect(useWishlistStore.getState().entries[0].quantity).toBe(1)
    store.increment(PRODUCT_A)
    expect(useWishlistStore.getState().entries[0].quantity).toBe(2)
  })

  it('decrements quantity and removes the entry at one', () => {
    const store = useWishlistStore.getState()
    store.setQuantity(PRODUCT_A, 2)
    store.add(PRODUCT_A) // ensure present (no-op since setQuantity added nothing)
    useWishlistStore.setState({
      entries: [{ productId: PRODUCT_A, quantity: 2 }],
    })
    store.decrement(PRODUCT_A)
    expect(useWishlistStore.getState().entries[0].quantity).toBe(1)
    store.decrement(PRODUCT_A)
    expect(useWishlistStore.getState().entries).toHaveLength(0)
  })

  it('enforces positive integer quantities via setQuantity', () => {
    const store = useWishlistStore.getState()
    useWishlistStore.setState({
      entries: [{ productId: PRODUCT_A, quantity: 1 }],
    })
    store.setQuantity(PRODUCT_A, 4.8)
    expect(useWishlistStore.getState().entries[0].quantity).toBe(4)
    store.setQuantity(PRODUCT_A, 0)
    expect(useWishlistStore.getState().entries).toHaveLength(0)
  })

  it('clears all entries', () => {
    const store = useWishlistStore.getState()
    store.add(PRODUCT_A)
    store.add(PRODUCT_B)
    store.clear()
    expect(useWishlistStore.getState().entries).toHaveLength(0)
  })
})

describe('wishlist derived selectors', () => {
  it('derives total units from quantities', () => {
    useWishlistStore.setState({
      entries: [
        { productId: PRODUCT_A, quantity: 2 },
        { productId: PRODUCT_B, quantity: 3 },
      ],
    })
    expect(selectTotalUnits(useWishlistStore.getState())).toBe(5)
  })

  it('derives distinct count', () => {
    useWishlistStore.setState({
      entries: [
        { productId: PRODUCT_A, quantity: 2 },
        { productId: PRODUCT_B, quantity: 3 },
      ],
    })
    expect(selectDistinctCount(useWishlistStore.getState())).toBe(2)
  })

  it('derives total value from the catalogue', () => {
    useWishlistStore.setState({
      entries: [
        { productId: PRODUCT_A, quantity: 2 },
        { productId: PRODUCT_B, quantity: 1 },
      ],
    })
    const expected = products[0].price * 2 + products[1].price * 1
    expect(selectTotalValue(useWishlistStore.getState())).toBeCloseTo(expected)
  })

  it('skips stale product IDs when computing total value', () => {
    useWishlistStore.setState({
      entries: [
        { productId: PRODUCT_A, quantity: 1 },
        { productId: 'does-not-exist', quantity: 5 },
      ],
    })
    // Total value ignores the stale ID, but total units still counts it.
    expect(selectTotalValue(useWishlistStore.getState())).toBeCloseTo(
      products[0].price,
    )
    expect(selectTotalUnits(useWishlistStore.getState())).toBe(6)
  })
})
