import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import { pickSpecs } from '@/data/vessels'
import type { Vessel } from '@/types'

export default function VesselRow({ vessel, index }: { vessel: Vessel; index: number }) {
  const specs = pickSpecs([
    ['LOA', vessel.length],
    ['Speed', vessel.speed],
    ['Capacity', vessel.capacity],
  ])
  return (
    <article
      className={`vessel-row ${index % 2 ? 'reverse' : ''} ${
        vessel.priorityPlatform ? 'priority-row' : 'range-row'
      }`}
    >
      <Link className="vessel-row-image" to={`/vessels/${vessel.slug}`}>
        <img src={vessel.heroImage} alt={vessel.name} />
        <span>Vessel / {String(vessel.brochureOrder).padStart(2, '0')}</span>
      </Link>
      <div className="vessel-row-copy">
        <b>{String(vessel.brochureOrder).padStart(2, '0')}</b>
        <small>{vessel.category}</small>
        <h2>{vessel.name}</h2>
        <p>{vessel.shortDescription}</p>
        <div className="row-specs">
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
