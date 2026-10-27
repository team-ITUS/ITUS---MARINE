import { asset } from '@/utils/asset'
import SectionHeading from '@/components/common/SectionHeading'
import { useReveal } from '@/hooks/useReveal'

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
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="bg-polar-white py-40">
      <div className="container-site">
        <div className="reveal">
          <SectionHeading title={'Across the Maritime\nSpectrum.'} />
        </div>
      </div>
      <div
        className="wordmark-stage relative mx-auto w-[min(1444px,calc(100%-40px))]"
        onPointerMove={(e) => {
          if (e.pointerType === 'touch') return
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--px', String(((e.clientX - r.left) / r.width - 0.5) * 2))
          e.currentTarget.style.setProperty('--py', String(((e.clientY - r.top) / r.height - 0.5) * 2))
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty('--px', '0')
          e.currentTarget.style.setProperty('--py', '0')
        }}
      >
        <div className="wordmark-tilt">
          <div className="wordmark-float">
            <img
              className="reveal reveal-opacity block aspect-[2/1] h-auto w-full"
              src={asset('/images/home/across-maritime-spectrum/typographic-rescue-boat-wordmark-1.svg')}
              alt={`Maritime sectors served: ${sectors.join(', ')}`}
            />
          </div>
        </div>
        <div className="wordmark-waves" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
