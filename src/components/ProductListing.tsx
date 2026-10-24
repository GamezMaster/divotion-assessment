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
  /** Toggle a product's wishlist membership. Wired to the store in task 03. */
  onToggleWishlist?: (product: Product) => void
}

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
