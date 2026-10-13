import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import VesselRow from '@/components/sections/VesselRow'
import { vesselFilters } from '@/data/navigation'
import { orderedVessels as vessels } from '@/data/vessels'
import { revealDelay, useReveal } from '@/hooks/useReveal'
import type { VesselApplication } from '@/types'
import { asset } from '@/utils/asset'

export default function Vessels() {
  const location = useLocation()
  const initial = new URLSearchParams(location.search).get('filter') || 'All'
  const [filter, setFilter] = useState(initial)
  const [search, setSearch] = useState('')

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase()
    return vessels.filter((vessel) => {
      const categoryMatch =
        filter === 'All' ||
        vessel.applicationTags?.includes(filter as VesselApplication)
      const searchMatch =
        !term ||
        vessel.name.toLowerCase().includes(term) ||
        vessel.shortDescription.toLowerCase().includes(term) ||
        vessel.missionApplications.some((item) => item.toLowerCase().includes(term))
      return categoryMatch && searchMatch
    })
  }, [filter, search])

  const ref = useReveal<HTMLDivElement>([shown])
  const barRef = useRef<HTMLElement>(null)
  const resultsRef = useRef<HTMLElement>(null)

  /** Bring the start of the results into view, below the fixed header and (on lg) the sticky filter bar. */
  const scrollToResults = () => {
    const results = resultsRef.current
    const bar = barRef.current
    if (!results || !bar) return
    const header = document.querySelector('header')?.offsetHeight ?? 0
    const sticky = getComputedStyle(bar).position === 'sticky' ? bar.offsetHeight : 0
    window.scrollTo({ top: results.getBoundingClientRect().top + window.scrollY - header - sticky })
  }

  const selectFilter = (item: string) => {
    setFilter(item)
    scrollToResults()
  }

  return (
    <MainLayout>
      <Seo
        title="Vessels | ITUS Marine"
        description="Explore ITUS purpose-built vessel platforms across professional, commercial, emergency-response and leisure marine applications."
      />
      <EditorialHero
        title="Purpose-Built Platforms."
        intro="Explore ITUS vessel platforms across professional, commercial, emergency-response and specialised marine applications."
        compact
        video={{
          src: asset('/videos/VesselHero/vessel-hero.mp4'),
          poster: asset('/videos/VesselHero/vessel-hero-poster.jpg'),
          label: 'ITUS vessel cruising on open water',
          position: '60% center',
        }}
      />
      <div ref={ref}>
      <section ref={barRef} className="top-[76px] z-20 border-b border-technical-border bg-white lg:sticky">
        <div className="hero-reveal container-site flex flex-col gap-4 py-5" style={revealDelay(450)}>
          <label className="relative block w-full max-w-[420px]">
            <span className="sr-only">Search</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-grey"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="h-12 w-full rounded-full border border-technical-border bg-polar-white pl-11 pr-5 text-base text-carbon-black outline-none transition-colors placeholder:text-slate-grey focus:border-steel-blue focus:bg-white"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vessels…"
            />
          </label>
          <div className="flex flex-wrap gap-2 xl:flex-nowrap" aria-label="Filter vessels">
            {vesselFilters.map((item) => (
              <button
                type="button"
                key={item}
                className={`min-h-11 cursor-pointer whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 ${
                  filter === item
                    ? 'border-carbon-black bg-carbon-black text-white'
                    : 'border-technical-border bg-transparent text-slate-grey hover:border-steel-blue hover:text-carbon-black'
                }`}
                onClick={() => selectFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section ref={resultsRef} className="bg-polar-white pb-[150px] pt-20">
        <div className="container-site">
          <div className="mb-[55px] flex justify-between text-[13px] uppercase tracking-[.04em] text-slate-grey">
            <span>{String(shown.length).padStart(2, '0')} vessels</span>
          </div>
          {shown.length ? (
            <div className="flex flex-col gap-[100px] sm:gap-[130px]">
              {shown.map((vessel, index) => (
                <VesselRow key={vessel.id} vessel={vessel} index={index} />
              ))}
            </div>
          ) : (
            <div className="hero-reveal py-[100px] text-center">
              <h2 className="font-display text-[42px] font-semibold leading-[normal] text-carbon-black">
                No matching vessels.
              </h2>
              <p className="text-slate-grey">Adjust the search or select another application.</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </MainLayout>
  )
}
