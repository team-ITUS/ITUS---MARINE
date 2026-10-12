import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import SectionHeading from '@/components/common/SectionHeading'
import { orderedVessels as vessels } from '@/data/vessels'

export default function RangePreview() {
  const range = vessels.filter((vessel) => vessel.brochureOrder >= 5)
  return (
    <section className="range-preview section-light">
      <div className="container">
        <div className="range-heading">
          <SectionHeading title={'\nComprehensive\nVessel Portfolio.'} />
          <Link className="text-action dark" to="/vessels">
            View All Vessels <Arrow />
          </Link>
        </div>
        <div className="range-index">
          {range.map((vessel) => (
            <Link key={vessel.id} to={`/vessels/${vessel.slug}`}>
              <span>{String(vessel.brochureOrder).padStart(2, '0')}</span>
              <img src={vessel.heroImage} alt={vessel.name} />
              <strong>{vessel.name}</strong>
              <small>{vessel.category}</small>
              <Arrow />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
