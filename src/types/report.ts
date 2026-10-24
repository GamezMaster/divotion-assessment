/** The identifiers for every possible shopping personality profile. */
export type PersonalityId =
  | 'aspiring-executive'
  | 'luxury-minimalist'
  | 'indecisive-collector'
  | 'reluctantly-responsible-adult'

/** A shopping-personality profile: a title plus a dry one-line characterisation. */
export interface ShoppingPersonality {
  id: PersonalityId
  title: string
  blurb: string
}

/** The "most questionable decision" — the priciest wishlisted product. */
export interface QuestionableDecision {
  productId: string
  productName: string
  /** Line value: unit price × quantity. */
  value: number
  /** Sarcastic one-liner about this choice. */
  quip: string
}

/**
 * A fully derived taste report. Everything here is computed from the current
 * wishlist + catalogue; nothing is persisted or randomised, so the same
 * wishlist always yields the same report.
 */
export interface TasteReport {
  /** Total value across all entries, accounting for quantities. */
  totalValue: number
  /** Total number of units saved. */
  totalUnits: number
  /** Number of distinct products saved. */
  distinctCount: number
  personality: ShoppingPersonality
  /** The priciest decision, or null when the wishlist is empty. */
  mostQuestionable: QuestionableDecision | null
  /** Short closing verdict. */
  verdict: string
}
