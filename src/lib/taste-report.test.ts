import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import {
  generateReport,
  selectPersonality,
  type ResolvedItem,
} from './taste-report'

function product(overrides: Partial<Product>): Product {
  return {
    id: 'p',
    name: 'Product',
    description: { marketing: 'Marketing copy.', honest: 'Honest copy.' },
    price: 10,
    category: 'Misc',
    image: 'https://example.com/p.jpg',
    alt: 'A product',
    ...overrides,
  }
}

function item(overrides: Partial<Product>, quantity = 1): ResolvedItem {
  return { product: product(overrides), quantity }
}

describe('generateReport', () => {
  it('returns null for an empty wishlist', () => {
    expect(generateReport([])).toBeNull()
  })

  it('reports a single product correctly', () => {
    const report = generateReport([
      item({ id: 'mug', name: 'Mug', price: 16.95, category: 'Kitchen' }),
    ])
    expect(report).not.toBeNull()
    expect(report!.totalValue).toBeCloseTo(16.95)
    expect(report!.totalUnits).toBe(1)
    expect(report!.distinctCount).toBe(1)
    expect(report!.mostQuestionable?.productName).toBe('Mug')
  })

  it('accounts for quantities in totals', () => {
    const report = generateReport([
      item({ id: 'a', price: 10 }, 3),
      item({ id: 'b', price: 20 }, 2),
    ])
    expect(report!.totalValue).toBeCloseTo(10 * 3 + 20 * 2)
    expect(report!.totalUnits).toBe(5)
    expect(report!.distinctCount).toBe(2)
  })

  it('picks the highest line value as the most questionable decision', () => {
    // b has higher unit price, but a has higher line value via quantity.
    const report = generateReport([
      item({ id: 'a', name: 'Bulk', price: 30 }, 4), // 120
      item({ id: 'b', name: 'Single', price: 100 }, 1), // 100
    ])
    expect(report!.mostQuestionable?.productId).toBe('a')
    expect(report!.mostQuestionable?.value).toBeCloseTo(120)
  })

  it('uses the honest description as the quip', () => {
    const report = generateReport([
      item({
        id: 'x',
        price: 50,
        description: { marketing: 'Fancy.', honest: 'It is a thing.' },
      }),
    ])
    expect(report!.mostQuestionable?.quip).toBe('It is a thing.')
  })

  it('is deterministic for identical input', () => {
    const items = [
      item({ id: 'a', price: 25, category: 'Stationery' }, 2),
      item({ id: 'b', price: 45, category: 'Wellness' }),
    ]
    expect(generateReport(items)).toEqual(generateReport(items))
  })
})

describe('selectPersonality rules', () => {
  it('assigns The Aspiring Executive for productivity-heavy wishlists', () => {
    const p = selectPersonality([
      item({ id: 'a', category: 'Stationery' }),
      item({ id: 'b', category: 'Furniture' }),
      item({ id: 'c', category: 'Tech' }),
    ])
    expect(p.id).toBe('aspiring-executive')
  })

  it('assigns The Luxury Minimalist for few, expensive comfort items', () => {
    const p = selectPersonality([
      item({ id: 'a', category: 'Audio', price: 199 }),
      item({ id: 'b', category: 'Wellness', price: 80 }),
    ])
    expect(p.id).toBe('luxury-minimalist')
  })

  it('assigns The Indecisive Collector for many varied categories', () => {
    const p = selectPersonality([
      item({ id: 'a', category: 'Kitchen', price: 10 }),
      item({ id: 'b', category: 'Decor', price: 10 }),
      item({ id: 'c', category: 'Apparel', price: 10 }),
      item({ id: 'd', category: 'Hydration', price: 10 }),
    ])
    expect(p.id).toBe('indecisive-collector')
  })

  it('falls back to The Reluctantly Responsible Adult for small practical lists', () => {
    const p = selectPersonality([
      item({ id: 'a', category: 'Kitchen', price: 12 }),
    ])
    expect(p.id).toBe('reluctantly-responsible-adult')
  })

  it('always returns a valid personality (guaranteed fallback)', () => {
    // An unusual combo that matches no earlier rule still resolves.
    const p = selectPersonality([
      item({ id: 'a', category: 'Misc', price: 5 }),
      item({ id: 'b', category: 'Misc', price: 5 }),
    ])
    expect(p.title).toBeTruthy()
    expect(p.blurb).toBeTruthy()
  })
})
