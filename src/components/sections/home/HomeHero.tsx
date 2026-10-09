import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import type { Vessel } from '@/types'

export default function HomeHero({ vessel }: { vessel: Vessel }) {
  return (
    <section className="home-hero">
      <div className="home-hero-image">
        <img src="/images/home/hero/hero.webp" alt={`${vessel.name} underway on a beach`} />
      </div>
      <div className="home-hero-panel">
        <h1>
          Engineered for
          <br />
          Demanding Waters.
        </h1>
        <p>
          Integrated vessel engineering, shipbuilding and marine-systems
          capability for government, defence, commercial and specialised
          maritime requirements.
        </p>
        <div className="button-row">
          <Link className="button button-gold" to={`/vessels/${vessel.slug}`}>
            Explore Amphibious Boat <Arrow />
          </Link>
          <Link className="text-action" to="/vessels">
            View All Vessels
          </Link>
        </div>
      </div>
      <div className="home-hero-notes">
        <span>Amphibious Platform</span>
        <span>Land + Water Mobility</span>
        <span>FRP / GRP</span>
        <span>Twin Outboard</span>
      </div>
    </section>
  )
}
