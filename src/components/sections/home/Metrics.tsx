import { revealDelay, useReveal } from '@/hooks/useReveal'

const cell =
  'reveal relative flex min-h-[130px] flex-wrap content-center items-baseline gap-2 border-b border-arctic-blue-grey/35 px-[8%] py-10 md:min-h-0 md:content-start md:gap-x-2 md:gap-y-[9.4px] md:border-b-0 md:border-r md:pb-0 md:pt-[48.3px] md:first:border-l'
const figure =
  'font-display text-[clamp(42px,5vw,68px)] font-medium leading-[normal] tracking-[-.05em] text-white md:leading-[1.2]'
const unit = 'text-xs font-semibold uppercase tracking-[.08em] text-ice-grey'
const caption = 'basis-full text-sm tracking-[.03em] text-ice-grey'

export default function Metrics() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="bg-steel-blue text-white">
      <div className="container-site grid grid-cols-1 py-6 md:min-h-[210px] md:grid-cols-3 md:py-0">
        <div className={cell} style={revealDelay(0)}>
          <span className={unit}>Up to</span>
          <strong className={figure}>29 M</strong>
          <small className={caption}>Vessel Building Capability</small>
        </div>
        <div className={cell} style={revealDelay(100)}>
          <strong className={figure}>2L+</strong>
          <span className={unit}>SQ. FT.</span>
          <small className={caption}>Marine Infrastructure</small>
        </div>
        <div className={cell} style={revealDelay(200)}>
          <strong className={figure}>340+</strong>
          <small className={caption}>Vessel Track Record</small>
        </div>
      </div>
    </section>
  )
}
