import { useRef } from 'react'
import type { MouseEvent } from 'react'
import Label from '@/components/common/Label'
import PatrolCraft from '@/components/common/PatrolCraft'
import ProfileForm from '@/components/sections/contact/ProfileForm'
import { revealDelay, useReveal } from '@/hooks/useReveal'
import { asset } from '@/utils/asset'

/**
 * Join Us at the foot of the Contact page: a dark intro (copy left, fabrication photo right; stacked on mobile) and
 * the light "Submit Your Profile" form below it. The intro CTA scrolls to this form, never the enquiry form above,
 * then moves focus to the form heading.
 */
export default function JoinUs() {
  const introRef = useReveal<HTMLElement>()
  const formRef = useReveal<HTMLElement>()
  const headingRef = useRef<HTMLHeadingElement>(null)

  const toForm = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    formRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <section ref={introRef} className="join-section relative overflow-hidden pt-[100px] text-white sm:pt-[130px] md:pt-[clamp(40px,7svh,130px)]" aria-labelledby="join-title">
        <div className="draft-grid" aria-hidden="true" />
        <div className="join-currents reveal reveal-opacity" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="container-site relative grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-[6%] lg:gap-x-[8%]">
          <div>
            <div className="reveal">
              <Label tone="light">Join Us</Label>
            </div>
            <h2
              id="join-title"
              style={revealDelay(80)}
              className="reveal mb-8 mt-7 font-display text-[40px] font-semibold leading-[.98] tracking-display text-white sm:text-[clamp(44px,4.6vw,64px)]"
            >
              Interested in Working With ITUS Marine?
            </h2>
            <div style={revealDelay(160)} className="reveal max-w-[540px] space-y-5 text-[17px] leading-[1.65] text-ice-grey">
              <p>
                We’re always open to connecting with skilled professionals across marine, engineering, technical and
                operational domains.
              </p>
              <p>
                Share your details and experience with us. If your profile matches a current or upcoming requirement,
                our team will get in touch.
              </p>
            </div>
            <a style={revealDelay(240)} className="reveal btn btn-primary mt-10" href="#submit-profile" onClick={toForm}>
              Submit Your Profile <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="relative h-[340px] overflow-hidden border-t border-dark-steel-border sm:h-[480px] md:h-[clamp(280px,calc(100svh_-_330px),600px)]">
            <img
              className="reveal reveal-scale h-full object-cover"
              src={asset('/images/capabilities/engineering-integration.webp')}
              alt="ITUS Marine fabrication team welding an aluminium vessel hull in the shipyard"
              loading="lazy"
            />
          </div>
        </div>

        {/* Sea along the bottom of the intro, with the patrol craft floating at anchor on the right. From md, the top
            padding, photo and boat strip scale with the viewport height so the section fits a laptop screen. */}
        <div className="join-lane" aria-hidden="true">
          <span className="join-sea" />
          <div style={revealDelay(350)} className="join-anchor reveal reveal-opacity">
            <div className="join-boat">
              <div className="join-boat-bob">
                <PatrolCraft className="block h-auto w-full" beaconClassName="enquiry-beacon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={formRef} id="submit-profile" className="scroll-mt-[76px] bg-polar-white py-[100px] sm:py-[130px]" aria-labelledby="profile-title">
        <div className="container-site grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-x-[8%]">
          <div>
            <div className="reveal">
              <Label>Application</Label>
            </div>
            <h2
              ref={headingRef}
              id="profile-title"
              tabIndex={-1}
              style={revealDelay(80)}
              className="reveal mb-6 mt-7 font-display text-[36px] font-semibold leading-[.98] tracking-display text-carbon-black sm:text-[clamp(40px,4vw,56px)]"
            >
              Submit Your Profile
            </h2>
          </div>
          <ProfileForm />
        </div>
      </section>
    </>
  )
}
