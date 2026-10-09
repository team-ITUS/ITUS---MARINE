import type { FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import EditorialHero from '@/components/common/EditorialHero'
import FormField from '@/components/common/FormField'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { orderedVessels as vessels } from '@/data/vessels'

const applications = [
  'Rescue & Emergency',
  'Government',
  'Patrol / Security',
  'Commercial Marine',
  'Ports / Harbours',
  'Crew Transfer',
  'Tourism',
  'Resort / Hospitality',
  'Water Parks',
  'Watersports',
  'Dive Operations',
  'Utility / Workboat',
  'Other',
]

export default function RequestQuote() {
  const selected = new URLSearchParams(useLocation().search).get('vessel') || ''

  // No backend is connected: the form only runs browser validation.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reportValidity()
  }

  return (
    <MainLayout>
      <Seo
        title="Request a Quote | ITUS Marine"
        description="Prepare a vessel, marine systems or customised project requirement for ITUS Marine."
      />
      <EditorialHero
        title={
          <>
            Tell Us What
            <br />
            You Need to Build.
          </>
        }
        intro="Share the vessel, application or operating requirement and our team can review the project."
      />
      <section className="quote-section section-light">
        <div className="container quote-layout">
          <aside>
            <b>PROJECT / 01</b>
            <h2>Define the requirement.</h2>
            <p>
              Provide the operational profile, deployment environment and
              principal platform requirements for initial project evaluation.
            </p>
          </aside>
          <form className="project-form" onSubmit={submit}>
            <FormField label="Vessel / Requirement Type">
              <select required defaultValue={selected}>
                <option value="">Select a requirement</option>
                {vessels.map((vessel) => (
                  <option key={vessel.slug} value={vessel.slug}>
                    {vessel.name}
                  </option>
                ))}
                <option>Marine Systems / Propulsion</option>
                <option>Custom Vessel Requirement</option>
                <option>Other Marine Requirement</option>
              </select>
            </FormField>
            <FormField label="Application">
              <select required defaultValue="">
                <option value="">Select an application</option>
                {applications.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Approximate Vessel Length (optional)">
              <input name="length" />
            </FormField>
            <FormField label="Passenger / Crew Capacity (optional)">
              <input name="capacity" />
            </FormField>
            <FormField label="Operating Environment (optional)" wide>
              <input name="environment" />
            </FormField>
            <FormField label="Organisation">
              <input name="organisation" required />
            </FormField>
            <FormField label="Contact Name">
              <input name="name" required autoComplete="name" />
            </FormField>
            <FormField label="Email">
              <input name="email" type="email" required autoComplete="email" />
            </FormField>
            <FormField label="Phone">
              <input name="phone" type="tel" required autoComplete="tel" />
            </FormField>
            <FormField label="Country" wide>
              <input name="country" required autoComplete="country-name" />
            </FormField>
            <FormField label="Project Details" wide>
              <textarea name="details" required rows={7} />
            </FormField>
            <div className="form-submit">
              <button className="button button-gold" type="submit">
                Submit Requirement
              </button>
            </div>
          </form>
        </div>
      </section>
    </MainLayout>
  )
}
