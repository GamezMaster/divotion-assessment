import { Heart } from 'lucide-react'
import type { Product } from '../types/product'
import type { DescriptionMode } from '../stores/mode'
import { formatPrice } from '../lib/format'
import { ProductImage } from './ProductImage'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  /** Which description voice to show. Defaults to marketing. */
  mode?: DescriptionMode
  /** Whether this product is currently in the wishlist. */
  isWishlisted?: boolean
  /** Toggle the product's wishlist membership. Wired to the store in task 03. */
  onToggleWishlist?: (product: Product) => void
}

export function ProductCard({
  product,
  mode = 'marketing',
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  const actionLabel = isWishlisted
    ? `Remove ${product.name} from your wishlist`
    : `Add ${product.name} to your wishlist`
  // Derived, never stored: pick the voice from the current mode.
  const description = product.description[mode]

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <ProductImage src={product.image} alt={product.alt} />
        <button
          type="button"
          className={styles.wishlistButton}
          aria-pressed={isWishlisted}
          aria-label={actionLabel}
          title={actionLabel}
          data-active={isWishlisted}
          onClick={() => onToggleWishlist?.(product)}
        >
          <Heart
            className={styles.wishlistIcon}
            aria-hidden="true"
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}
