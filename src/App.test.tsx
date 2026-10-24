import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the brand hero heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /finally\. products\./i }),
    ).toBeInTheDocument()
  })

  it('renders the product catalogue', () => {
    render(<App />)
    const listing = screen.getByRole('list', { name: /product catalogue/i })
    expect(listing).toBeInTheDocument()
  })
})
