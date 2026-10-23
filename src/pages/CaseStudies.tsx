import { useEffect, useRef, useState } from 'react'
import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'
import CaseStudyCard from '@/components/sections/case-studies/CaseStudyCard'
import { caseStudies } from '@/data/case-studies'
import { revealDelay, useReveal } from '@/hooks/useReveal'
import { asset } from '@/utils/asset'

/** Load More appears only past this many projects; an even number keeps the two-column rows full. */
const INITIAL_COUNT = 8
const BATCH_SIZE = 8

export default function CaseStudies() {
  const [count, setCount] = useState(INITIAL_COUNT)
  const [announcement, setAnnouncement] = useState('')
  const cards = useRef(new Map<string, HTMLAnchorElement>())
  const focusAfterLoad = useRef<string | null>(null)
  const ref = useReveal<HTMLDivElement>([count])
  const shown = caseStudies.slice(0, count)

  // After Load More, move focus to the first new card.
  useEffect(() => {
    const slug = focusAfterLoad.current
    focusAfterLoad.current = null
    if (slug) cards.current.get(slug)?.focus()
  }, [count])

  const loadMore = () => {
    const added = caseStudies.slice(count, count + BATCH_SIZE)
    if (!added.length) return
    focusAfterLoad.current = added[0].slug
    setCount(count + BATCH_SIZE)
    setAnnouncement(`${added.length} more ${added.length === 1 ? 'case study' : 'case studies'} loaded`)
  }

  return (
    <MainLayout>
      <Seo
        title="Case Studies | ITUS Marine"
        description="Selected ITUS Marine vessel programmes, engineering projects and operational deployments across specialised maritime requirements."
      />
      <EditorialHero
        title="Proven in Real Operations."
        intro="Selected vessel programmes, engineering projects and operational deployments across specialised maritime requirements."
        compact
        // TODO: replace the poster with a frame from this video, and the label with a description of it.
        video={{
          src: asset('/videos/CaseStudy/case-study-hero.mp4'),
          poster: asset('/images/case-studies/amphibious-rescue-platform-1280.webp'),
          label: 'ITUS vessel in operation at sea',
          position: 'center',
        }}
      />
      <div ref={ref}>
        <section aria-label="All case studies" className="bg-polar-white pb-[110px] pt-16 sm:pt-20 lg:pb-[150px] lg:pt-[110px]">
          <div className="container-site">
            {/* Equal cards; from md the right column sits slightly lower for an editorial stagger. */}
            <ul
              className={`m-0 grid list-none grid-cols-1 gap-y-16 p-0 md:grid-cols-2 md:gap-x-[5%] md:gap-y-24 ${
                shown.length % 2 === 0 ? 'md:pb-24' : ''
              }`}
            >
              {shown.map((study, index) => (
                <li
                  key={study.slug}
                  className="reveal md:even:relative md:even:top-24"
                  style={revealDelay((index % 2) * 120)}
                >
                  <CaseStudyCard
                    study={study}
                    ref={(card) => {
                      if (card) cards.current.set(study.slug, card)
                      else cards.current.delete(study.slug)
                    }}
                  />
                </li>
              ))}
            </ul>
            {count < caseStudies.length && (
              <div className="mt-16 flex justify-center md:mt-20">
                <button type="button" className="action action-dark min-h-11 cursor-pointer" onClick={loadMore}>
                  Load More
                </button>
              </div>
            )}
            <p className="sr-only" role="status" aria-live="polite">
              {announcement}
            </p>
          </div>
        </section>
        <SimpleCta title="Discuss a Similar Requirement." primary={{ label: 'Start a Project', to: '/contact' }} />
      </div>
    </MainLayout>
  )
}
