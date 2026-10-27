import { Link, useParams } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import CaseStudyImage from '@/components/sections/case-studies/CaseStudyImage'
import { caseStudies, caseStudyRows } from '@/data/case-studies'
import { revealDelay, useReveal } from '@/hooks/useReveal'
import { asset } from '@/utils/asset'
import NotFound from './NotFound'

const sectionLabel = 'mb-8 mt-0 flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-label text-steel-blue'

/**
 * Case study page: title, subtitle, hero image, project data and an optional short overview.
 * The data grid lists only the fields the project has; a lone last field spans both columns.
 */
export default function CaseStudyDetail() {
  const { slug } = useParams()
  const ref = useReveal<HTMLDivElement>([slug])
  const study = caseStudies.find((item) => item.slug === slug)
  if (!study) return <NotFound />

  const rows = caseStudyRows(study.data)
  const overview = study.overview?.trim()

  return (
    <MainLayout>
      <Seo title={`${study.title} | ITUS Marine`} description={study.subtitle} image={asset(study.coverImage)} />
      <div ref={ref} key={slug}>
        <section className="relative overflow-hidden bg-steel-blue pb-[clamp(120px,16vw,220px)] pt-[130px] text-white sm:pt-[150px]">
          <div className="draft-grid" aria-hidden="true" />
          <div className="container-site relative">
            <Link
              to="/case-studies"
              className="hero-reveal group inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-ui text-ice-grey transition-colors duration-200 hover:text-white"
              style={revealDelay(50)}
            >
              <span
                aria-hidden="true"
                className="text-oxide-red transition-transform duration-300 group-hover:-translate-x-1.5"
              >
                ←
              </span>
              All Case Studies
            </Link>
            <h1
              style={revealDelay(150)}
              className="hero-reveal mb-[22px] mt-8 max-w-[1050px] font-display text-[46px] font-semibold leading-[.94] tracking-[-.05em] sm:text-[clamp(52px,6vw,84px)]"
            >
              {study.title}
            </h1>
            <p className="hero-reveal m-0 max-w-[680px] text-[17px] leading-[1.65] text-ice-grey" style={revealDelay(300)}>
              {study.subtitle}
            </p>
          </div>
        </section>
        {/* The photo overlaps the end of the title band. */}
        <div className={`bg-polar-white ${rows.length || overview ? '' : 'pb-[110px] md:pb-[150px]'}`}>
          <div className="container-site -mt-[clamp(80px,12vw,170px)]">
            <div className="hero-reveal relative aspect-video overflow-hidden bg-carbon-black" style={revealDelay(400)}>
              <CaseStudyImage study={study} sizes="(min-width: 1360px) 1280px, 100vw" eager />
            </div>
          </div>
        </div>
        {(rows.length > 0 || overview) && (
          <div className="bg-polar-white pb-[110px] pt-[80px] md:pb-[150px] md:pt-[110px]">
            {rows.length > 0 && (
              <section aria-labelledby="project-data" className="container-site">
                <h2 id="project-data" className={`reveal ${sectionLabel}`}>
                  <i className="block h-px w-7 bg-current" aria-hidden="true" />
                  Project Data
                </h2>
                <dl style={revealDelay(100)} className="reveal m-0 grid grid-cols-1 border-t-2 border-steel-blue md:grid-cols-2">
                  {rows.map(([label, value]) => (
                    <div
                      key={label}
                      className="border-b border-technical-border py-6 md:odd:pr-10 md:even:pl-10 md:odd:last:col-span-2"
                    >
                      <dt className="text-xs font-medium uppercase tracking-label text-slate-grey">{label}</dt>
                      <dd className="m-0 mt-2 text-lg font-medium leading-[1.45] text-carbon-black">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            {overview && (
              <section
                aria-labelledby="project-overview"
                className={`container-site ${rows.length > 0 ? 'mt-[80px] md:mt-[110px]' : ''}`}
              >
                <h2 id="project-overview" className={`reveal ${sectionLabel}`}>
                  <i className="block h-px w-7 bg-current" aria-hidden="true" />
                  About the Project
                </h2>
                <p
                  style={revealDelay(100)}
                  className="reveal m-0 max-w-[900px] font-display text-[22px] font-normal leading-[1.45] tracking-[-.02em] text-carbon-black sm:text-[clamp(24px,2.4vw,32px)]"
                >
                  {overview}
                </p>
              </section>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
