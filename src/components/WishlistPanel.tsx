import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { getProductById } from '../data/catalogue'
import { formatPrice } from '../lib/format'
import { useFocusTrap } from '../lib/useFocusTrap'
import {
  selectTotalValue,
  useWishlistStore,
  type WishlistState,
} from '../stores/wishlist'
import { TasteReport } from './TasteReport'
import { WishlistItem } from './WishlistItem'
import styles from './WishlistPanel.module.css'

interface WishlistPanelProps {
  open: boolean
  onClose: () => void
}

/** Stable selector for the wishlist entries (defined once to keep the store
 * subscription referentially stable across renders). */
const selectEntries = (s: WishlistState) => s.entries

/**
 * The wishlist side panel: a modal dialog that overlays the listing.
 *
 * This is the one wishlist component that talks to the store directly — it
 * reads the entries and total value and exposes the increment/decrement/remove
 * actions to the rows. It also owns the dialog's behavioural concerns: focus
 * trapping (via {@link useFocusTrap}), close-on-Escape, locking background
 * scroll while open, and close-on-backdrop-click. It renders either the items
 * plus the taste report, or a dedicated empty state.
 *
 * Returns `null` when closed so there is no hidden dialog in the DOM.
 */
export function WishlistPanel({ open, onClose }: WishlistPanelProps) {
  const entries = useWishlistStore(selectEntries)
  const totalValue = useWishlistStore(selectTotalValue)
  const increment = useWishlistStore((s) => s.increment)
  const decrement = useWishlistStore((s) => s.decrement)
  const remove = useWishlistStore((s) => s.remove)

  const panelRef = useRef<HTMLDivElement>(null)
  // Trap Tab focus within the panel while it's open, and restore it on close.
  useFocusTrap(panelRef, open)

  // Close on Escape. `stopPropagation` keeps the keystroke from bubbling to any
  // other Escape handler on the page. Only active while open; listener is torn
  // down on close/unmount.
  useEffect(() => {
    if (!open) return
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Lock background scroll while the panel is open so the page behind the
  // overlay doesn't scroll, then restore whatever overflow value was there
  // before (not a hardcoded default) when it closes.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  // Resolve each stored entry (id + quantity) against the catalogue, dropping
  // any whose product no longer exists. This is where stale persisted IDs are
  // tolerated: they simply don't render, rather than crashing the panel.
  const resolved = entries.flatMap((entry) => {
    const product = getProductById(entry.productId)
    return product ? [{ product, quantity: entry.quantity }] : []
  })

  const isEmpty = resolved.length === 0

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close wishlist"
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        className={styles.panel}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-title"
        aria-describedby="wishlist-intro"
      >
        <div className={styles.header}>
          <div>
            <h2 id="wishlist-title" className={styles.title}>
              Your questionable taste
            </h2>
            <p id="wishlist-intro" className={styles.intro}>
              A curated collection of things you didn't need before visiting
              this website.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close wishlist"
          >
            <X className={styles.closeIcon} aria-hidden="true" />
          </button>
        </div>

        {isEmpty ? (
          <div className={styles.empty}>
            <h3 className={styles.emptyHeading}>Nothing here.</h3>
            <p className={styles.emptyBody}>
              A rare moment of financial responsibility. Enjoy it while it
              lasts.
            </p>
            <button
              type="button"
              className={styles.browseButton}
              onClick={onClose}
            >
              Back to browsing
            </button>
          </div>
        ) : (
          <>
            <div className={styles.scrollArea}>
              <ul className={styles.list}>
                {resolved.map(({ product, quantity }) => (
                  <WishlistItem
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    onIncrement={increment}
                    onDecrement={decrement}
                    onRemove={remove}
                  />
                ))}
              </ul>

              <TasteReport items={resolved} />
            </div>

            <div className={styles.footer}>
              <p className={styles.totalLabel}>
                Total value of your questionable decisions
              </p>
              <p className={styles.totalValue}>{formatPrice(totalValue)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
