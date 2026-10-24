import type { Product } from '../types/product'
import type {
  PersonalityId,
  ShoppingPersonality,
  TasteReport,
} from '../types/report'

/** A wishlist entry resolved against the catalogue. */
export interface ResolvedItem {
  product: Product
  quantity: number
}

const PERSONALITIES: Record<PersonalityId, ShoppingPersonality> = {
  'aspiring-executive': {
    id: 'aspiring-executive',
    title: 'The Aspiring Executive',
    blurb:
      'You have the wishlist of someone who schedules meetings about scheduling meetings.',
  },
  'luxury-minimalist': {
    id: 'luxury-minimalist',
    title: 'The Luxury Minimalist',
    blurb:
      'You own almost nothing, and you would like that nothing to be expensive.',
  },
  'indecisive-collector': {
    id: 'indecisive-collector',
    title: 'The Indecisive Collector',
    blurb:
      'A little of everything, a commitment to nothing. Variety is your entire personality.',
  },
  'reluctantly-responsible-adult': {
    id: 'reluctantly-responsible-adult',
    title: 'The Reluctantly Responsible Adult',
    blurb:
      'A small, sensible selection. Somewhere, a budgeting app is quietly proud of you.',
  },
}

/** Categories we treat as "productivity / work" signals. */
const PRODUCTIVITY_CATEGORIES = new Set(['Stationery', 'Furniture', 'Tech'])
/** Categories we treat as "comfort / lifestyle" signals. */
const LUXURY_CATEGORIES = new Set(['Wellness', 'Audio', 'Apparel', 'Decor'])

const AVERAGE_LUXURY_THRESHOLD = 60

/**
 * Pick a shopping personality from explicit, deterministic rules. Rules are
 * evaluated in priority order and the final branch is an unconditional
 * fallback, so every possible non-empty wishlist resolves to a profile.
 */
export function selectPersonality(items: ResolvedItem[]): ShoppingPersonality {
  const distinct = items.length
  const categories = new Set(items.map((i) => i.product.category))

  const productivityCount = items.filter((i) =>
    PRODUCTIVITY_CATEGORIES.has(i.product.category),
  ).length
  const luxuryCount = items.filter((i) =>
    LUXURY_CATEGORIES.has(i.product.category),
  ).length

  const totalValue = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  )
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0)
  const averagePerUnit = totalUnits > 0 ? totalValue / totalUnits : 0

  // 1. Mostly productivity/work items -> Aspiring Executive.
  if (productivityCount >= 2 && productivityCount >= luxuryCount) {
    return PERSONALITIES['aspiring-executive']
  }

  // 2. Few items but expensive, comfort-leaning -> Luxury Minimalist.
  if (
    distinct <= 3 &&
    averagePerUnit >= AVERAGE_LUXURY_THRESHOLD &&
    luxuryCount >= 1
  ) {
    return PERSONALITIES['luxury-minimalist']
  }

  // 3. Lots of unrelated categories -> Indecisive Collector.
  if (distinct >= 4 && categories.size >= 4) {
    return PERSONALITIES['indecisive-collector']
  }

  // 4. Small, practical wishlist -> Reluctantly Responsible Adult.
  //    Also the guaranteed fallback for anything the rules above missed.
  return PERSONALITIES['reluctantly-responsible-adult']
}

/** Build the sarcastic verdict from the report figures. */
function buildVerdict(totalValue: number, distinct: number): string {
  if (totalValue >= 500) {
    return 'Your taste is expensive. Your commitment to buying things remains theoretical.'
  }
  if (distinct >= 5) {
    return 'An ambitious collection of intentions. Following through is, as ever, optional.'
  }
  return 'Restrained, almost responsible. We respect it. We also expected more.'
}

/**
 * Generate the full taste report from resolved wishlist items. Returns `null`
 * for an empty wishlist so the UI can show a dedicated empty state. Pure and
 * deterministic: identical input always produces identical output.
 */
export function generateReport(items: ResolvedItem[]): TasteReport | null {
  if (items.length === 0) return null

  const totalValue = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  )
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0)
  const distinctCount = items.length

  // Most questionable = highest line value. Ties resolve to the first item,
  // keeping output deterministic for a given ordering.
  const priciest = items.reduce((best, current) => {
    const currentValue = current.product.price * current.quantity
    const bestValue = best.product.price * best.quantity
    return currentValue > bestValue ? current : best
  })

  const personality = selectPersonality(items)

  return {
    totalValue,
    totalUnits,
    distinctCount,
    personality,
    mostQuestionable: {
      productId: priciest.product.id,
      productName: priciest.product.name,
      value: priciest.product.price * priciest.quantity,
      // Reuse the product's own honest voice — on-brand and already written.
      quip: priciest.product.description.honest,
    },
    verdict: buildVerdict(totalValue, distinctCount),
  }
}
