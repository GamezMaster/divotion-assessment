import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { getProductById } from './data/catalogue'
import { useWishlistStore } from './stores/wishlist'

const CHAIR = getProductById('ergonomic-office-chair')!
const MUG = getProductById('everyday-mug')!

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

describe('Questionable Taste Report', () => {
  it('does not show a report for an empty wishlist', async () => {
    render(<App />)
    await openWishlist()
    expect(
      screen.queryByRole('heading', { name: /questionable taste report/i }),
    ).not.toBeInTheDocument()
    // Empty state is shown instead.
    expect(
      screen.getByRole('heading', { name: /nothing here\./i }),
    ).toBeInTheDocument()
  })

  it('shows the report with real data once a product is added', async () => {
    useWishlistStore.setState({
      entries: [{ productId: MUG.id, quantity: 1 }],
    })
    render(<App />)
    await openWishlist()

    const report = screen
      .getByRole('heading', { name: /questionable taste report/i })
      .closest('section')!
    expect(report).toBeInTheDocument()
    // Financial commitment reflects the single mug price. (It also appears as
    // the most-questionable line value, since it is the only item.)
    expect(within(report).getAllByText(/€16\.95/).length).toBeGreaterThan(0)
    // Disclaimer is present.
    expect(
      within(report).getByText(/not financial advice/i),
    ).toBeInTheDocument()
  })

  it('names the most expensive item as the most questionable decision', async () => {
    useWishlistStore.setState({
      entries: [
        { productId: MUG.id, quantity: 1 },
        { productId: CHAIR.id, quantity: 1 },
      ],
    })
    render(<App />)
    await openWishlist()

    const report = screen
      .getByRole('heading', { name: /questionable taste report/i })
      .closest('section')!
    expect(within(report).getByText(CHAIR.name)).toBeInTheDocument()
  })

  it('updates totals when quantity changes', async () => {
    useWishlistStore.setState({
      entries: [{ productId: MUG.id, quantity: 1 }],
    })
    render(<App />)
    await openWishlist()

    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', {
        name: new RegExp(`increase quantity of ${MUG.name}`, 'i'),
      }),
    )

    const report = screen
      .getByRole('heading', { name: /questionable taste report/i })
      .closest('section')!
    // Two mugs at €16.95 = €33.90 as the financial-commitment figure.
    const financialLabel = within(report).getByText(/financial commitment/i)
    const financialValue = financialLabel.nextElementSibling
    expect(financialValue).toHaveTextContent(/€33\.90/)
  })

  it('returns to the empty state when the final product is removed', async () => {
    useWishlistStore.setState({
      entries: [{ productId: MUG.id, quantity: 1 }],
    })
    render(<App />)
    await openWishlist()

    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', {
        name: new RegExp(`remove ${MUG.name} from your wishlist`, 'i'),
      }),
    )

    expect(
      screen.queryByRole('heading', { name: /questionable taste report/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /nothing here\./i }),
    ).toBeInTheDocument()
  })

  it('exposes the report via a labelled section and heading', async () => {
    useWishlistStore.setState({
      entries: [{ productId: MUG.id, quantity: 1 }],
    })
    render(<App />)
    await openWishlist()

    const region = screen.getByRole('region', {
      name: /your questionable taste report/i,
    })
    expect(region).toBeInTheDocument()
  })
})
