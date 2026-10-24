import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { products } from '../data/catalogue'
import { ProductListing } from './ProductListing'

describe('ProductListing', () => {
  it('renders a card for every catalogue product', () => {
    render(<ProductListing />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(products.length)
  })

  it('shows product name, description and formatted price', () => {
    render(<ProductListing />)
    const product = products[0]
    expect(
      screen.getByRole('heading', { name: product.name }),
    ).toBeInTheDocument()
    // Defaults to the marketing description.
    expect(screen.getByText(product.description.marketing)).toBeInTheDocument()
    // Price is formatted as EUR currency.
    expect(screen.getByText(/€16\.95/)).toBeInTheDocument()
  })

  it('renders product images with their alt text', () => {
    render(<ProductListing />)
    const product = products[0]
    const image = screen.getByAltText(product.alt)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', product.image)
  })

  it('exposes an accessible wishlist action per product', async () => {
    const onToggle = vi.fn()
    render(<ProductListing onToggleWishlist={onToggle} />)
    const product = products[0]
    const button = screen.getByRole('button', {
      name: new RegExp(`add ${product.name} to your wishlist`, 'i'),
    })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(button)
    expect(onToggle).toHaveBeenCalledWith(product)
  })

  it('reflects wishlisted state with aria-pressed', () => {
    const product = products[0]
    render(<ProductListing isWishlisted={(id) => id === product.id} />)
    expect(
      screen.getByRole('button', {
        name: new RegExp(`remove ${product.name} from your wishlist`, 'i'),
      }),
    ).toHaveAttribute('aria-pressed', 'true')
  })
})
