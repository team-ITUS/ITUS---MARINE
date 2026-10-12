import { asset } from '@/utils/asset'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import SectionHeading from '@/components/common/SectionHeading'
import { orderedVessels as vessels, pickSpecs } from '@/data/vessels'
import type { Vessel } from '@/types'

interface PriorityPlatformProps {
  vessel: Vessel
  className: string
  /** Home-page photo from the Figma design, used instead of the vessel's hero image. */
  image?: string
}

function PriorityPlatform({ vessel, className, image }: PriorityPlatformProps) {
  const specs = pickSpecs([
    ['LOA', vessel.length],
    ['Speed', vessel.speed],
  ])
  return (
    <article className={`priority-platform ${className}`}>
      <Link to={`/vessels/${vessel.slug}`} className="priority-image">
        <img src={image ?? vessel.heroImage} alt={vessel.name} />
      </Link>
      <div className="priority-copy">
        <b>{String(vessel.brochureOrder).padStart(2, '0')}</b>
        <small>{vessel.category}</small>
        <h3>{vessel.name}</h3>
        <div className="priority-specs">
          {specs.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <Link to={`/vessels/${vessel.slug}`}>
          View Vessel <Arrow />
        </Link>
      </div>
    </article>
  )
}

export default function PriorityPlatforms() {
  const amphibious = vessels.find((vessel) => vessel.brochureOrder === 1)!
  const beb = vessels.find((vessel) => vessel.brochureOrder === 2)!
  const airboat = vessels.find((vessel) => vessel.brochureOrder === 3)!
  const rib = vessels.find((vessel) => vessel.brochureOrder === 4)!
  return (
    <section className="priority-platforms section-ivory">
      <div className="container">
        <SectionHeading title={'Platforms for Demanding\nWaters.'} />
        <div className="priority-flagship-wrap">
          <PriorityPlatform vessel={amphibious} className="priority-flagship" />
        </div>
        <div className="priority-composition">
          <PriorityPlatform
            vessel={beb}
            className="priority-rib"
            image={asset('/images/home/priority-platforms/bridge-erection-boat-1.webp')}
          />
          <PriorityPlatform
            vessel={airboat}
            className="priority-airboat"
            image={asset('/images/home/priority-platforms/airboat-1.webp')}
          />
          <PriorityPlatform
            vessel={rib}
            className="priority-beb"
            image={asset('/images/home/priority-platforms/8m-rigid-inflatable-boat-1.webp')}
          />
        </div>
      </div>
    </section>
  )
}
