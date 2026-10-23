import { useEffect, useRef, useState, type TouchEvent } from 'react'
import type { GalleryItem } from '@/types'
import { asset } from '@/utils/asset'
import MediaDialog, { CloseIcon, DialogButton } from './MediaDialog'

interface LightboxProps {
  /** Photos currently shown on the page, in page order; previous/next cycle through these. */
  photos: GalleryItem[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  returnFocus: HTMLElement | null
}

/** Minimum horizontal travel, in px, for a swipe to change photo. */
const SWIPE = 50

/** Full-screen photo viewer: image, close, previous and next only. */
export default function Lightbox({ photos, index, onIndexChange, onClose, returnFocus }: LightboxProps) {
  const count = photos.length
  const photo = photos[index]
  const touch = useRef<{ x: number; y: number } | null>(null)
  const go = (step: number) => onIndexChange((index + step + count) % count)
  const goRef = useRef(go)
  goRef.current = go

  useEffect(() => {
    if (count < 2) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goRef.current(1)
      else if (event.key === 'ArrowLeft') goRef.current(-1)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [count])

  // Warm the cache with the neighbouring full-size photos so previous/next feel instant.
  useEffect(() => {
    if (count < 2) return
    for (const step of [1, -1]) new Image().src = asset(photos[(index + step + count) % count].src)
  }, [index, count, photos])

  const handleTouchStart = (event: TouchEvent) => {
    const point = event.touches[0]
    touch.current = { x: point.clientX, y: point.clientY }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const start = touch.current
    touch.current = null
    if (!start || count < 2) return
    const point = event.changedTouches[0]
    const dx = point.clientX - start.x
    const dy = point.clientY - start.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  if (!photo) return null

  return (
    <MediaDialog label="Image viewer" onClose={onClose} returnFocus={returnFocus}>
      <DialogButton label="Close" onClick={onClose} className="right-3 top-3 sm:right-6 sm:top-6">
        <CloseIcon />
      </DialogButton>
      <div
        className="absolute inset-0 flex items-center justify-center px-3 py-[76px] sm:px-[96px] sm:py-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <LightboxImage key={photo.id} photo={photo} />
      </div>
      {count > 1 && (
        <>
          <DialogButton label="Previous image" onClick={() => go(-1)} className="bottom-3 left-3 sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2">
            <path d="M15 5l-7 7 7 7" />
          </DialogButton>
          <DialogButton label="Next image" onClick={() => go(1)} className="bottom-3 right-3 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2">
            <path d="M9 5l7 7-7 7" />
          </DialogButton>
        </>
      )}
    </MediaDialog>
  )
}

/** The full-resolution photo, loaded only when shown, fading in once decoded. */
function LightboxImage({ photo }: { photo: GalleryItem }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      className={`h-full w-full select-none object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      src={asset(photo.src)}
      alt={photo.alt}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
    />
  )
}
