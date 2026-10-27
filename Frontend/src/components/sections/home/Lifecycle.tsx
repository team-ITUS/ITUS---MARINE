import SectionHeading from '@/components/common/SectionHeading'
import { revealDelay, useReveal } from '@/hooks/useReveal'

const stages = ['Build', 'Deliver', 'Service', 'Maintain', 'Refit', 'Overhaul']

/** Horizontal offset of each arrow inside its stage cell, as set in the Figma design. */
const arrowOffsets = ['left-[70%]', 'left-[74.55%]', 'left-[74.55%]', 'left-[79.09%]', 'left-[70%]']

export default function Lifecycle() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="bg-ice-grey py-[150px]">
      <div className="container-site">
        <div className="reveal">
          <SectionHeading title={'Sustained Capability Across\nthe Vessel Lifecycle.'} />
        </div>
        <div className="mt-[90px] grid grid-cols-2 border-y border-arctic-blue-grey/40 sm:grid-cols-3 lg:flex lg:items-center">
          {stages.map((stage, index) => (
            <div key={stage} style={revealDelay(index * 80)} className="reveal relative px-1.5 py-[34px] lg:flex-1">
              <span className="mb-4 block text-xs font-semibold leading-5 text-slate-grey">0{index + 1}</span>
              <strong className="relative -top-1 block h-[31.594px] font-display text-[clamp(18px,1.8vw,25px)] font-medium uppercase leading-[normal] text-steel-blue">
                {stage}
              </strong>
              {index < stages.length - 1 && (
                <i
                  className={`absolute top-[66.03px] text-base not-italic leading-[25.6px] text-oxide-red ${arrowOffsets[index]}`}
                >
                  →
                </i>
              )}
            </div>
          ))}
        </div>
        <p className="mt-7 text-[15px] leading-[1.7] text-slate-grey">
          Through-Life Support · Repairs & Refits · Dry Docking · Engine
          Overhaul · Water-Jet Overhaul · Preventive Maintenance
        </p>
      </div>
    </section>
  )
}
