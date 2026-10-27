import { useMemo } from 'react'
import type { GalleryItem } from '@/types'
import GalleryTile from './GalleryTile'

type RowKind = 'wide' | 'feature' | 'feature-reverse' | 'pair'

interface Cell {
  /** Placement and height in the row grid from sm up; phones stack tiles at their own aspect. */
  className: string
  sizes: string
  /** Wide or feature tile (larger play control). */
  large?: boolean
}

/** `sizes` per tile width: the container is 1280px max with 20px gaps between tiles. */
const SIZES = {
  wide: '(min-width: 1360px) 1280px, 100vw',
  feature: '(min-width: 1360px) 850px, (min-width: 1024px) 66vw, 100vw',
  side: '(min-width: 1360px) 420px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  half: '(min-width: 1360px) 630px, (min-width: 640px) 50vw, 100vw',
}

/*
 * Same proportions as the home page "Platforms for Demanding Waters." grid (PriorityPlatforms): a full-width
 * tile, then a feature tile spanning two rows beside two stacked tiles (1.35fr / .65fr), all 20px apart.
 * On tablets the feature tile runs full width over the two side tiles.
 */
const featureGrid = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-rows-2'
const featureCell = 'sm:col-span-2 sm:h-[620px] lg:col-span-1 lg:row-span-2 lg:h-[760px]'
const sideCell = 'sm:h-[390px] lg:h-[370px]'

const LAYOUTS: Record<RowKind, { className: string; cells: Cell[] }> = {
  wide: { className: '', cells: [{ className: 'sm:h-[460px]', sizes: SIZES.wide, large: true }] },
  feature: {
    className: `${featureGrid} lg:grid-cols-[1.35fr_.65fr]`,
    cells: [
      { className: featureCell, sizes: SIZES.feature, large: true },
      { className: sideCell, sizes: SIZES.side },
      { className: sideCell, sizes: SIZES.side },
    ],
  },
  // Mirrored: feature tile on the right. It stays first in the markup, so Tab order still starts with it.
  'feature-reverse': {
    className: `${featureGrid} lg:grid-cols-[.65fr_1.35fr]`,
    cells: [
      { className: `${featureCell} lg:col-start-2 lg:row-start-1`, sizes: SIZES.feature, large: true },
      { className: `${sideCell} lg:col-start-1 lg:row-start-1`, sizes: SIZES.side },
      { className: `${sideCell} lg:col-start-1 lg:row-start-2`, sizes: SIZES.side },
    ],
  },
  // Only used when the list ends with two items left over.
  pair: {
    className: 'grid grid-cols-1 gap-5 sm:grid-cols-2',
    cells: [
      { className: 'sm:h-[390px] lg:h-[460px]', sizes: SIZES.half },
      { className: 'sm:h-[390px] lg:h-[460px]', sizes: SIZES.half },
    ],
  },
}

/** Items per block: one wide tile, then a feature tile with two side tiles. */
export const GALLERY_BLOCK_SIZE = 4

/**
 * Splits the shown items into blocks of a wide row plus a feature row, mirroring every other feature row.
 * Placement depends only on position, so loading whole blocks never moves rows already on the page.
 * Leftovers at the end become a wide row (one item) or a pair (two).
 */
function buildRows(items: GalleryItem[]) {
  const rows: { kind: RowKind; items: GalleryItem[] }[] = []
  for (let start = 0, block = 0; start < items.length; start += GALLERY_BLOCK_SIZE, block++) {
    rows.push({ kind: 'wide', items: items.slice(start, start + 1) })
    const rest = items.slice(start + 1, start + GALLERY_BLOCK_SIZE)
    if (rest.length === 3) rows.push({ kind: block % 2 ? 'feature-reverse' : 'feature', items: rest })
    else if (rest.length === 2) rows.push({ kind: 'pair', items: rest })
    else if (rest.length === 1) rows.push({ kind: 'wide', items: rest })
  }
  return rows
}

interface GalleryGridProps {
  items: GalleryItem[]
  onOpen: (item: GalleryItem, trigger: HTMLButtonElement) => void
  /** Collects each tile's button by item id, so focus can move to newly loaded items. */
  registerTile: (id: string, tile: HTMLButtonElement | null) => void
}

/**
 * Anchor & Stack grid (`gallery-anchor`), modelled on the home page platforms grid: full-width and feature
 * tiles anchor each block, with smaller tiles stacked beside them. Two columns on tablets, one stream on phones.
 */
export default function GalleryGrid({ items, onOpen, registerTile }: GalleryGridProps) {
  const rows = useMemo(() => buildRows(items), [items])

  return (
    <div className="gallery-anchor container-site flex flex-col gap-5">
      {rows.map((row, rowIndex) => {
        const layout = LAYOUTS[row.kind]
        return (
          <div key={`${row.kind}-${row.items[0].id}`} className={layout.className}>
            {row.items.map((item, index) => {
              const cell = layout.cells[index]
              return (
                <div key={item.id} className={`reveal reveal-opacity min-w-0 ${cell.className}`}>
                  <GalleryTile
                    ref={(tile) => registerTile(item.id, tile)}
                    item={item}
                    sizes={cell.sizes}
                    eager={rowIndex === 0}
                    large={cell.large}
                    onOpen={onOpen}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
