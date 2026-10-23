import { useEffect, useRef } from 'react'
import type { GalleryItem } from '@/types'
import { asset } from '@/utils/asset'
import MediaDialog, { CloseIcon, DialogButton } from './MediaDialog'

interface VideoModalProps {
  video: GalleryItem
  onClose: () => void
  returnFocus: HTMLElement | null
}

/** YouTube (privacy-enhanced domain) or Vimeo embed URL that starts muted, so it never autoplays with sound. */
function embedUrl(video: GalleryItem) {
  const url = new URL(video.src)
  if (video.videoSource === 'youtube') {
    url.hostname = 'www.youtube-nocookie.com'
    url.search = new URLSearchParams({ autoplay: '1', mute: '1', playsinline: '1', rel: '0' }).toString()
  } else {
    url.search = new URLSearchParams({ autoplay: '1', muted: '1', dnt: '1' }).toString()
  }
  return url.toString()
}

/**
 * Video player overlay. Nothing is requested until it opens. Local files start muted with visible controls
 * (play/pause, volume, fullscreen); playback stops when the overlay closes.
 */
export default function VideoModal({ video, onClose, returnFocus }: VideoModalProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const embedded = video.videoSource === 'youtube' || video.videoSource === 'vimeo'

  useEffect(() => {
    const player = ref.current
    if (!player) return
    player.muted = true
    player.play().catch(() => {})
    return () => player.pause()
  }, [])

  return (
    <MediaDialog label="Video player" onClose={onClose} returnFocus={returnFocus}>
      <DialogButton label="Close" onClick={onClose} className="right-3 top-3 sm:right-6 sm:top-6">
        <CloseIcon />
      </DialogButton>
      <div className="absolute inset-0 flex items-center justify-center px-3 py-[76px] sm:px-[96px] sm:py-20">
        <div className="media-in aspect-video w-full max-w-[min(1280px,calc((100svh-160px)*16/9))] bg-black">
          {embedded ? (
            <iframe
              className="h-full w-full"
              src={embedUrl(video)}
              title={video.alt}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              ref={ref}
              className="h-full w-full"
              src={asset(video.src)}
              poster={asset(video.thumbnail)}
              aria-label={video.alt}
              controls
              playsInline
              preload="metadata"
            />
          )}
        </div>
      </div>
    </MediaDialog>
  )
}
