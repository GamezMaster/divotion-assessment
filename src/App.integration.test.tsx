import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { products } from './data/catalogue'
import { useWishlistStore } from './stores/wishlist'

const PRODUCT = products[0]

beforeEach(() => {
  localStorage.clear()
  useWishlistStore.setState({ entries: [] })
})

afterEach(() => {
  localStorage.clear()
})

function openWishlist() {
  return userEvent.click(screen.getByRole('button', { name: /open wishlist/i }))
}

describe('wishlist header + panel integration', () => {
  it('shows no badge count in the trigger name when empty', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /open wishlist, 0 items/i }),
    ).toBeInTheDocument()
  })

  it('updates the trigger count as items are added', async () => {
    render(<App />)
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name} to your wishlist`, 'i'),
      }),
    )
    expect(
      screen.getByRole('button', { name: /open wishlist, 1 item/i }),
    ).toBeInTheDocument()
  })

  it('opens the panel as a dialog and moves focus into it', async () => {
    render(<App />)
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name}`, 'i'),
      }),
    )
    await openWishlist()

    const dialog = screen.getByRole('dialog', {
      name: /your questionable taste/i,
    })
    expect(dialog).toBeInTheDocument()
    // Focus has moved into the panel.
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    render(<App />)
    await openWishlist()
    expect(
      screen.getByRole('dialog', { name: /your questionable taste/i }),
    ).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    expect(
      screen.queryByRole('dialog', { name: /your questionable taste/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open wishlist/i })).toHaveFocus()
  })

  it('closes when the close button is used', async () => {
    render(<App />)
    await openWishlist()
    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: /close wishlist/i }),
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the empty state with a return-to-browsing action', async () => {
    render(<App />)
    await openWishlist()
    expect(
      screen.getByRole('heading', { name: /nothing here\./i }),
    ).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: /back to browsing/i }),
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('supports the add -> open -> change quantity flow with derived totals', async () => {
    render(<App />)
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name}`, 'i'),
      }),
    )
    await openWishlist()

    const dialog = screen.getByRole('dialog')
    // Increase quantity to 3.
    const increase = within(dialog).getByRole('button', {
      name: new RegExp(`increase quantity of ${PRODUCT.name}`, 'i'),
    })
    await userEvent.click(increase)
    await userEvent.click(increase)

    // Badge now reflects total units = 3.
    expect(
      screen.getByRole('button', { name: /open wishlist, 3 items/i }),
    ).toBeInTheDocument()

    // Store holds the expected quantity.
    expect(useWishlistStore.getState().entries).toEqual([
      { productId: PRODUCT.id, quantity: 3 },
    ])
  })

  it('removes an item by decrementing from one', async () => {
    render(<App />)
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name}`, 'i'),
      }),
    )
    await openWishlist()

    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', {
        name: new RegExp(`remove ${PRODUCT.name} from your wishlist`, 'i'),
      }),
    )

    expect(useWishlistStore.getState().entries).toHaveLength(0)
    expect(
      screen.getByRole('heading', { name: /nothing here\./i }),
    ).toBeInTheDocument()
  })

  it('announces add and remove feedback politely', async () => {
    render(<App />)
    const status = screen.getByRole('status')
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name}`, 'i'),
      }),
    )
    expect(status).toHaveTextContent(/excellent choice/i)
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`remove ${PRODUCT.name} from your wishlist`, 'i'),
      }),
    )
    expect(status).toHaveTextContent(/your life remains unchanged/i)
  })
})
