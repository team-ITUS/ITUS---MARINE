import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'
import CapabilityChapter from '@/components/sections/CapabilityChapter'
import { capabilityChapters } from '@/data/capabilities'

export default function Capabilities() {
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
      />
      <nav className="chapter-nav" aria-label="Capability chapters">
        <div className="container">
          {capabilityChapters.map((chapter, index) => (
            <a key={chapter.id} href={`#${chapter.id}`}>
              <span>0{index + 1}</span>
              {chapter.title.replace('.', '')}
            </a>
          ))}
        </div>
      </nav>
      <div className="chapters">
        {capabilityChapters.map((chapter, index) => (
          <CapabilityChapter key={chapter.id} chapter={chapter} index={index} />
        ))}
      </div>
      <SimpleCta title="Discuss a Vessel Project." />
    </MainLayout>
  )
}
