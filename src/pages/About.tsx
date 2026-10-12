import { asset } from '@/utils/asset'
import EditorialHero from '@/components/common/EditorialHero'
import SectionHeading from '@/components/common/SectionHeading'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'

export default function About() {
  return (
    <MainLayout>
      <Seo
        title="About | ITUS Marine"
        description="Learn about ITUS Marine shipbuilding, marine engineering, systems integration and lifecycle support."
      />
      <EditorialHero
        title={
          <>
            Engineering Capability.
            <br />
            Marine Understanding.
          </>
        }
        intro="A vessel manufacturing and marine engineering organisation serving professional, commercial, emergency-response and leisure applications."
        compact
      />
      <section className="about-statement section-light">
        <div className="container">
          <b>01 / Who We Are</b>
          <p>
            We bring vessel manufacturing, marine engineering and operating
            understanding together to create platforms shaped by where they work
            and what they need to do.
          </p>
        </div>
      </section>
      <section className="about-story section-ivory">
        <div className="about-image-tall">
          <img src={asset('/images/about/10m-ambulance-boat-2.webp')} alt="ITUS marine vessel" />
        </div>
        <div className="about-copy">
          <h2>One integrated marine ecosystem.</h2>
          <p>
            ITUS coordinates hull construction, propulsion, electrical,
            navigation and vessel systems around the project requirement, then
            supports the platform beyond delivery.
          </p>
          <img src={asset('/images/about/bridge-erection-boat-3.webp')} alt="ITUS specialised marine craft" />
        </div>
      </section>
      <section className="about-sectors section-dark">
        <div className="container">
          <SectionHeading title="Different Waters. Different Work." />
          <p>
            Government / Commercial Marine / Rescue & Emergency / Ports &
            Harbours / Industrial & Utility / Tourism / Resorts & Hospitality /
            Water Parks / Watersports / Marinas / Dive Operations / Coastal
            Security
          </p>
        </div>
      </section>
      <SimpleCta title="Start a Conversation." />
    </MainLayout>
  )
}
