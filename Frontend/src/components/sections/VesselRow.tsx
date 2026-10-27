import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import { pickSpecs } from '@/data/vessels'
import { revealDelay } from '@/hooks/useReveal'
import type { Vessel } from '@/types'

export default function VesselRow({ vessel, index }: { vessel: Vessel; index: number }) {
  const specs = pickSpecs([
    ['LOA', vessel.length],
    ['Speed', vessel.speed],
    ['Capacity', vessel.capacity],
  ])
  const reverse = index % 2 === 1
  const priority = vessel.priorityPlatform
  return (
    <article
      className={`grid grid-cols-1 items-center gap-[45px] lg:gap-[7%] ${
        reverse ? 'lg:grid-cols-[.78fr_1.22fr]' : 'lg:grid-cols-[1.22fr_.78fr]'
      } ${priority ? 'my-5' : ''}`}
    >
      <Link
        className={`group relative block overflow-hidden bg-steel-blue ${reverse ? 'lg:order-2' : ''} ${
          priority
            ? 'h-[400px] sm:h-[560px] lg:h-[clamp(420px,calc(100vh_-_260px),620px)]'
            : 'h-[340px] sm:h-[460px] lg:h-[clamp(380px,calc(100vh_-_260px),480px)]'
        }`}
        to={`/vessels/${vessel.slug}`}
      >
        <img
          className="reveal reveal-scale h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
          src={vessel.heroImage}
          alt={vessel.name}
        />
      </Link>
      <div className="reveal" style={revealDelay(120)}>
        <b className="text-outline block font-display text-[64px] font-medium leading-[.8] text-polar-white sm:text-[86px] lg:text-[64px]">
          {String(vessel.brochureOrder).padStart(2, '0')}
        </b>
        <small className="mt-[35px] block lg:mt-5 text-[13px] uppercase tracking-[.05em] text-slate-grey">
          {vessel.category}
        </small>
        <h2 className="mb-5 mt-[13px] font-display text-[clamp(34px,3vw,46px)] font-semibold leading-none tracking-[-.04em] text-carbon-black">
          {vessel.name}
        </h2>
        <p className="text-[17px] leading-[1.65] text-slate-grey lg:text-base lg:leading-[1.6]">{vessel.shortDescription}</p>
        <div className="my-[30px] border-t lg:my-6 border-technical-border">
          {specs.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[80px_1fr] border-b border-technical-border py-2.5">
              <span className="text-xs uppercase tracking-[.04em] text-slate-grey">{label}</span>
              <strong className="text-[15px] font-medium text-steel-blue">{value}</strong>
            </div>
          ))}
        </div>
        <Link
          className="border-b border-technical-border pb-1.5 text-sm font-semibold uppercase tracking-ui text-steel-blue hover:border-steel-blue hover:text-carbon-black"
          to={`/vessels/${vessel.slug}`}
        >
          View Vessel <Arrow className="text-oxide-red" />
        </Link>
      </div>
    </article>
  )
}
