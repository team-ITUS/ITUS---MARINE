import type { CSSProperties } from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import TimelineBoat, { SAIL_START, SAIL_STEP } from '@/components/sections/home/TimelineBoat'
import { useReveal } from '@/hooks/useReveal'

const processStages = [
  'Hull Moulding & Assembly',
  'Aluminium Fabrication',
  'FRP Boat Manufacturing',
  'Mechanical & Propulsion Integration',
  'Electrical & Navigation Integration',
  'Sea Trials & Commissioning',
]

export default function BuildTimeline() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="relative overflow-hidden bg-carbon-black pb-[175px] pt-[150px] text-white">
      <div
        className="draft-grid bg-no-repeat [background-image:linear-gradient(180deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:100%_100%]"
        aria-hidden="true"
      />
      <div className="container-site relative">
        <div className="reveal">
          <SectionHeading title={'Building to\nCommissioning.'} />
        </div>
        <div className="relative mt-[100px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 lg:border-t lg:border-transparent">
          <TimelineBoat />
          {processStages.map((stage, index) => (
            <div
              key={stage}
              /* Phones and tablets keep the short stagger; on lg each stage reveals as the boat reaches its marker. */
              style={{ '--d-sm': `${150 + index * 80}ms`, '--d-lg': `${SAIL_START + index * SAIL_STEP - 200}ms` } as CSSProperties}
              className="reveal timeline-stage relative min-h-40 border-t border-steel-blue pb-9 pl-3.5 pr-5 pt-9 sm:min-h-[220px] sm:pb-0 sm:pl-0 lg:border-t-0"
            >
              <b className="block font-display text-[64px] font-medium leading-[normal] text-oxide-red">0{index + 1}</b>
              <i className="absolute -top-[5px] left-0 h-[9px] w-[9px] rotate-45 border border-oxide-red bg-oxide-red" />
              <span className="block max-w-[175px] font-display text-lg font-medium leading-[1.35] text-ice-grey">
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
