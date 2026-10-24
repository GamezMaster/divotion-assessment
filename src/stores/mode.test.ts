import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { coerceMode, useModeStore } from './mode'

const STORAGE_KEY = 'bare-minimum:mode'

beforeEach(() => {
  localStorage.clear()
  useModeStore.setState({ mode: 'marketing' })
})

afterEach(() => {
  localStorage.clear()
})

describe('coerceMode', () => {
  it('accepts the two valid modes', () => {
    expect(coerceMode('marketing')).toBe('marketing')
    expect(coerceMode('honest')).toBe('honest')
  })

  it('falls back to marketing for invalid values', () => {
    expect(coerceMode('nonsense')).toBe('marketing')
    expect(coerceMode(undefined)).toBe('marketing')
    expect(coerceMode(null)).toBe('marketing')
    expect(coerceMode(42)).toBe('marketing')
  })
})

describe('mode store', () => {
  it('defaults to marketing mode', () => {
    expect(useModeStore.getState().mode).toBe('marketing')
  })

  it('sets a specific mode', () => {
    useModeStore.getState().setMode('honest')
    expect(useModeStore.getState().mode).toBe('honest')
  })

  it('ignores invalid modes passed to setMode', () => {
    // @ts-expect-error intentionally invalid input
    useModeStore.getState().setMode('banana')
    expect(useModeStore.getState().mode).toBe('marketing')
  })

  it('toggles between the two modes', () => {
    const store = useModeStore.getState()
    store.toggleMode()
    expect(useModeStore.getState().mode).toBe('honest')
    store.toggleMode()
    expect(useModeStore.getState().mode).toBe('marketing')
  })

  it('persists the selected mode', () => {
    useModeStore.getState().setMode('honest')
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).toContain('honest')
  })

  it('restores a valid persisted mode on rehydrate', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { mode: 'honest' }, version: 0 }),
    )
    await useModeStore.persist.rehydrate()
    expect(useModeStore.getState().mode).toBe('honest')
  })

  it('falls back to marketing when the persisted mode is invalid', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { mode: 'chaos' }, version: 0 }),
    )
    await useModeStore.persist.rehydrate()
    expect(useModeStore.getState().mode).toBe('marketing')
  })

  it('tolerates corrupt persisted JSON', async () => {
    localStorage.setItem(STORAGE_KEY, '{ not valid json')
    await expect(useModeStore.persist.rehydrate()).resolves.not.toThrow()
    expect(useModeStore.getState().mode).toBe('marketing')
  })
})
