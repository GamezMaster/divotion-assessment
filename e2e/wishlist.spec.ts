import { expect, test } from '@playwright/test'

/**
 * The one flow that unit/component tests can only approximate: a real browser
 * reload preserving wishlist state via localStorage.
 *
 * Open listing -> add an item -> open the panel -> increase quantity ->
 * reload -> verify the item and its quantity persist.
 */
test('wishlist persists across a page reload', async ({ page }) => {
  await page.goto('/')

  // Start clean so the test is deterministic regardless of prior runs.
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // Add the first product to the wishlist.
  const addButton = page
    .getByRole('button', { name: /add .* to your wishlist/i })
    .first()
  const productLabel = await addButton.getAttribute('aria-label')
  const productName = productLabel
    ?.replace(/^Add /, '')
    .replace(/ to your wishlist$/, '')
  await addButton.click()

  // Badge/trigger now reflects one item.
  await expect(
    page.getByRole('button', { name: /open wishlist, 1 item/i }),
  ).toBeVisible()

  // Open the panel and increase the quantity to 3.
  await page.getByRole('button', { name: /open wishlist/i }).click()
  const dialog = page.getByRole('dialog', { name: /your questionable taste/i })
  await expect(dialog).toBeVisible()

  const increase = dialog.getByRole('button', {
    name: new RegExp(`increase quantity of ${productName}`, 'i'),
  })
  await increase.click()
  await increase.click()

  await expect(
    page.getByRole('button', { name: /open wishlist, 3 items/i }),
  ).toBeVisible()

  // Reload the page — a real navigation, not a jsdom simulation.
  await page.reload()

  // The count persists.
  await expect(
    page.getByRole('button', { name: /open wishlist, 3 items/i }),
  ).toBeVisible()

  // And the item is still in the panel with quantity 3.
  await page.getByRole('button', { name: /open wishlist/i }).click()
  const reopened = page.getByRole('dialog', {
    name: /your questionable taste/i,
  })
  const quantityGroup = reopened.getByRole('group', {
    name: new RegExp(`quantity for ${productName}`, 'i'),
  })
  await expect(quantityGroup).toBeVisible()
  await expect(quantityGroup).toContainText('3')
})
