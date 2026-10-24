/**
 * A `Storage`-shaped wrapper that never throws.
 *
 * Browser `localStorage` can be entirely unavailable (sandboxed iframes) or
 * throw on access (Safari private mode, quota exceeded, security policies).
 * This wrapper swallows those failures so the app keeps working in-memory for
 * the current session even when persistence is impossible.
 *
 * It intentionally implements only the subset Zustand's `createJSONStorage`
 * uses: `getItem`, `setItem`, `removeItem`.
 */
export interface SafeStorage {
  getItem: (name: string) => string | null
  setItem: (name: string, value: string) => void
  removeItem: (name: string) => void
}

export function createSafeStorage(
  getBackend: () => Storage | undefined,
): SafeStorage {
  return {
    getItem(name) {
      try {
        return getBackend()?.getItem(name) ?? null
      } catch {
        return null
      }
    },
    setItem(name, value) {
      try {
        getBackend()?.setItem(name, value)
      } catch {
        // Persistence unavailable: keep the session usable, drop the write.
      }
    },
    removeItem(name) {
      try {
        getBackend()?.removeItem(name)
      } catch {
        // Ignore: nothing we can do, and it must not crash the app.
      }
    },
  }
}
