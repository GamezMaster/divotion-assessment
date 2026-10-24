import { useRef, useState } from 'react'
import { Header } from './components/Header'
import { ModeToggle } from './components/ModeToggle'
import { ProductListing } from './components/ProductListing'
import { WishlistPanel } from './components/WishlistPanel'
import type { Product } from './types/product'
import { useModeStore } from './stores/mode'
import { selectTotalUnits, useWishlistStore } from './stores/wishlist'
import './App.css'

/**
 * Application root and the one place that composes the stores with the UI.
 *
 * It subscribes to the wishlist and description-mode stores, owns the small
 * amount of purely-local UI state (whether the panel is open, the latest
 * status message, and a ref to the panel trigger), and wires everything
 * together: the header, the mode toggle, the listing, and the wishlist panel.
 * Every child below is presentational and receives state + callbacks from here.
 */
function App() {
  // Wishlist store: the toggle action, the raw entries (to derive membership),
  // and the total unit count for the header badge.
  const toggle = useWishlistStore((s) => s.toggle)
  const entries = useWishlistStore((s) => s.entries)
  const totalUnits = useWishlistStore(selectTotalUnits)
  // Membership lookup used by the listing to light up the right hearts.
  const isWishlisted = (id: string) => entries.some((e) => e.productId === id)

  // Description-mode store: the current voice and its setter for the toggle.
  const mode = useModeStore((s) => s.mode)
  const setMode = useModeStore((s) => s.setMode)

  // Local UI state only — not shared, so it stays in component state.
  const [panelOpen, setPanelOpen] = useState(false)
  const [status, setStatus] = useState('')
  // Handed to the header's trigger so the panel can restore focus on close.
  const triggerRef = useRef<HTMLButtonElement>(null)

  /**
   * Toggle a product's wishlist membership and announce the result.
   *
   * We read membership *before* toggling so the status message describes what
   * just happened, then push the matching on-brand line into the polite
   * `aria-live` region below. A single live region (rather than a toast per
   * action) keeps screen-reader feedback informative without being noisy.
   */
  const handleToggle = (product: Product) => {
    const wasWishlisted = isWishlisted(product.id)
    toggle(product.id)
    setStatus(
      wasWishlisted
        ? 'We\u2019ve removed it. Your life remains unchanged.'
        : 'Excellent choice. Your bank account disagrees.',
    )
  }

  return (
    <div className="app">
      <Header
        wishlistCount={totalUnits}
        onOpenWishlist={() => setPanelOpen(true)}
        triggerRef={triggerRef}
      />

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="hero__heading">
            Finally. Products.
          </h1>
          <p className="hero__body">
            No life-changing innovations. No revolutionary breakthroughs. Just
            ordinary things, marketed with extraordinary confidence.
          </p>
        </section>

        <section className="catalogue" aria-label="Products">
          <div className="catalogue__controls">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
          <ProductListing
            mode={mode}
            isWishlisted={isWishlisted}
            onToggleWishlist={handleToggle}
          />
        </section>
      </main>

      <footer className="site-footer">
        <p>We could do better. But then we'd have to charge more.</p>
      </footer>

      <WishlistPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      <div className="sr-only" role="status" aria-live="polite">
        {status}
      </div>
    </div>
  )
}

export default App
