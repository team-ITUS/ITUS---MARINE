import { useEffect, useRef, type ReactNode } from 'react'
import { revealDelay } from '@/hooks/useReveal'
import Label from './Label'

interface EditorialHeroVideo {
  src: string
  /** Optional still shown while the video loads or when motion is reduced. */
  poster?: string
  label: string
  /** CSS object-position for the video; keep the subject in frame on narrow screens. */
  position?: string
}

interface EditorialHeroProps {
  title: ReactNode
  /** Small label above the title. */
  label?: string
  intro?: string
  compact?: boolean
  video?: EditorialHeroVideo
}

export default function EditorialHero({ title, label, intro, compact = false, video }: EditorialHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // The video only downloads once play() runs. Reduced-motion and data-saver users keep the poster frame instead.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.pause()
    else el.play().catch(() => {})
  }, [video?.src])

  const height = video
    ? 'min-h-[min(88svh,860px)] pb-[90px] pt-[180px]'
    : compact
      ? 'min-h-[500px] pb-[72px] pt-[155px]'
      : 'min-h-[650px] pb-[100px] pt-[180px]'

  return (
    <section
      className={`relative flex items-end overflow-hidden bg-steel-blue text-white max-sm:min-h-[560px] max-sm:pb-[75px] max-sm:pt-[150px] ${height}`}
    >
      {video ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: video.position ?? 'center' }}
            poster={video.poster}
            muted
            loop
            playsInline
            preload={video.poster ? 'none' : 'metadata'}
            aria-label={video.label}
          >
            <source src={video.src} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,20,32,.82)_0%,rgba(8,20,32,.45)_38%,rgba(8,20,32,.12)_65%,rgba(8,20,32,.35)_100%)]"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="draft-grid" aria-hidden="true" />
      )}
      <div className="container-site relative">
        {label && (
          <div className="hero-reveal mb-7" style={revealDelay(50)}>
            <Label tone="light">{label}</Label>
          </div>
        )}
        <h1
          style={revealDelay(150)}
          className={`hero-reveal max-w-[1050px] font-display font-semibold leading-[.9] tracking-[-.055em] max-sm:text-[51px] ${
            compact ? 'text-[clamp(52px,6vw,78px)]' : 'text-[clamp(62px,7vw,96px)]'
          } ${intro ? 'mb-[26px]' : 'mb-0'}`}
        >
          {title}
        </h1>
        {intro && (
          <p className="hero-reveal max-w-[680px] text-[17px] leading-[1.65] text-ice-grey" style={revealDelay(300)}>{intro}</p>
        )}
      </div>
    </section>
  )
}
