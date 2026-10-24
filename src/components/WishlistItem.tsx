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

/**
 * One row inside the wishlist panel: thumbnail, name, unit price, a quantity
 * stepper, the line total, and a remove button.
 *
 * Presentational and stateless — quantity and the mutation callbacks come from
 * the panel, which owns the store wiring. The line total is derived on each
 * render from price × quantity rather than stored.
 *
 * Accessibility notes:
 * - The stepper is a labelled `role="group"` ("Quantity for <name>") so the
 *   two buttons read as a unit tied to the product.
 * - At quantity 1 the decrement button's accessible name explicitly says it
 *   will remove the item, so it never collides with the dedicated remove
 *   button (two controls, distinct names, distinct outcomes).
 * - Visually-hidden ("srOnly") prefixes give the quantity value and the line
 *   total meaningful context for screen readers; the live region announces
 *   quantity changes politely.
 */
export function WishlistItem({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: WishlistItemProps) {
  // Derived per render — never persisted as a mutable total.
  const lineTotal = product.price * quantity
  // At one, decrementing removes the item; say so in the accessible name.
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
