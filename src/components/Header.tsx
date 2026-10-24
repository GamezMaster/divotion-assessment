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

export function Header({
  wishlistCount,
  onOpenWishlist,
  triggerRef,
}: HeaderProps) {
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
