import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import VesselRow from '@/components/sections/VesselRow'
import { vesselFilters } from '@/data/navigation'
import { orderedVessels as vessels } from '@/data/vessels'
import type { VesselApplication } from '@/types'

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
      />
      <section className="vessel-controls">
        <div className="container">
          <label>
            <span>Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vessels…"
            />
          </label>
          <div className="filter-nav" aria-label="Filter vessels">
            {vesselFilters.map((item) => (
              <button
                type="button"
                key={item}
                className={filter === item ? 'active' : ''}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="vessel-index section-light">
        <div className="container">
          <div className="index-meta">
            <span>{String(shown.length).padStart(2, '0')} vessels</span>
          </div>
          {shown.length ? (
            <div className="vessel-rows">
              {shown.map((vessel, index) => (
                <VesselRow key={vessel.id} vessel={vessel} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No matching vessels.</h2>
              <p>Adjust the search or select another application.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}
