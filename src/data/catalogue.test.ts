import { describe, expect, it } from 'vitest'
import { getProductById, products } from './catalogue'

describe('catalogue', () => {
  it('contains a coherent set of 8-12 products', () => {
    expect(products.length).toBeGreaterThanOrEqual(8)
    expect(products.length).toBeLessThanOrEqual(12)
  })

  it('has stable, unique product IDs', () => {
    const ids = products.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has valid data for every product', () => {
    for (const product of products) {
      expect(product.id).toBeTruthy()
      expect(product.name).toBeTruthy()
      expect(product.description.marketing).toBeTruthy()
      expect(product.description.honest).toBeTruthy()
      expect(product.price).toBeGreaterThan(0)
      expect(product.image).toMatch(/^https?:\/\//)
      expect(product.alt).toBeTruthy()
    }
  })

  it('resolves products by ID', () => {
    const first = products[0]
    expect(getProductById(first.id)).toEqual(first)
  })

  it('returns undefined for unknown IDs', () => {
    expect(getProductById('does-not-exist')).toBeUndefined()
  })
})
