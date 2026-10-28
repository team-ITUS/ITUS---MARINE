import { Link, useParams } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Label from '@/components/common/Label'
import SectionHeading from '@/components/common/SectionHeading'
import Seo from '@/components/common/Seo'
import SplitText from '@/components/common/SplitText'
import MainLayout from '@/components/layout/MainLayout'
import { getRelatedVessels, orderedVessels as vessels, pickSpecs } from '@/data/vessels'
import { revealDelay, useReveal } from '@/hooks/useReveal'
import { useParallax } from '@/hooks/useParallax'
import NotFound from './NotFound'

/** Large outlined section number used above the detail page headings. */
function SectionNumber({ children, className = '' }: { children: string; className?: string }) {
  return (
    <b className={`text-outline mb-[30px] block font-display text-[82px] font-medium leading-[.8] text-polar-white ${className}`}>
      {children}
    </b>
  )
}

const lineItem =
  "relative border-b border-technical-border py-[18px] pl-6 text-base leading-[1.4] text-slate-grey before:absolute before:left-0 before:font-semibold before:text-oxide-red before:content-['—']"
const specRow = 'grid grid-cols-1 gap-[7px] border-b border-technical-border py-[17px] sm:grid-cols-[1fr_1.2fr] sm:gap-[30px]'
const specRowMulti = 'grid grid-cols-1 gap-[7px] border-b border-technical-border py-[17px] sm:grid-cols-[.6fr_2fr] sm:gap-[30px]'

