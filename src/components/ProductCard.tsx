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
  /** Toggle the product's wishlist membership. */
  onToggleWishlist?: (product: Product) => void
}

/**
 * A single product tile in the listing grid.
 *
 * Presentational and stateless: it renders the product's image, category,
 * name, the mode-appropriate description, and formatted price, plus a
 * wishlist toggle button overlaid on the image. All state (whether the product
 * is wishlisted, which description voice to show) is passed in by the parent,
 * and user intent is reported back via `onToggleWishlist` — the card itself
 * owns no state and never touches the store directly.
 *
 * Accessibility: the toggle button carries an explicit, product-specific
 * accessible name ("Add/Remove <name> …") and `aria-pressed` so screen readers
 * announce both what it does and whether it's currently selected; the filled
 * vs. outlined heart conveys the same selected state without relying on colour.
 */
export function ProductCard({
  product,
  mode = 'marketing',
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  // The button's accessible name flips with state so AT users hear the action
  // the click will perform, not just the current status.
  const actionLabel = isWishlisted
    ? `Remove ${product.name} from your wishlist`
    : `Add ${product.name} to your wishlist`
  // Derived, never stored: pick the voice from the current mode so the
  // displayed copy always reflects the live toggle and product data.
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
