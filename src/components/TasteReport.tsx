import { formatPrice } from '../lib/format'
import { generateReport, type ResolvedItem } from '../lib/taste-report'
import styles from './TasteReport.module.css'

interface TasteReportProps {
  items: ResolvedItem[]
}

/**
 * "Your Questionable Taste Report" — an editorial-style assessment derived
 * entirely from the current wishlist. Renders nothing for an empty wishlist;
 * the panel shows its own empty state in that case.
 */
export function TasteReport({ items }: TasteReportProps) {
  const report = generateReport(items)
  if (!report) return null

  const commitment =
    report.totalUnits === 1
      ? '1 item saved for later instead of actually bought.'
      : `${report.totalUnits} items saved for later instead of actually bought.`

  return (
    <section className={styles.report} aria-labelledby="taste-report-title">
      <header className={styles.head}>
        <h3 id="taste-report-title" className={styles.title}>
          Your Questionable Taste Report
        </h3>
        <p className={styles.subtitle}>
          An entirely unsolicited assessment of your purchasing decisions.
        </p>
      </header>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt className={styles.statLabel}>Financial commitment</dt>
          <dd className={styles.statValue}>{formatPrice(report.totalValue)}</dd>
          <dd className={styles.statNote}>
            Your financial future, hypothetically.
          </dd>
        </div>

        <div className={styles.stat}>
          <dt className={styles.statLabel}>Shopping personality</dt>
          <dd className={styles.statValue}>{report.personality.title}</dd>
          <dd className={styles.statNote}>{report.personality.blurb}</dd>
        </div>

        {report.mostQuestionable && (
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Most questionable decision</dt>
            <dd className={styles.statValue}>
              {report.mostQuestionable.productName}
              <span className={styles.statAside}>
                {' '}
                ({formatPrice(report.mostQuestionable.value)})
              </span>
            </dd>
            <dd className={styles.statNote}>{report.mostQuestionable.quip}</dd>
          </div>
        )}

        <div className={styles.stat}>
          <dt className={styles.statLabel}>Commitment issues</dt>
          <dd className={styles.statValue}>
            {report.distinctCount}{' '}
            {report.distinctCount === 1 ? 'product' : 'products'}
          </dd>
          <dd className={styles.statNote}>{commitment}</dd>
        </div>
      </dl>

      <p className={styles.verdict}>
        <span className={styles.verdictLabel}>Final verdict:</span>{' '}
        {report.verdict}
      </p>

      <p className={styles.disclaimer}>
        Not financial advice. Barely advice at all.
      </p>
    </section>
  )
}
