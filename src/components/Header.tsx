import { Heart } from 'lucide-react'
import styles from './Header.module.css'

interface HeaderProps {
  /** Total number of saved units (badge count). */
  wishlistCount: number
  /** Open the wishlist panel. */
  onOpenWishlist: () => void
  /** Ref to the trigger so focus can be restored to it when the panel closes. */
  triggerRef?: React.Ref<HTMLButtonElement>
}

/**
 * The sticky site header: the Bare Minimum™ wordmark, the tagline, and the
 * wishlist trigger with its unit-count badge.
 *
 * Presentational and stateless — the count and the open handler are supplied
 * by the parent. The `triggerRef` is forwarded onto the trigger button so the
 * wishlist panel can restore focus here when it closes (part of the panel's
 * open/close focus-management contract).
 *
 * Accessibility: the numeric badge is decorative (`aria-hidden`); the real
 * count lives in the trigger's accessible name ("Open wishlist, N items"), so
 * the figure is never conveyed by the badge alone. The count is pluralised so
 * it reads naturally for one vs. many.
 */
export function Header({
  wishlistCount,
  onOpenWishlist,
  triggerRef,
}: HeaderProps) {
  // Pluralise so the accessible name reads "1 item" but "3 items".
  const itemWord = wishlistCount === 1 ? 'item' : 'items'
  const triggerLabel = `Open wishlist, ${wishlistCount} ${itemWord}`

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>
            BARE MINIMUM<sup>™</sup>
          </span>
          <span className={styles.tagline}>
            Unreasonably average. Surprisingly expensive.
          </span>
        </div>

        <button
          type="button"
          ref={triggerRef}
          className={styles.trigger}
          onClick={onOpenWishlist}
          aria-label={triggerLabel}
        >
          <span className={styles.triggerIconWrap}>
            <Heart className={styles.triggerIcon} aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {wishlistCount}
              </span>
            )}
          </span>
          <span className={styles.triggerText}>Wishlist</span>
        </button>
      </div>
    </header>
  )
}
