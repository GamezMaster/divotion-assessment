import { describe, expect, it, vi } from 'vitest'
import { createSafeStorage } from './safeStorage'

describe('createSafeStorage', () => {
  it('delegates to a working backend', () => {
    const backend = {
      getItem: vi.fn().mockReturnValue('value'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage

    const storage = createSafeStorage(() => backend)
    expect(storage.getItem('k')).toBe('value')
    storage.setItem('k', 'v')
    storage.removeItem('k')
    expect(backend.setItem).toHaveBeenCalledWith('k', 'v')
    expect(backend.removeItem).toHaveBeenCalledWith('k')
  })

  it('returns null from getItem when the backend is undefined', () => {
    const storage = createSafeStorage(() => undefined)
    expect(storage.getItem('k')).toBeNull()
  })

  it('does not throw when the backend throws on read', () => {
    const backend = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage

    const storage = createSafeStorage(() => backend)
    expect(() => storage.getItem('k')).not.toThrow()
    expect(storage.getItem('k')).toBeNull()
  })

  it('does not throw when the backend throws on write', () => {
    const backend = {
      getItem: vi.fn(),
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
      removeItem: () => {
        throw new Error('SecurityError')
      },
    } as unknown as Storage

    const storage = createSafeStorage(() => backend)
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    expect(() => storage.removeItem('k')).not.toThrow()
  })

  it('does not throw when accessing the backend itself throws', () => {
    const storage = createSafeStorage(() => {
      throw new Error('localStorage is not available')
    })
    expect(() => storage.getItem('k')).not.toThrow()
    expect(storage.getItem('k')).toBeNull()
    expect(() => storage.setItem('k', 'v')).not.toThrow()
  })
})
