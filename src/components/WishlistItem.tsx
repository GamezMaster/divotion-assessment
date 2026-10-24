import { Minus, Plus, X } from 'lucide-react'
import type { Product } from '../types/product'
import { formatPrice } from '../lib/format'
import { ProductImage } from './ProductImage'
import styles from './WishlistItem.module.css'

interface WishlistItemProps {
  product: Product
  quantity: number
  onIncrement: (productId: string) => void
  onDecrement: (productId: string) => void
  onRemove: (productId: string) => void
}

export function WishlistItem({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: WishlistItemProps) {
  const lineTotal = product.price * quantity
  const decrementLabel =
    quantity === 1
      ? `Decrease quantity of ${product.name}, removing it from your wishlist`
      : `Decrease quantity of ${product.name}`

  return (
    <li className={styles.item}>
      <div className={styles.thumb}>
        <ProductImage src={product.image} alt={product.alt} />
      </div>

      <div className={styles.details}>
        <div className={styles.topRow}>
          <h3 className={styles.name}>{product.name}</h3>
          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.name} from your wishlist`}
          >
            <X className={styles.removeIcon} aria-hidden="true" />
          </button>
        </div>

        <p className={styles.unitPrice}>{formatPrice(product.price)} each</p>

        <div className={styles.controls}>
          <div
            className={styles.quantity}
            role="group"
            aria-label={`Quantity for ${product.name}`}
          >
            <button
              type="button"
              className={styles.qtyButton}
              onClick={() => onDecrement(product.id)}
              aria-label={decrementLabel}
            >
              <Minus className={styles.qtyIcon} aria-hidden="true" />
            </button>
            <span className={styles.qtyValue} aria-live="polite">
              <span className={styles.srOnly}>{product.name} quantity: </span>
              {quantity}
            </span>
            <button
              type="button"
              className={styles.qtyButton}
              onClick={() => onIncrement(product.id)}
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus className={styles.qtyIcon} aria-hidden="true" />
            </button>
          </div>

          <p className={styles.lineTotal}>
            <span className={styles.srOnly}>Line total: </span>
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </li>
  )
}
