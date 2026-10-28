import { asset } from '@/utils/asset'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import SectionHeading from '@/components/common/SectionHeading'
import { orderedVessels as vessels, pickSpecs } from '@/data/vessels'
import type { Vessel } from '@/types'
import { revealDelay, useReveal } from '@/hooks/useReveal'

interface PriorityPlatformProps {
  vessel: Vessel
  /** Tile size and grid placement. */
  className: string
  /** Extra classes for the photo, for tiles whose crop differs from a plain cover. */
  imageClassName?: string
  /** Larger copy block used by the full-width flagship tile. */
  flagship?: boolean
  /** Smaller title for the two small tiles. */
  compact?: boolean
  /** Home-page photo from the Figma design, used instead of the hero image of the vessel. */
  image?: string
  /** Reveal stagger in ms. */
  delay?: number
}

function PriorityPlatform({ vessel, className, imageClassName = '', flagship = false, compact = false, image, delay = 0 }: PriorityPlatformProps) {
  const specs = pickSpecs([
    ['LOA', vessel.length],
    ['Speed', vessel.speed],
  ])
  return (
    <article
      className={`reveal group relative min-w-0 overflow-hidden bg-carbon-black text-white ${className}`}
      style={revealDelay(delay)}
    >
      <Link
        to={`/vessels/${vessel.slug}`}
        className="absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(0deg,rgba(14,20,24,.92),transparent_62%)] after:content-['']"
      >
        <img
          className={`h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${imageClassName}`}
          src={image ?? vessel.heroImage}
          loading="lazy"
          decoding="async"
          alt={vessel.name}
        />
      </Link>
      <div
        className={`absolute inset-x-5 bottom-[22px] z-[2] sm:inset-x-7 sm:bottom-7 ${
          flagship ? 'sm:inset-x-10 sm:bottom-9 sm:max-w-[560px]' : ''
        }`}
      >
        <b className="block font-display text-[42px] font-medium leading-[.9] text-oxide-red">
          {String(vessel.brochureOrder).padStart(2, '0')}
        </b>
        <small className="mt-3.5 block text-xs uppercase tracking-[.06em] text-ice-grey">{vessel.category}</small>
        <h3
          className={`mb-4 mt-2 font-display font-semibold leading-none text-white ${
            compact ? 'text-[25px]' : 'text-[clamp(24px,2.5vw,38px)]'
          }`}
        >
          {vessel.name}
        </h3>
        <div className="flex gap-6 border-t border-dark-steel-border pt-[13px]">
          {specs.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-[5px]">
              <span className="text-xs uppercase tracking-[.04em] text-arctic-blue-grey">{label}</span>
              <strong className="max-w-[170px] truncate text-sm font-medium text-white">{value}</strong>
            </div>
          ))}
        </div>
        <Link
          className="mt-[18px] inline-block border-b border-arctic-blue-grey pb-1.5 text-sm uppercase tracking-ui text-white hover:border-white"
          to={`/vessels/${vessel.slug}`}
        >
          View Vessel <Arrow className="text-oxide-red" />
        </Link>
      </div>
    </article>
  )
}

export default function PriorityPlatforms() {
  const ref = useReveal<HTMLElement>()
  const amphibious = vessels.find((vessel) => vessel.brochureOrder === 1)!
  const beb = vessels.find((vessel) => vessel.brochureOrder === 2)!
  const airboat = vessels.find((vessel) => vessel.brochureOrder === 3)!
  const rib = vessels.find((vessel) => vessel.brochureOrder === 4)!
  return (
    <section ref={ref} className="bg-polar-white py-[100px] md:pb-40 md:pt-[145px]">
      <div className="container-site">
        <div className="reveal">
          <SectionHeading title={'Platforms for Demanding\nWaters.'} />
        </div>
        <div className="mt-12">
          <PriorityPlatform vessel={amphibious} className="min-h-[460px]" flagship delay={100} />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[1.35fr_.65fr] lg:grid-rows-2">
          <PriorityPlatform
            vessel={beb}
            delay={100}
            className="min-h-[500px] sm:col-span-2 sm:min-h-[620px] lg:col-span-1 lg:row-span-2 lg:min-h-[760px]"
            /* Figma places the 1678x937 source at 1467px wide, offset -246px, inside the 877.5px tile. */
            imageClassName="lg:absolute lg:left-[-28.03%] lg:top-0 lg:h-auto lg:min-h-full lg:w-[167.18%] lg:max-w-none"
            image={asset('/images/home/priority-platforms/bridge-erection-boat-1.webp')}
          />
          <PriorityPlatform
            vessel={airboat}
            delay={200}
            compact
            className="min-h-[400px] sm:min-h-[390px] lg:min-h-[370px]"
            image={asset('/images/home/priority-platforms/airboat-1.webp')}
          />
          <PriorityPlatform
            vessel={rib}
            delay={300}
            compact
            className="min-h-[400px] sm:min-h-[390px] lg:min-h-[370px]"
            image={asset('/images/home/priority-platforms/8m-rigid-inflatable-boat-1.webp')}
          />
        </div>
      </div>
    </section>
  )
}
