import { asset } from '@/utils/asset'
import type { FormEvent } from 'react'
import FormField, { fieldClass } from '@/components/common/FormField'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { revealDelay, useReveal } from '@/hooks/useReveal'

const topics = [
  'Vessel Requirement',
  'Custom Vessel Project',
  'Propulsion',
  'Marine Systems',
  'Lifecycle Support',
  'Commercial / Tourism Vessel',
  'General Marine Enquiry',
]

const office = 'border-t border-technical-border pt-5'
const officeNumber = 'text-xs font-semibold text-oxide-red'
const officeName = 'mb-2 mt-4 block font-display text-[17px] font-medium leading-[normal] text-carbon-black'

export default function Contact() {
  const ref = useReveal<HTMLElement>()

  // No backend is connected: the form only runs browser validation.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reportValidity()
  }

  return (
    <MainLayout>
      <Seo
        title="Contact | ITUS Marine"
        description="Contact ITUS Marine about vessel requirements, marine systems, propulsion and lifecycle support."
      />
      <section ref={ref} className="grid min-h-screen grid-cols-1 bg-white md:grid-cols-[45%_55%]">
        <div className="relative h-[60vh] overflow-hidden sm:h-[70vh] md:sticky md:top-0 md:h-screen after:absolute after:inset-0 after:bg-[linear-gradient(0deg,rgba(14,20,24,.6),transparent_55%)] after:content-['']">
          <img className="hero-bg h-full object-cover" src={asset('/images/contact/amphibious-boat-4.webp')} alt="ITUS marine team vessel" />
          <span className="absolute bottom-[26px] left-7 z-[2] bg-carbon-black/80 px-3 py-2 text-xs uppercase tracking-[.05em] text-white">
            ITUS / CONTACT / MARINE
          </span>
        </div>
        <div className="bg-polar-white px-6 pb-20 pt-[95px] sm:px-[6vw] sm:pb-[100px] sm:pt-[100px] md:px-[5vw] md:pt-[150px] lg:pl-[7vw] lg:pr-[8vw]">
          <h1 className="reveal mb-[55px] font-display text-[49px] font-semibold leading-[.95] tracking-[-.05em] text-carbon-black sm:text-[clamp(52px,5vw,74px)]">
            Talk to Our Marine Team.
          </h1>
          <div className="mb-[70px] grid grid-cols-1 gap-[35px] sm:grid-cols-2">
            <div className={`reveal ${office}`} style={revealDelay(100)}>
              <span className={officeNumber}>01</span>
              <strong className={officeName}>Corporate / Business Office</strong>
            </div>
            <div className={`reveal ${office}`} style={revealDelay(180)}>
              <span className={officeNumber}>02</span>
              <strong className={officeName}>Shipyard / Manufacturing</strong>
            </div>
          </div>
          <form style={revealDelay(100)} className="reveal grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2" onSubmit={submit}>
            <FormField label="Enquiry Topic">
              <select className={fieldClass} required defaultValue="">
                <option value="">Select a topic</option>
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Name">
              <input className={fieldClass} required autoComplete="name" />
            </FormField>
            <FormField label="Email">
              <input className={fieldClass} required type="email" autoComplete="email" />
            </FormField>
            <FormField label="Message" wide>
              <textarea className={fieldClass} required rows={4} />
            </FormField>
            <button className="btn btn-primary w-fit" type="submit">
              Send Enquiry
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  )
}
