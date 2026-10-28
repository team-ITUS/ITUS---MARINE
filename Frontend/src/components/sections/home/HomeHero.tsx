import { asset } from '@/utils/asset'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import type { Vessel } from '@/types'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

const labels = ['Amphibious Platform', 'Rapid Response', 'Rescue & Evacuation', 'Special Operations']

export default function HomeHero({ vessel }: { vessel: Vessel }) {
  return (
    <section className="relative h-[760px] overflow-hidden bg-carbon-black text-white sm:h-[800px] lg:h-[clamp(640px,100svh,900px)]">
      <div className="absolute inset-0 overflow-hidden">
        <img
          className="hero-bg h-full object-cover object-[68%_center] lg:object-center"
          src={asset('/images/home/hero/hero.webp')}
          fetchPriority="high"
          alt={`${vessel.name} underway on a beach`}
        />
        <div className="hero-wash absolute inset-0" />
      </div>

      {/* One left-aligned group (heading, copy, CTAs) on the left edge of the page container. */}
      <div className="absolute inset-x-0 top-[104px] z-[3] sm:top-[110px] lg:bottom-0 lg:top-[76px]">
        <div className="container-site flex flex-col items-start lg:h-full lg:justify-center">
          <div className="w-full max-w-[600px] text-left text-carbon-black">
            <h1 className="mb-7 mt-5 font-display text-[46px] font-semibold leading-[.92] tracking-[-.055em] sm:text-[60px] lg:mt-0 lg:w-[6.59em] lg:text-[clamp(60px,4.7vw,88px)]">
              <span className="hero-reveal block" style={delay(300)}>Engineered for</span>
              <span className="hero-reveal block" style={delay(430)}>Demanding Waters.</span>
            </h1>
            <p className="hero-reveal max-w-[526px] text-base font-medium leading-[1.6] sm:text-lg" style={delay(600)}>
              Integrated vessel engineering, shipbuilding and marine-systems
              capability for government, defence, commercial and specialised
              maritime requirements.
            </p>
            <div className="mt-[30px] flex flex-col items-start gap-6 pb-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-[22px]">
              <Link className="btn btn-primary hero-reveal shrink-0 whitespace-nowrap" style={delay(750)} to={`/vessels/${vessel.slug}`}>
                Explore Amphibious Boat <Arrow />
              </Link>
              <Link
                className="action hero-reveal shrink-0 whitespace-nowrap border-oxide-red text-oxide-red hover:border-carbon-black hover:text-carbon-black"
                style={delay(850)}
                to="/vessels"
              >
                View All Vessels
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[35px] z-[3] lg:bottom-[45px]">
        {/* Fixed 2×2 grid below lg so every phone width gets the same layout; one divided row on desktop. */}
        <div className="container-site grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] font-semibold uppercase leading-tight tracking-[.03em] text-carbon-black sm:text-[13px] lg:flex lg:gap-0 lg:text-steel-blue">
          {labels.map((label, i) => (
            <span
              key={label}
              className="hero-reveal border-l border-steel-blue pl-3 lg:px-5 lg:first:border-l-0 lg:first:pl-0"
              style={delay(1000 + i * 90)}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
