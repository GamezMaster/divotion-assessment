import { useState } from 'react'
import styles from './ProductImage.module.css'

interface ProductImageProps {
  src: string
  alt: string
}

/**
 * Product image with a graceful fallback. If the remote image fails to load
 * (the catalogue depends on an external image CDN), we show a neutral
 * placeholder tile instead of a broken-image icon. Alt text is preserved so
 * the fallback remains accessible.
 */
export function ProductImage({ src, alt }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={styles.fallback} role="img" aria-label={alt}>
        <span aria-hidden="true">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      className={styles.image}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
