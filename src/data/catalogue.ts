import type { Product } from '../types/product'
import productsJson from './products.json'

/**
 * The product catalogue, loaded once from local JSON. This is the single
 * source of truth for product details; components and the wishlist resolve
 * products from here rather than duplicating catalogue data.
 */
export const products: readonly Product[] = productsJson

const productsById = new Map<string, Product>(products.map((p) => [p.id, p]))

/** Resolve a product by its stable ID, or `undefined` if it no longer exists. */
export function getProductById(id: string): Product | undefined {
  return productsById.get(id)
}
