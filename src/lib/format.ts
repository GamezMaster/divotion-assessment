/** Locale and currency used for all price display across the store. */
const PRICE_LOCALE = 'en-NL'
const PRICE_CURRENCY = 'EUR'

const priceFormatter = new Intl.NumberFormat(PRICE_LOCALE, {
  style: 'currency',
  currency: PRICE_CURRENCY,
})

/** Format a numeric price as a currency string, e.g. `€39.95`. */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount)
}
