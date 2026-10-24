import { describe, expect, it } from 'vitest'
import { normalizeQuantity, sanitizeEntries } from './wishlist-validation'

describe('normalizeQuantity', () => {
  it('accepts positive integers', () => {
    expect(normalizeQuantity(1)).toBe(1)
    expect(normalizeQuantity(5)).toBe(5)
  })

  it('floors floats to integers', () => {
    expect(normalizeQuantity(2.9)).toBe(2)
  })

  it('rejects zero, negatives and non-finite numbers', () => {
    expect(normalizeQuantity(0)).toBeNull()
    expect(normalizeQuantity(-3)).toBeNull()
    expect(normalizeQuantity(Number.NaN)).toBeNull()
    expect(normalizeQuantity(Number.POSITIVE_INFINITY)).toBeNull()
  })

  it('rejects non-number values', () => {
    expect(normalizeQuantity('2')).toBeNull()
    expect(normalizeQuantity(null)).toBeNull()
    expect(normalizeQuantity(undefined)).toBeNull()
  })
})

describe('sanitizeEntries', () => {
  it('returns an empty list for non-array input', () => {
    expect(sanitizeEntries(null)).toEqual([])
    expect(sanitizeEntries('nonsense')).toEqual([])
    expect(sanitizeEntries({ productId: 'x', quantity: 1 })).toEqual([])
    expect(sanitizeEntries(undefined)).toEqual([])
  })

  it('keeps valid entries', () => {
    expect(
      sanitizeEntries([
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 1 },
      ]),
    ).toEqual([
      { productId: 'a', quantity: 2 },
      { productId: 'b', quantity: 1 },
    ])
  })

  it('drops entries with invalid shapes', () => {
    expect(
      sanitizeEntries([
        { productId: 'a', quantity: 1 },
        { productId: 123, quantity: 1 },
        { quantity: 1 },
        null,
        'garbage',
        { productId: '', quantity: 1 },
      ]),
    ).toEqual([{ productId: 'a', quantity: 1 }])
  })

  it('drops entries with invalid quantities', () => {
    expect(
      sanitizeEntries([
        { productId: 'a', quantity: 0 },
        { productId: 'b', quantity: -1 },
        { productId: 'c', quantity: 'two' },
        { productId: 'd', quantity: 3 },
      ]),
    ).toEqual([{ productId: 'd', quantity: 3 }])
  })

  it('merges duplicate product IDs keeping the first valid quantity', () => {
    expect(
      sanitizeEntries([
        { productId: 'a', quantity: 2 },
        { productId: 'a', quantity: 9 },
      ]),
    ).toEqual([{ productId: 'a', quantity: 2 }])
  })

  it('floors float quantities', () => {
    expect(sanitizeEntries([{ productId: 'a', quantity: 2.7 }])).toEqual([
      { productId: 'a', quantity: 2 },
    ])
  })
})
