import { asset } from '@/utils/asset'
import { useState } from 'react'
import type { FormEvent } from 'react'
import FormField, { fieldClass } from '@/components/common/FormField'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import EnquirySent from '@/components/sections/contact/EnquirySent'
import { revealDelay, useReveal } from '@/hooks/useReveal'

const office = 'border-t border-technical-border pt-5'
const officeNumber = 'text-xs font-semibold text-oxide-red'
const officeName = 'mb-2 mt-4 block font-display text-[17px] font-medium leading-[normal] text-carbon-black'

export default function Contact() {
  const ref = useReveal<HTMLElement>()

  const [sent, setSent] = useState(false)

  // No backend is connected: a valid form just shows the success state.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (event.currentTarget.reportValidity()) setSent(true)
  }

  return (
    <MainLayout>
      <Seo
        title="Contact | ITUS Marine"
        description="Contact ITUS Marine about vessel requirements, marine systems, propulsion and lifecycle support."
      />
      {/* Desktop: exactly one screen tall, so the form sits beside the photo without scrolling. */}
      <section ref={ref} className="grid min-h-screen grid-cols-1 bg-white md:h-screen md:min-h-[640px] md:grid-cols-[45%_55%]">
        <div className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:h-full after:absolute after:inset-0 after:bg-[linear-gradient(0deg,rgba(14,20,24,.6),transparent_55%)] after:content-['']">
          <img className="hero-bg h-full object-cover" src={asset('/images/contact/amphibious-boat-4.webp')} alt="ITUS marine team vessel" />
        </div>
        {/* Top padding clears the fixed header (76px); content is centred in the space below it. */}
        <div className="bg-polar-white px-6 pb-20 pt-[95px] sm:px-[6vw] sm:pb-[100px] sm:pt-[100px] md:flex md:flex-col md:justify-center md:px-[5vw] md:pb-[clamp(24px,4vh,48px)] md:pt-[calc(76px_+_clamp(24px,4vh,48px))] lg:px-[7vw]">
          <div className="w-full max-w-[640px] text-left md:mx-auto">
          <h1 className="reveal mb-[55px] font-display text-[49px] font-semibold leading-[.95] tracking-[-.05em] text-carbon-black sm:text-[clamp(52px,5vw,74px)] md:mb-[clamp(24px,4.5vh,48px)] md:text-center md:text-[clamp(40px,min(4.4vw,7vh),64px)]">
            Talk to Our Marine Team.
          </h1>
          <br />

          {sent ? (
            <EnquirySent onReset={() => setSent(false)} />
          ) : (
            <form style={revealDelay(100)} className="reveal flex flex-col gap-y-6 md:gap-y-[clamp(12px,2.2vh,24px)]" onSubmit={submit}>
              <FormField label="Name">
                <input className={fieldClass} name="name" required autoComplete="name" />
              </FormField>
              <FormField label="Organisation">
                <input className={fieldClass} name="organisation" required autoComplete="organization" />
              </FormField>
              {/* Side by side from sm up so the extra field doesn't push the form past one screen. */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <FormField label="Contact Number">
                  <input
                    className={fieldClass}
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="[0-9+()\- ]{7,20}"
                    title="Enter a valid contact number"
                  />
                </FormField>
                <FormField label="Email">
                  <input className={fieldClass} name="email" required type="email" autoComplete="email" />
                </FormField>
              </div>
              <FormField label="Message">
                <textarea className={`${fieldClass} resize-none`} name="message" required rows={3} />
              </FormField>
              <button className="btn btn-primary mt-2 w-fit md:self-center" type="submit">
                Send Enquiry
              </button>
            </form>
          )}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
