import SectionHeading from '@/components/common/SectionHeading'

const stages = ['Build', 'Deliver', 'Service', 'Maintain', 'Refit', 'Overhaul']

export default function Lifecycle() {
  return (
    <section className="lifecycle section-ice">
      <div className="container">
        <SectionHeading title={'Sustained Capability Across\nthe Vessel Lifecycle.'} />
        <div className="lifecycle-journey">
          {stages.map((stage, index) => (
            <div key={stage}>
              <span>0{index + 1}</span>
              <strong>{stage}</strong>
              {index < stages.length - 1 && <i>→</i>}
            </div>
          ))}
        </div>
        <p className="lifecycle-notes">
          Through-Life Support · Repairs & Refits · Dry Docking · Engine
          Overhaul · Water-Jet Overhaul · Preventive Maintenance
        </p>
      </div>
    </section>
  )
}
