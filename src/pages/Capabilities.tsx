import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'
import CapabilityChapter from '@/components/sections/CapabilityChapter'
import { capabilityChapters } from '@/data/capabilities'
import { useReveal } from '@/hooks/useReveal'

export default function Capabilities() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <MainLayout>
      <Seo
        title="Capabilities | ITUS Marine"
        description="Integrated shipbuilding, marine engineering, systems integration, commissioning and lifecycle support."
      />
      <EditorialHero
        title={
          <>
            Structure
            <br />
            to Systems.
          </>
        }
        intro="Integrated shipbuilding, marine engineering, systems integration, commissioning and lifecycle support."
        compact
      />
      <nav
        className="sticky top-[70px] z-20 border-b border-technical-border bg-white sm:top-[76px]"
        aria-label="Capability chapters"
      >
        <div className="container-site flex overflow-x-auto [scrollbar-width:none]">
          {capabilityChapters.map((chapter, index) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className="min-w-[170px] flex-auto shrink-0 whitespace-nowrap border-r border-technical-border px-4 py-6 text-[13px] uppercase tracking-[.03em] text-steel-blue first:border-l hover:bg-ice-grey hover:text-carbon-black"
            >
              <span className="mb-[7px] block font-semibold text-oxide-red">0{index + 1}</span>
              {chapter.title.replace('.', '')}
            </a>
          ))}
        </div>
      </nav>
      <div ref={ref}>
        {capabilityChapters.map((chapter, index) => (
          <CapabilityChapter key={chapter.id} chapter={chapter} index={index} />
        ))}
        <SimpleCta title="Discuss a Vessel Project." />
      </div>
    </MainLayout>
  )
}
