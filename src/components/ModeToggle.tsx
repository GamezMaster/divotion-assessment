import type { DescriptionMode } from '../stores/mode'
import styles from './ModeToggle.module.css'

interface ModeToggleProps {
  mode: DescriptionMode
  onChange: (mode: DescriptionMode) => void
}

const OPTIONS: { value: DescriptionMode; label: string }[] = [
  { value: 'marketing', label: 'Marketing Mode' },
  { value: 'honest', label: 'Honesty Mode' },
]

/**
 * Segmented control for switching the storefront's description voice.
 * Implemented as a radiogroup so assistive tech gets correct roles, selected
 * state, and arrow-key navigation. The active option is shown by a filled
 * segment and the native checked state — never colour alone.
 */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const supportingText =
    mode === 'marketing'
      ? 'Extraordinary claims. Entirely ordinary products.'
      : "Let's not pretend this is revolutionary."

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.group}
        role="radiogroup"
        aria-label="Choose your reality"
      >
        <span className={styles.groupLabel} aria-hidden="true">
          Choose your reality
        </span>
        <div className={styles.segments}>
          {OPTIONS.map((option) => {
            const selected = mode === option.value
            return (
              <label
                key={option.value}
                className={styles.segment}
                data-selected={selected}
              >
                <input
                  type="radio"
                  name="description-mode"
                  className={styles.input}
                  value={option.value}
                  checked={selected}
                  onChange={() => onChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      </div>
      <p className={styles.supporting} aria-live="polite">
        {supportingText}
      </p>
    </div>
  )
}
