import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { products } from './data/catalogue'
import { useWishlistStore } from './stores/wishlist'

const PRODUCT = products[0]

/**
 * Simulate a hostile localStorage (e.g. Safari private mode / security policy)
 * where every access throws. The app must stay usable for the session.
 */
function makeThrowingStorage() {
  return {
    getItem: () => {
      throw new Error('SecurityError')
    },
    setItem: () => {
      throw new Error('SecurityError')
    },
    removeItem: () => {
      throw new Error('SecurityError')
    },
    clear: () => {
      throw new Error('SecurityError')
    },
    key: () => {
      throw new Error('SecurityError')
    },
    length: 0,
  } as unknown as Storage
}

let originalLocalStorage: PropertyDescriptor | undefined

beforeEach(() => {
  originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: makeThrowingStorage(),
  })
  useWishlistStore.setState({ entries: [] })
})

afterEach(() => {
  if (originalLocalStorage) {
    Object.defineProperty(window, 'localStorage', originalLocalStorage)
  }
  useWishlistStore.setState({ entries: [] })
})

describe('resilience when localStorage is unavailable', () => {
  async function renderApp() {
    // Mount and flush the async store rehydrate (which runs on mount) inside
    // a single act(). Zustand finishes hydration on a microtask after
    // rehydrate() resolves, so drain the microtask queue too — otherwise that
    // trailing setState fires outside act and warns.
    await act(async () => {
      render(<App />)
      await useWishlistStore.persist.rehydrate()
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  it('renders the app without crashing', async () => {
    await renderApp()
    expect(
      screen.getByRole('heading', { name: /finally\. products\./i }),
    ).toBeInTheDocument()
  })

  it('still allows wishlisting in-memory for the session', async () => {
    await renderApp()
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name} to your wishlist`, 'i'),
      }),
    )
    // The in-memory store updates even though persistence is impossible.
    expect(useWishlistStore.getState().entries).toEqual([
      { productId: PRODUCT.id, quantity: 1 },
    ])
    expect(
      screen.getByRole('button', { name: /open wishlist, 1 item/i }),
    ).toBeInTheDocument()
  })
})
