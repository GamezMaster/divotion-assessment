import { describe, expect, it } from 'vitest'
import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats a price as EUR currency', () => {
    const result = formatPrice(39.95)
    expect(result).toContain('39.95')
    // The EUR symbol is used regardless of locale spacing specifics.
    expect(result).toMatch(/€/)
  })

  it('always shows two decimal places', () => {
    expect(formatPrice(20)).toContain('20.00')
  })

  it('formats large prices consistently', () => {
    const result = formatPrice(499.95)
    expect(result).toContain('499.95')
  })
})
