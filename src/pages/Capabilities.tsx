import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'
import CapabilityChapter from '@/components/sections/CapabilityChapter'
import { capabilityChapters } from '@/data/capabilities'
import { useReveal } from '@/hooks/useReveal'
import { asset } from '@/utils/asset'

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
        video={{
          src: asset('/videos/Capabilties/capabilities-hero.mp4'),
          poster: asset('/videos/Capabilties/capabilities-hero-poster.jpg'),
          label: 'Work boats moored in a harbour at sunset',
          position: '48% center',
        }}
      />
      {/* Phones and tablets show every chapter in a static grid; lg pins them as one sticky row. */}
      <nav
        className="relative z-20 border-b border-technical-border bg-white lg:sticky lg:top-[76px]"
        aria-label="Capability chapters"
      >
        <div className="container-site grid grid-cols-2 max-lg:-mb-px max-sm:w-full sm:grid-cols-5 sm:border-l sm:border-technical-border lg:flex lg:overflow-x-auto lg:[scrollbar-width:none]">
          {capabilityChapters.map((chapter, index) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className="border-b border-r border-technical-border px-4 py-5 text-[13px] uppercase leading-[1.4] tracking-[.03em] text-steel-blue hover:bg-ice-grey hover:text-carbon-black max-sm:even:border-r-0 max-sm:last:odd:col-span-2 max-sm:last:odd:border-r-0lg:min-w-[170px] lg:flex-auto lg:shrink-0 lg:whitespace-nowrap lg:border-b-0 lg:py-6 lg:leading-normal"
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
