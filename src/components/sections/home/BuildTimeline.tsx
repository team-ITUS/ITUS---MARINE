import SectionHeading from '@/components/common/SectionHeading'

const processStages = [
  'Hull Moulding & Assembly',
  'Aluminium Fabrication',
  'FRP Boat Manufacturing',
  'Mechanical & Propulsion Integration',
  'Electrical & Navigation Integration',
  'Sea Trials & Commissioning',
]

export default function BuildTimeline() {
  return (
    <section className="build-timeline section-dark">
      <div className="draft-grid" aria-hidden="true" />
      <div className="container">
        <SectionHeading title={'Building to\nCommissioning.'} />
        <div className="timeline">
          {processStages.map((stage, index) => (
            <div key={stage}>
              <b>0{index + 1}</b>
              <i />
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