export default function VesselDetail() {
  const { slug } = useParams()
  const ref = useReveal<HTMLDivElement>([slug])
  const heroImageRef = useParallax<HTMLImageElement>(40, [slug])
  const vessel = vessels.find((item) => item.slug === slug)
  if (!vessel) return <NotFound />

  const rail = pickSpecs([
    ['LOA', vessel.length],
    ['Beam', vessel.beam],
    ['Draft', vessel.draft],
    ['Speed', vessel.speed],
    ['Capacity', vessel.capacity],
    ['Propulsion', vessel.propulsion],
  ])
  const related = getRelatedVessels(vessel)

  return (
    <MainLayout>
      <Seo title={`${vessel.name} | ITUS Marine`} description={vessel.shortDescription} />
      <div ref={ref} key={slug}>
      <section className="relative flex h-svh max-h-[1000px] min-h-[720px] items-end overflow-hidden bg-carbon-black text-white sm:min-h-[640px]">
        <img ref={heroImageRef} className="hero-bg absolute inset-0 h-full object-cover" src={vessel.heroImage} alt={`${vessel.name} at sea`} />
        {/* Phones stack the hero text higher up the photo, so the shade stays dense further up before fading. */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(14,20,24,.95),rgba(14,20,24,.85)_45%,rgba(14,20,24,.4)_66%,rgba(14,20,24,.05)_86%)] sm:bg-[linear-gradient(0deg,rgba(14,20,24,.95),rgba(14,20,24,.05)_78%)]" />
        <div className="container-site relative pb-[clamp(40px,7svh,75px)]">
          <div className="hero-reveal mb-[clamp(24px,4svh,42px)] flex gap-2.5 text-xs" style={revealDelay(150)}>
            <Link className="hover:opacity-80" to="/">Home</Link>
            <span>/</span>
            <Link className="hover:opacity-80" to="/vessels">Vessels</Link>
            <span>/</span>
            <b className="font-medium">{vessel.name}</b>
          </div>
          <div className="hero-reveal" style={revealDelay(250)}>
            <Label tone="light">Vessel / {String(vessel.brochureOrder).padStart(2, '0')}</Label>
            <small className="mt-7 block text-[13px] font-semibold uppercase tracking-[.06em] text-oxide-red">
              {vessel.category}
            </small>
          </div>
          <SplitText
            key={vessel.slug}
            tag="h1"
            text={vessel.name}
            splitType="chars"
            mask="chars"
            from={{ yPercent: 110 }}
            to={{ yPercent: 0 }}
            duration={0.9}
            delay={35}
            startDelay={350}
            ease="power4.out"
            threshold={0}
            rootMargin="0px"
            className="mb-[18px] mt-2.5 font-display text-[52px] font-semibold leading-[.92] tracking-[-.055em] sm:text-[clamp(56px,min(7vw,11svh),96px)]"
          />
          <p style={revealDelay(480)} className="hero-reveal max-w-[660px] text-[17px] leading-[1.65] text-ice-grey">{vessel.shortDescription}</p>
        </div>
      </section>
      <section className="border-b border-technical-border bg-white">
        {/* Phones and tablets wrap the specs into a grid so every value is on screen; lg keeps a single row. */}
        <div className="container-site grid grid-cols-2 max-lg:-mb-px max-sm:w-full sm:grid-cols-3 sm:border-l sm:border-technical-border lg:flex lg:overflow-x-auto">
          {rail.map(([label, value], i) => (
            <div
              key={label}
              style={revealDelay(i * 60)}
              className="reveal reveal-opacity border-b border-r border-technical-border px-4 py-6 max-sm:even:border-r-0 sm:px-[22px] sm:py-[31px] lg:min-w-[150px] lg:flex-1 lg:border-b-0"
            >
              <span className="mb-2 block text-xs uppercase tracking-[.05em] text-slate-grey">{label}</span>
              <strong className="font-display text-sm font-medium leading-[1.4] text-steel-blue">{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-polar-white py-[100px] md:py-[150px]">
        <div className="container-site grid grid-cols-1 gap-[60px] md:grid-cols-[.45fr_1.55fr] md:gap-[8%]">
          <div className="reveal">
            <SectionNumber>01</SectionNumber>
            <Label>Overview</Label>
          </div>
          <p style={revealDelay(100)} className="reveal m-0 font-display text-[26px] font-normal leading-[1.42] tracking-[-.025em] text-carbon-black sm:text-[clamp(26px,3vw,40px)]">
            {vessel.longDescription}
          </p>
        </div>
      </section>
      <section className="relative mx-auto h-[420px] w-[calc(100%-32px)] overflow-hidden bg-steel-blue sm:h-[min(72vw,850px)] sm:w-[calc(100%-10vw)]">
        <img
          className="reveal reveal-scale h-full object-cover"
          src={vessel.galleryImages[0] ?? vessel.heroImage}
          alt={`Profile of ${vessel.name}`}
        />
        
      </section>
      {(vessel.missionApplications.length > 0 || vessel.keyFeatures.length > 0) && (
        <section className="bg-polar-white py-[100px] md:py-40">
          <div className="container-site grid grid-cols-1 gap-[100px] md:grid-cols-2 md:gap-x-[10%] md:gap-y-0">
            {/* Both columns share three rows (number, heading, list) so the lists start on one line. */}
            <div className="md:row-span-3 md:grid md:grid-rows-subgrid md:content-start">
              <SectionNumber className="reveal">02</SectionNumber>
              <div className="reveal" style={revealDelay(80)}>
                <SectionHeading title={'Designed to\nPerform.'} />
              </div>
              <ul style={revealDelay(160)} className="reveal mt-10 list-none border-t border-technical-border p-0">
                {vessel.missionApplications.map((item) => (
                  <li key={item} className={lineItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {vessel.keyFeatures.length > 0 && (
              <div className="md:row-span-3 md:grid md:grid-rows-subgrid md:content-start">
                <SectionNumber className="reveal">03</SectionNumber>
                <div className="reveal" style={revealDelay(80)}>
                  <SectionHeading title={'Key\nFeatures.'} />
                </div>
                <ul style={revealDelay(160)} className="reveal mt-10 list-none border-t border-technical-border p-0">
                  {vessel.keyFeatures.map((item) => (
                    <li key={item} className={lineItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
      {vessel.technicalSpecs.length > 0 && (
        <section className="bg-polar-white py-[100px] md:py-40">
          <div className="container-site grid grid-cols-1 gap-[60px] md:grid-cols-[.75fr_1.25fr] md:gap-[10%]">
            <div className="reveal">
              <SectionNumber>04</SectionNumber>
              <SectionHeading
                title="Principal Data."
                intro="Verified vessel data reproduced from the approved ITUS boat catalogue."
              />
            </div>
            <div style={revealDelay(120)} className="reveal border-t-2 border-steel-blue">
              {vessel.technicalSpecs.map((spec) => (
                <div key={spec.label} className={Array.isArray(spec.value) ? specRowMulti : specRow}>
                  <span className="text-sm text-slate-grey">{spec.label}</span>
                  {Array.isArray(spec.value) ? (
                    <div className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-4">
                      {spec.value.map((v, i) => (
                        <strong key={i} className="text-sm font-medium leading-normal text-carbon-black">{v}</strong>
                      ))}
                    </div>
                  ) : (
                    <strong className="text-sm font-medium leading-normal text-carbon-black">{spec.value}</strong>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="bg-carbon-black py-[145px] text-white">
          <div className="container-site">
            <div className="reveal">
              <SectionHeading title="Continue the Index." />
            </div>
            <div className="mt-[70px] grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {related.map((item, i) => (
                <Link
                  key={item.id}
                  to={`/vessels/${item.slug}`}
                  style={revealDelay(i * 90)}
                  className="reveal grid grid-cols-[32px_1fr_auto] items-center gap-2.5 text-white"
                >
                  <img className="col-span-3 mb-[18px] h-[280px] object-cover" src={item.heroImage} alt={item.name} />
                  <span className="text-xs font-semibold text-oxide-red">
                    {String(item.brochureOrder).padStart(2, '0')}
                  </span>
                  <h3 className="m-0 font-display text-xl font-medium leading-[normal] text-white">{item.name}</h3>
                  <Arrow className="text-oxide-red" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="bg-steel-blue py-[115px] text-white">
        <div className="container-site">
          <h2 className="reveal mb-0 mt-[22px] font-display text-[clamp(42px,5vw,66px)] font-semibold leading-[normal] tracking-display">
            Interested in this platform?
          </h2>
          <div className="reveal mt-8 sm:mt-10" style={revealDelay(100)}>
            <Link className="btn btn-primary" to="/contact">
              Discuss This Vessel <Arrow />
            </Link>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  )
}
