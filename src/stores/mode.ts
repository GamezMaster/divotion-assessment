import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSafeStorage } from '../lib/safeStorage'

/** The two description voices the storefront can show. */
export type DescriptionMode = 'marketing' | 'honest'

const STORAGE_KEY = 'bare-minimum:mode'
const DEFAULT_MODE: DescriptionMode = 'marketing'

/** Narrow an unknown persisted value to a valid mode, or the default. */
export function coerceMode(value: unknown): DescriptionMode {
  return value === 'honest' || value === 'marketing' ? value : DEFAULT_MODE
}

const safeStorage = createSafeStorage(() =>
  typeof localStorage !== 'undefined' ? localStorage : undefined,
)

export interface ModeState {
  mode: DescriptionMode
  setMode: (mode: DescriptionMode) => void
  toggleMode: () => void
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: DEFAULT_MODE,
      setMode: (mode) => set({ mode: coerceMode(mode) }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'marketing' ? 'honest' : 'marketing',
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ mode: state.mode }),
      // Missing / invalid stored values fall back to the default mode.
      merge: (persisted, current) => {
        const raw = (persisted as { mode?: unknown } | undefined)?.mode
        return { ...current, mode: coerceMode(raw) }
      },
    },
  ),
)
