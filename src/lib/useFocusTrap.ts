import { useEffect, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => {
    if (el.hasAttribute('disabled')) return false
    if (el.getAttribute('aria-hidden') === 'true') return false
    // `hidden` attribute or display:none ancestors are not focusable.
    return !el.hidden
  })
}

/**
 * Trap keyboard focus within `containerRef` while `active` is true.
 *
 * - On activation, focus moves to the first focusable element in the container.
 * - Tab / Shift+Tab wrap around the focusable boundary.
 * - On deactivation, focus is restored to the element that was focused before.
 *
 * This is a small, purpose-built trap for the single wishlist dialog rather
 * than a general-purpose focus-management dependency.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    // Move focus into the panel on open.
    const initial = getFocusable(container)
    if (initial.length > 0) {
      initial[0].focus()
    } else {
      container.focus()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      const focusable = getFocusable(container!)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeEl = document.activeElement

      if (event.shiftKey) {
        if (activeEl === first || !container!.contains(activeEl)) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (activeEl === last || !container!.contains(activeEl)) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the trigger on close.
      previouslyFocused?.focus?.()
    }
  }, [active, containerRef])
}
