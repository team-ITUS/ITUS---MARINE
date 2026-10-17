import { asset } from '@/utils/asset'
import EditorialHero from '@/components/common/EditorialHero'
import SectionHeading from '@/components/common/SectionHeading'
import Seo from '@/components/common/Seo'
import SimpleCta from '@/components/common/SimpleCta'
import MainLayout from '@/components/layout/MainLayout'
import { revealDelay, useReveal } from '@/hooks/useReveal'

export default function About() {
  const ref = useReveal<HTMLDivElement>()
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
        video={{
          src: asset('/videos/About/about-hero.mp4'),
          poster: asset('/videos/About/about-hero-poster.jpg'),
          label: 'Boat resting on a beach at dusk',
          position: '35% center',
        }}
      />
      <div ref={ref}>
      <section className="bg-polar-white py-[100px] md:py-40">
        <div className="container-site grid grid-cols-1 gap-[45px] md:grid-cols-[.35fr_1.65fr] md:gap-[8%]">
          <b className="reveal text-xs font-semibold uppercase tracking-[.06em] text-oxide-red">01 / Who We Are</b>
          <p style={revealDelay(100)} className="reveal m-0 font-display text-[34px] font-normal leading-[1.2] tracking-[-.04em] text-carbon-black sm:text-[clamp(32px,4.2vw,58px)]">
            We bring vessel manufacturing, marine engineering and operating
            understanding together to create platforms shaped by where they work
            and what they need to do.
          </p>
        </div>
      </section>
      <section className="@container grid min-h-[920px] grid-cols-1 bg-polar-white md:grid-cols-[1.15fr_.85fr]">
        <div className="h-[480px] overflow-hidden sm:h-[700px] md:h-auto">
          <img
            className="reveal reveal-scale h-full object-cover"
            src={asset('/images/about/10m-ambulance-boat-2.webp')}
            alt="ITUS marine vessel"
          />
        </div>
        {/* Right edge lines up with the header container (and its Rescue Products button). */}
        {/* Phones: 16px site gutter and a short gap under the photo so the heading reads with it. */}
        <div className="px-4 pb-[90px] pt-12 sm:px-[7vw] sm:py-[120px] md:pl-[5vw] md:pr-[max(40px,calc((100cqw-1280px)/2))]">
          <h2 className="reveal mb-[30px] mt-0 font-display sm:mt-[30px] text-[clamp(42px,4vw,60px)] font-semibold leading-none tracking-[-.04em] text-carbon-black">
            One integrated marine ecosystem.
          </h2>
          <p style={revealDelay(100)} className="reveal text-[17px] leading-[1.7] text-slate-grey">
            ITUS coordinates hull construction, propulsion, electrical,
            navigation and vessel systems around the project requirement, then
            supports the platform beyond delivery.
          </p>
          <img
            style={revealDelay(200)}
            className="reveal reveal-opacity mt-[70px] h-[280px] object-cover"
            src={asset('/images/about/bridge-erection-boat-3.webp')}
            alt="ITUS specialised marine craft"
          />
        </div>
      </section>
      <section className="bg-carbon-black py-[140px] text-white">
        <div className="container-site">
          <div className="reveal">
            <SectionHeading title="Different Waters. Different Work." />
          </div>
          <p style={revealDelay(120)} className="reveal mt-[65px] max-w-[1150px] font-display text-[clamp(20px,2.6vw,36px)] font-medium uppercase leading-[1.6] text-ice-grey">
            Government / Commercial Marine / Rescue & Emergency / Ports &
            Harbours / Industrial & Utility / Tourism / Resorts & Hospitality /
            Water Parks / Watersports / Marinas / Dive Operations / Coastal
            Security
          </p>
        </div>
      </section>
      <SimpleCta title="Start a Conversation." />
      </div>
    </MainLayout>
  )
}
