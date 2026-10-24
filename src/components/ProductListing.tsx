import type { Product } from '../types/product'
import type { DescriptionMode } from '../stores/mode'
import { products } from '../data/catalogue'
import { ProductCard } from './ProductCard'
import styles from './ProductListing.module.css'

interface ProductListingProps {
  /** Which description voice to show. Defaults to marketing. */
  mode?: DescriptionMode
  /** Predicate for whether a product is currently wishlisted. */
  isWishlisted?: (id: string) => boolean
  /** Toggle a product's wishlist membership. */
  onToggleWishlist?: (product: Product) => void
}

/**
 * Renders the full catalogue as a responsive grid of {@link ProductCard}s.
 *
 * It reads the catalogue directly (the single source of truth) and maps each
 * product to a card, threading the current description `mode` and wishlist
 * callbacks straight through. It holds no state of its own — membership and
 * toggling are delegated to the props so the parent stays in control.
 *
 * The grid is a semantic `<ul>`/`<li>` with an accessible name so assistive
 * tech announces it as the product list.
 */
export function ProductListing({
  mode = 'marketing',
  isWishlisted,
  onToggleWishlist,
}: ProductListingProps) {
  return (
    <ul className={styles.grid} aria-label="Product catalogue">
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard
            product={product}
            mode={mode}
            isWishlisted={isWishlisted?.(product.id) ?? false}
            onToggleWishlist={onToggleWishlist}
          />
        </li>
      ))}
    </ul>
  )
}
