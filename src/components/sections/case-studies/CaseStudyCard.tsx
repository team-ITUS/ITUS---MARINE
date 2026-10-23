import type { Ref } from 'react'
import { Link } from 'react-router-dom'
import type { CaseStudy } from '@/types'
import CaseStudyImage from './CaseStudyImage'

/** Two columns from md (container is at most 1280px, with a 5% gap), one column below. */
const SIZES = '(min-width: 1360px) 610px, (min-width: 768px) 46vw, calc(100vw - 32px)'

interface CaseStudyCardProps {
  study: CaseStudy
  ref?: Ref<HTMLAnchorElement>
}

/**
 * Listing card: photo, title, subtitle and CTA, all one link (one tab stop). Every card is identical in
 * size and treatment, so no project reads as featured.
 */
export default function CaseStudyCard({ study, ref }: CaseStudyCardProps) {
  return (
    <Link ref={ref} to={`/case-studies/${study.slug}`} className="group block text-carbon-black">
      <div className="aspect-[3/2] overflow-hidden bg-steel-blue">
        <CaseStudyImage
          study={study}
          sizes={SIZES}
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
      </div>
      <div className="border-b border-technical-border pb-7 pt-7 sm:pt-8">
        <h2 className="m-0 font-display text-[28px] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[clamp(28px,2.6vw,36px)]">
          {study.title}
        </h2>
        <p className="mb-0 mt-3 max-w-[520px] text-base leading-[1.6] text-slate-grey">{study.subtitle}</p>
        <span className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-ui text-steel-blue transition-colors duration-200 group-hover:text-carbon-black">
          View Case Study
          <span
            aria-hidden="true"
            className="text-oxide-red transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
