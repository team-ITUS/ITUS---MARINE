import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'
import GalleryGrid, { GALLERY_BLOCK_SIZE } from '@/components/sections/gallery/GalleryGrid'
import Lightbox from '@/components/sections/gallery/Lightbox'
import VideoModal from '@/components/sections/gallery/VideoModal'
import { galleryItems } from '@/data/gallery'
import { revealDelay, useReveal } from '@/hooks/useReveal'
import type { GalleryItem } from '@/types'
import { asset } from '@/utils/asset'

type Filter = 'all' | 'photo' | 'video'

const filters: [value: Filter, label: string][] = [
  ['all', 'All'],
  ['photo', 'Photos'],
  ['video', 'Videos'],
]

/** Three grid blocks (12 items) at first and per Load More, so loaded rows never reflow. */
const INITIAL_COUNT = GALLERY_BLOCK_SIZE * 3
const BATCH_SIZE = GALLERY_BLOCK_SIZE * 3

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const [count, setCount] = useState(INITIAL_COUNT)
  const [announcement, setAnnouncement] = useState('')
  const [open, setOpen] = useState<{ item: GalleryItem; trigger: HTMLElement } | null>(null)
  const tiles = useRef(new Map<string, HTMLButtonElement>())
  const focusAfterLoad = useRef<string | null>(null)
  const barRef = useRef<HTMLElement>(null)
  const resultsRef = useRef<HTMLElement>(null)

  const filtered = useMemo(
    () => (filter === 'all' ? galleryItems : galleryItems.filter((item) => item.type === filter)),
    [filter],
  )
  const shown = useMemo(() => filtered.slice(0, count), [filtered, count])
  const photos = useMemo(() => shown.filter((item) => item.type === 'photo'), [shown])
  const ref = useReveal<HTMLDivElement>([filter, count])

  const registerTile = useCallback((id: string, tile: HTMLButtonElement | null) => {
    if (tile) tiles.current.set(id, tile)
    else tiles.current.delete(id)
  }, [])

  const openItem = useCallback((item: GalleryItem, trigger: HTMLElement) => setOpen({ item, trigger }), [])
  const close = useCallback(() => setOpen(null), [])

  // After Load More, move focus to the first new tile.
  useEffect(() => {
    const id = focusAfterLoad.current
    focusAfterLoad.current = null
    if (id) tiles.current.get(id)?.focus()
  }, [count])

  const selectFilter = (next: Filter) => {
    if (next === filter) return
    setFilter(next)
    setCount(INITIAL_COUNT)
    setAnnouncement('')
    // If the sticky filter bar is in use further down the page, bring the start of the grid back into view.
    const results = resultsRef.current
    const bar = barRef.current
    if (!results || !bar) return
    const header = document.querySelector('header')?.offsetHeight ?? 0
    const sticky = getComputedStyle(bar).position === 'sticky' ? bar.offsetHeight : 0
    const top = results.getBoundingClientRect().top + window.scrollY - header - sticky
    if (window.scrollY > top) window.scrollTo({ top })
  }

  const loadMore = () => {
    const added = filtered.slice(count, count + BATCH_SIZE)
    if (!added.length) return
    focusAfterLoad.current = added[0].id
    setCount(count + BATCH_SIZE)
    setAnnouncement(`${added.length} more ${added.length === 1 ? 'item' : 'items'} loaded`)
  }

  const photoIndex = open?.item.type === 'photo' ? photos.findIndex((photo) => photo.id === open.item.id) : -1

  return (
    <MainLayout>
      <Seo
        title="Gallery | ITUS Marine"
        description="Photographs and video of ITUS Marine vessels built, tested and deployed."
      />
      <EditorialHero
        title="Built. Tested. Deployed."
        intro="ITUS vessels and marine systems at work, from the shipyard floor to sea trials and active service."
        compact
        video={{
          src: asset('/videos/home/define-your-next-vessel.mp4'),
          poster: asset('/images/home/define-your-next-vessel/23-8m-crew-boat-2.webp'),
          label: 'Crew boat underway at sea along a green coastline',
          position: 'center',
        }}
      />
      <div ref={ref}>
        <section ref={barRef} className="top-[76px] z-20 border-b border-technical-border bg-white lg:sticky">
          <div
            className="hero-reveal container-site flex gap-9 sm:gap-12"
            style={revealDelay(300)}
            role="group"
            aria-label="Filter gallery"
          >
            {filters.map(([value, label]) => {
              const active = filter === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  aria-controls="gallery-media"
                  onClick={() => selectFilter(value)}
                  className={`relative min-h-[60px] cursor-pointer text-sm font-semibold uppercase tracking-ui transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-oxide-red after:transition-transform after:duration-[250ms] after:content-[''] focus-visible:outline-offset-0 ${
                    active ? 'text-carbon-black after:scale-x-100' : 'text-slate-grey after:scale-x-0 hover:text-carbon-black'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>
        <section
          ref={resultsRef}
          id="gallery-media"
          aria-label="Gallery"
          className="bg-polar-white pb-[110px] pt-12 sm:pt-16 lg:pb-[150px] lg:pt-20"
        >
          <GalleryGrid items={shown} onOpen={openItem} registerTile={registerTile} />
          {count < filtered.length && (
            <div className="container-site mt-16 flex justify-center md:mt-24">
              <button type="button" className="action action-dark cursor-pointer pt-5" onClick={loadMore}>
                Load More
              </button>
            </div>
          )}
          <p className="sr-only" role="status" aria-live="polite">
            {announcement}
          </p>
        </section>
        <SimpleCta
          title="Explore Our Vessel Platforms."
          primary={{ label: 'View All Vessels', to: '/vessels' }}
          secondary={{ label: 'Discuss Your Requirement', to: '/contact' }}
        />
      </div>
      {open && photoIndex >= 0 && (
        <Lightbox
          photos={photos}
          index={photoIndex}
          onIndexChange={(index) => setOpen({ item: photos[index], trigger: open.trigger })}
          onClose={close}
          returnFocus={open.trigger}
        />
      )}
      {open?.item.type === 'video' && (
        <VideoModal video={open.item} onClose={close} returnFocus={open.trigger} />
      )}
    </MainLayout>
  )
}
