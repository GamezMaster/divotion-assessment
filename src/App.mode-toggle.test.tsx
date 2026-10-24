import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { products } from './data/catalogue'
import { useModeStore } from './stores/mode'
import { useWishlistStore } from './stores/wishlist'

const PRODUCT = products[0]

beforeEach(() => {
  localStorage.clear()
  useModeStore.setState({ mode: 'marketing' })
  useWishlistStore.setState({ entries: [] })
})

afterEach(() => {
  localStorage.clear()
})

function getModeRadio(name: RegExp) {
  return screen.getByRole('radio', { name })
}

describe('Honesty Toggle', () => {
  it('defaults to Marketing Mode and shows marketing descriptions', () => {
    render(<App />)
    expect(getModeRadio(/marketing mode/i)).toBeChecked()
    expect(getModeRadio(/honesty mode/i)).not.toBeChecked()

    // Every product shows its marketing copy.
    for (const product of products) {
      expect(
        screen.getByText(product.description.marketing),
      ).toBeInTheDocument()
    }
  })

  it('switches every description to honest copy in Honesty Mode', async () => {
    render(<App />)
    await userEvent.click(getModeRadio(/honesty mode/i))

    expect(getModeRadio(/honesty mode/i)).toBeChecked()
    for (const product of products) {
      expect(screen.getByText(product.description.honest)).toBeInTheDocument()
    }
    // Marketing copy is no longer shown.
    expect(
      screen.queryByText(PRODUCT.description.marketing),
    ).not.toBeInTheDocument()
  })

  it('restores marketing descriptions when switched back', async () => {
    render(<App />)
    await userEvent.click(getModeRadio(/honesty mode/i))
    await userEvent.click(getModeRadio(/marketing mode/i))

    expect(getModeRadio(/marketing mode/i)).toBeChecked()
    expect(screen.getByText(PRODUCT.description.marketing)).toBeInTheDocument()
    expect(
      screen.queryByText(PRODUCT.description.honest),
    ).not.toBeInTheDocument()
  })

  it('leaves name, price, image and wishlist control intact across modes', async () => {
    render(<App />)
    const nameBefore = screen.getByRole('heading', { name: PRODUCT.name })
    const imageBefore = screen.getByAltText(PRODUCT.alt)
    expect(nameBefore).toBeInTheDocument()
    expect(imageBefore).toHaveAttribute('src', PRODUCT.image)
    expect(screen.getAllByText(/€16\.95/).length).toBeGreaterThan(0)

    await userEvent.click(getModeRadio(/honesty mode/i))

    expect(
      screen.getByRole('heading', { name: PRODUCT.name }),
    ).toBeInTheDocument()
    expect(screen.getByAltText(PRODUCT.alt)).toHaveAttribute(
      'src',
      PRODUCT.image,
    )
    expect(screen.getAllByText(/€16\.95/).length).toBeGreaterThan(0)
    expect(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name} to your wishlist`, 'i'),
      }),
    ).toBeInTheDocument()
  })

  it('does not reset wishlist contents or quantities on a mode change', async () => {
    render(<App />)
    // Add a product and bump its quantity via the panel.
    await userEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`add ${PRODUCT.name} to your wishlist`, 'i'),
      }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: /open wishlist/i }),
    )
    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', {
        name: new RegExp(`increase quantity of ${PRODUCT.name}`, 'i'),
      }),
    )
    await userEvent.click(
      within(dialog).getByRole('button', { name: /close wishlist/i }),
    )

    // Switch modes.
    await userEvent.click(getModeRadio(/honesty mode/i))

    // Wishlist is untouched.
    expect(useWishlistStore.getState().entries).toEqual([
      { productId: PRODUCT.id, quantity: 2 },
    ])
    expect(
      screen.getByRole('button', { name: /open wishlist, 2 items/i }),
    ).toBeInTheDocument()
  })

  it('exposes the toggle as an accessible radiogroup', () => {
    render(<App />)
    const group = screen.getByRole('radiogroup', {
      name: /choose your reality/i,
    })
    expect(group).toBeInTheDocument()
    expect(within(group).getAllByRole('radio')).toHaveLength(2)
  })

  it('persists the selected mode across reloads', async () => {
    const { unmount } = render(<App />)
    await userEvent.click(getModeRadio(/honesty mode/i))
    unmount()

    // Simulate a reload: rehydrate from storage and re-render.
    await useModeStore.persist.rehydrate()
    render(<App />)
    expect(getModeRadio(/honesty mode/i)).toBeChecked()
  })
})
