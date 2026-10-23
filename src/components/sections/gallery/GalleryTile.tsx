import type { CSSProperties, Ref } from 'react'
import thumbManifest from '@/data/gallery-thumbs.json'
import type { GalleryItem } from '@/types'
import { asset } from '@/utils/asset'

/** Thumbnail widths and original size per item, written by `npm run gallery:thumbs`. */
const thumbs: Record<string, { width: number; height: number; widths: number[] }> = thumbManifest

const srcSet = (id: string, widths: number[], ext: string) =>
  widths.map((w) => `${asset(`/images/gallery/${id}-${w}.${ext}`)} ${w}w`).join(', ')

interface GalleryTileProps {
  item: GalleryItem
  /** `sizes` for the thumbnail srcset, matching the tile's width in the grid. */
  sizes: string
  /** Load straight away (the opening item) instead of lazily. */
  eager?: boolean
  /** Wide or feature tile: larger play control. */
  large?: boolean
  onOpen: (item: GalleryItem, trigger: HTMLButtonElement) => void
  ref?: Ref<HTMLButtonElement>
}

/**
 * Image-only gallery tile. A button, so it is keyboard operable; its label is for assistive tech only.
 * Phones keep the item's own aspect; from sm up the tile fills the grid cell it sits in.
 */
export default function GalleryTile({ item, sizes, eager, large, onOpen, ref }: GalleryTileProps) {
  const video = item.type === 'video'
  const entry = thumbs[item.id]
  const fallbackWidth = entry?.widths.find((w) => w >= 1280) ?? entry?.widths[entry.widths.length - 1]
  const style = { '--ar': item.aspect.replace(':', ' / ') } as CSSProperties

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${video ? 'Play video' : 'View image'}: ${item.alt}`}
      onClick={(event) => onOpen(item, event.currentTarget)}
      style={style}
      className="group relative block aspect-(--ar) w-full cursor-pointer overflow-hidden bg-carbon-black sm:aspect-auto sm:h-full"
    >
      <picture className="block h-full">
        {entry && <source type="image/avif" srcSet={srcSet(item.id, entry.widths, 'avif')} sizes={sizes} />}
        <img
          className="h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
          src={entry ? asset(`/images/gallery/${item.id}-${fallbackWidth}.webp`) : asset(item.thumbnail)}
          srcSet={entry ? srcSet(item.id, entry.widths, 'webp') : undefined}
          sizes={entry ? sizes : undefined}
          width={entry?.width}
          height={entry?.height}
          alt={item.alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
        />
      </picture>
      {video && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <span
            className={`grid place-items-center border border-white/35 bg-carbon-black/55 text-white backdrop-blur-[2px] transition-colors duration-300 group-hover:border-oxide-red group-hover:bg-oxide-red group-focus-visible:border-oxide-red group-focus-visible:bg-oxide-red ${
              large ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-14 w-14'
            }`}
          >
            <svg viewBox="0 0 24 24" className={`ml-0.5 ${large ? 'h-6 w-6' : 'h-5 w-5'}`} fill="currentColor">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          </span>
        </span>
      )}
    </button>
  )
}
