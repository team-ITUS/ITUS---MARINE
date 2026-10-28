import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import SectionHeading from '@/components/common/SectionHeading'
import { orderedVessels as vessels } from '@/data/vessels'
import { revealDelay, useReveal } from '@/hooks/useReveal'

export default function RangePreview() {
  const ref = useReveal<HTMLElement>()
  const range = vessels.filter((vessel) => vessel.brochureOrder >= 5)
  return (
    <section ref={ref} className="bg-range-bg pb-[100px] pt-[60px] md:pb-[150px] md:pt-[90px]">
      <div className="container-site">
        <div className="flex flex-col items-start gap-[30px] md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="reveal">
            <SectionHeading title={'Comprehensive\nVessel Portfolio.'} />
          </div>
          <Link className="action action-dark reveal" style={revealDelay(120)} to="/vessels">
            View All Vessels <Arrow />
          </Link>
        </div>
        <div className="mt-[75px] grid grid-cols-1 border-t border-technical-border lg:grid-cols-2">
          {range.map((vessel, index) => (
            <Link
              key={vessel.id}
              to={`/vessels/${vessel.slug}`}
              style={revealDelay((index % 2) * 70)}
              className="reveal group grid min-h-[110px] grid-cols-[28px_88px_1fr_auto] grid-rows-2 items-center gap-x-3 border-b border-technical-border py-4 pr-0 transition-[background-color,padding] duration-200 hover:bg-ice-grey hover:pr-[30px] sm:min-h-[145px] sm:grid-cols-[44px_132px_1fr_auto] sm:gap-x-6 sm:pr-5 lg:odd:border-r lg:even:pl-5"
            >
              <span className="row-span-2 text-[13px] font-semibold text-oxide-red">
                {String(vessel.brochureOrder).padStart(2, '0')}
              </span>
              <img className="row-span-2 h-[68px] object-cover sm:h-24" src={vessel.heroImage} alt={vessel.name} loading="lazy" decoding="async" />
              <strong className="self-end font-display text-lg font-semibold leading-[normal] text-carbon-black sm:text-[21px]">
                {vessel.name}
              </strong>
              <small className="self-start text-[13px] tracking-[.03em] text-slate-grey">{vessel.category}</small>
              <Arrow className="row-span-2 text-lg text-steel-blue transition-colors duration-200 group-hover:text-oxide-red" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
