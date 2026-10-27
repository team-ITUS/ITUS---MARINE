import { useEffect, useRef } from 'react'
import { asset } from '@/utils/asset'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import { revealDelay, useReveal } from '@/hooks/useReveal'

export default function FinalCta() {
  const ref = useReveal<HTMLElement>()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Only fetch and play the background video while the section is near the viewport; reduced-motion users keep the poster.
  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative flex min-h-[720px] items-end bg-carbon-black p-4 text-white sm:min-h-[700px] sm:p-10 md:min-h-[760px] md:px-[7vw] md:pb-[137.36px] md:pt-[7vw]">
      <div className="reveal reveal-opacity absolute inset-4 overflow-hidden sm:inset-5 md:inset-[5vw]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={asset('/images/home/define-your-next-vessel/23-8m-crew-boat-2.webp')}
          muted
          loop
          playsInline
          preload="none"
          aria-label="ITUS vessels underway at sea"
        >
          <source src={asset('/videos/home/define-your-next-vessel.mp4')} type="video/mp4" />
        </video>
      </div>
      <div style={revealDelay(250)} className="reveal relative z-[2] m-4 w-[calc(100%-32px)] bg-steel-blue/95 px-6 py-[34px] sm:m-0 sm:w-4/5 sm:p-[55px] md:w-[min(620px,55%)]">
        <h2 className="m-0 font-display text-[42px] font-semibold leading-[.96] tracking-display text-white sm:text-[clamp(44px,5vw,68px)]">
          Define Your Next
          <br />
          Vessel Requirement.
        </h2>
        <p className="mb-3 mt-9 text-[17px] leading-[1.65] text-ice-grey">
          Engage with our team to evaluate vessel platforms, integrated marine
          systems and project-specific configurations aligned to your
          operational requirement.
        </p>
        <div className="flex items-center gap-6 max-sm:flex-col max-sm:items-start">
          <Link className="btn btn-primary" to="/contact">
            Contact ITUS Marine <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
