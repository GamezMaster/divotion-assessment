import { useRef, useState } from 'react'
import { Header } from './components/Header'
import { ModeToggle } from './components/ModeToggle'
import { ProductListing } from './components/ProductListing'
import { WishlistPanel } from './components/WishlistPanel'
import type { Product } from './types/product'
import { useModeStore } from './stores/mode'
import { selectTotalUnits, useWishlistStore } from './stores/wishlist'
import './App.css'

function App() {
  const toggle = useWishlistStore((s) => s.toggle)
  const entries = useWishlistStore((s) => s.entries)
  const totalUnits = useWishlistStore(selectTotalUnits)
  const isWishlisted = (id: string) => entries.some((e) => e.productId === id)

  const mode = useModeStore((s) => s.mode)
  const setMode = useModeStore((s) => s.setMode)

  const [panelOpen, setPanelOpen] = useState(false)
  const [status, setStatus] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)

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
