import { asset } from '@/utils/asset'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import { revealDelay, useReveal } from '@/hooks/useReveal'

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
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="grid min-h-[850px] grid-cols-1 bg-polar-white md:grid-cols-2 lg:grid-cols-[58%_42%]">
      <div className="reveal reveal-opacity relative min-h-[480px] min-w-0 sm:min-h-[650px] md:min-h-0">
        <img
          className="h-full object-cover"
          src={asset('/images/home/from-building-to-commissioning/Red Amphibious Rescue Boat at Marina Beach.webp')}
          alt="ITUS amphibious vessel platform"
        />
      </div>
      <div className="px-6 py-20 sm:px-[5vw] sm:py-[90px] lg:px-[7vw] lg:py-[110px]">
        {chapters.map(([title, detail], index) => (
          <div key={title} style={revealDelay(index * 80)} className="reveal grid grid-cols-[45px_1fr] border-t border-technical-border py-[25px]">
            <b className="row-span-2 text-[13px] font-semibold text-oxide-red">0{index + 1}</b>
            <h3 className="m-0 font-display text-xl font-medium uppercase leading-[normal] text-steel-blue">{title}</h3>
            <p className="mt-2.5 text-base leading-[1.55] text-slate-grey">{detail}</p>
          </div>
        ))}
        <Link className="action action-dark reveal mt-9" style={revealDelay(450)} to="/capabilities">
          Explore Capabilities <Arrow />
        </Link>
      </div>
    </section>
  )
}
