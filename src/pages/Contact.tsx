import type { FormEvent } from 'react'
import FormField from '@/components/common/FormField'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'

const topics = [
  'Vessel Requirement',
  'Custom Vessel Project',
  'Propulsion',
  'Marine Systems',
  'Lifecycle Support',
  'Commercial / Tourism Vessel',
  'General Marine Enquiry',
]

export default function Contact() {

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
      <section className="contact-split">
        <div className="contact-visual">
          <img src="/images/contact/amphibious-boat-4.webp" alt="ITUS marine team vessel" />
          <span>ITUS / CONTACT / MARINE</span>
        </div>
        <div className="contact-panel">
          <h1>Talk to Our Marine Team.</h1>
          <div className="office-details">
            <div>
              <span>01</span>
              <strong>Corporate / Business Office</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Shipyard / Manufacturing</strong>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <FormField label="Enquiry Topic">
              <select required defaultValue="">
                <option value="">Select a topic</option>
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Name">
              <input required autoComplete="name" />
            </FormField>
            <FormField label="Email">
              <input required type="email" autoComplete="email" />
            </FormField>
            <FormField label="Message" wide>
              <textarea required rows={4} />
            </FormField>
            <button className="button button-gold" type="submit">
              Send Enquiry
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  )
}
