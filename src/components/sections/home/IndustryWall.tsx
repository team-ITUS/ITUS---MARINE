import { asset } from '@/utils/asset'
import SectionHeading from '@/components/common/SectionHeading'

const sectors = [
  'Government',
  'Commercial Marine',
  'Rescue & Emergency',
  'Tourism',
  'Resorts & Hospitality',
  'Ports & Harbours',
  'Water Parks',
  'Watersports',
  'Marinas',
  'Dive Operations',
  'Utility',
  'Coastal Security',
]

export default function IndustryWall() {
  return (
    <section className="industries section-light">
      <div className="container">
        <SectionHeading title={'Across the Maritime\nSpectrum.'} />
      </div>
      <img
        className="industry-wordmark"
        src={asset('/images/home/across-maritime-spectrum/typographic-rescue-boat-wordmark-1.svg')}
        alt={`Maritime sectors served: ${sectors.join(', ')}`}
      />
    </section>
  )
}
