import { asset } from '@/utils/asset'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'

const chapters = [
  [
    'Shipbuilding',
    'FRP and aluminium vessel construction, structural assembly and specialised platform configuration.',
  ],
  [
    'Engineering & Integration',
    'Mechanical, electrical, propulsion and navigation integration aligned with project requirements.',
  ],
  [
    'Marine Systems',
    'Propulsion, navigation, communication, monitoring and mission-specific marine systems integration.',
  ],
  [
    'Testing & Commissioning',
    'Inspection, verification, sea trials, commissioning and acceptance support.',
  ],
  [
    'Lifecycle Support',
    'Maintenance, repairs, refits, dry docking and propulsion-system overhaul.',
  ],
]

export default function CapabilityPreview() {
  return (
    <section className="capability-preview section-ivory">
      <div className="capability-visual">
        <img
          src={asset('/images/home/from-building-to-commissioning/amphibious-boat-2.webp')}
          alt="ITUS amphibious vessel platform"
        />
        <span>Integrated Marine Capability</span>
      </div>
      <div className="capability-index">
        {chapters.map(([title, detail], index) => (
          <div key={title}>
            <b>0{index + 1}</b>
            <h3>{title}</h3>
            <p>{detail}</p>
          </div>
        ))}
        <Link className="text-action dark" to="/capabilities">
          Explore Capabilities <Arrow />
        </Link>
      </div>
    </section>
  )
}
