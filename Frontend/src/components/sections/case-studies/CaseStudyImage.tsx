import imageManifest from '@/data/case-study-images.json'
import type { CaseStudy } from '@/types'
import { asset } from '@/utils/asset'

/** Cover widths and original size per case study, written by `npm run case-studies:images`. */
const covers: Record<string, { width: number; height: number; widths: number[] }> = imageManifest

const srcSet = (slug: string, widths: number[], ext: string) =>
  widths.map((w) => `${asset(`/images/case-studies/${slug}-${w}.${ext}`)} ${w}w`).join(', ')

interface CaseStudyImageProps {
  study: CaseStudy
  /** `sizes` for the srcset, matching the image's rendered width. */
  sizes: string
  className?: string
  eager?: boolean
}

/** Cover photo as AVIF/WebP at several widths; falls back to the original file before the script has run. */
export default function CaseStudyImage({ study, sizes, className = '', eager }: CaseStudyImageProps) {
  const entry = covers[study.slug]
  const fallbackWidth = entry?.widths.find((w) => w >= 1280) ?? entry?.widths[entry.widths.length - 1]

  return (
    <picture className="block h-full">
      {entry && <source type="image/avif" srcSet={srcSet(study.slug, entry.widths, 'avif')} sizes={sizes} />}
      <img
        className={`h-full object-cover ${className}`}
        src={entry ? asset(`/images/case-studies/${study.slug}-${fallbackWidth}.webp`) : asset(study.coverImage)}
        srcSet={entry ? srcSet(study.slug, entry.widths, 'webp') : undefined}
        sizes={entry ? sizes : undefined}
        width={entry?.width}
        height={entry?.height}
        alt={study.coverAlt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}
