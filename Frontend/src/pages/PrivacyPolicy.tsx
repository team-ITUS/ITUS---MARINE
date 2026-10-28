import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import EditorialHero from '@/components/common/EditorialHero'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { companyAddress } from '@/data/navigation'
import { revealDelay, useReveal } from '@/hooks/useReveal'

/** Update this date whenever the policy text changes. */
const lastUpdated = '28 October 2026'

const linkClass = 'text-steel-blue underline underline-offset-4 hover:text-oxide-red'

const summary = [
  'We only collect what you type into our Contact or Careers form.',
  'We use it to reply to you or to consider you for a role, nothing else.',
  'We never sell your details or use them for marketing.',
  'You can ask us to see, correct or delete your details at any time.',
]

interface Section {
  title: string
  body: ReactNode
}

const sections: Section[] = [
  {
    title: 'What we collect',
    body: (
      <>
        <p>We only collect personal details that you choose to give us through the forms on this website.</p>
        <h3>Contact form</h3>
        <p>Your name, organisation, contact number, email address and message.</p>
        <h3>Careers form (Submit Your Profile)</h3>
        <p>
          Your full name, email address, phone number, current location, current role, years of experience, area of
          expertise, LinkedIn profile (optional), CV / resume and any message you add.
        </p>
        <h3>When you simply browse</h3>
        <p>
          We do not use analytics, advertising or tracking cookies, and we do not ask you to log in. Like most websites,
          our web server keeps standard technical logs (such as IP address, browser type and pages requested) to keep the
          site running securely.
        </p>
      </>
    ),
  },
  {
    title: 'Why we need it',
    body: (
      <ul>
        <li>
          <strong>Contact form:</strong> to understand your requirement and reply to you by phone or email.
        </li>
        <li>
          <strong>Careers form:</strong> to review your experience and contact you if it matches a current or upcoming
          role at ITUS Marine.
        </li>
        <li>
          <strong>Technical logs:</strong> to protect the website against misuse and fix problems.
        </li>
      </ul>
    ),
  },
  {
    title: 'Your consent',
    body: (
      <p>
        Each form asks you to tick a box agreeing to this use before you submit. We record the date and time you gave
        consent. You can withdraw it at any time by contacting us (see below); we will then stop using your details and
        delete them, unless the law requires us to keep them.
      </p>
    ),
  },
  {
    title: 'Who can see it',
    body: (
      <>
        <p>
          Your submission is stored securely on our server and sent by email to the ITUS Marine team that handles it:
          enquiries go to the team that handles enquiries, and profiles and CVs go to our HR team.
        </p>
        <p>
          We use trusted service providers to host the website and deliver email. They process your details only on our
          behalf. We do not sell, rent or share your details with anyone else for their own use, except where the law
          requires us to.
        </p>
      </>
    ),
  },
  {
    title: 'Third-party services',
    body: (
      <p>
        This website loads its fonts from Google Fonts. To deliver them, Google receives your IP address and browser
        details. See the{' '}
        <a className={linkClass} href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
        . Links to other ITUS Group websites follow their own privacy policies.
      </p>
    ),
  },
  {
    title: 'How long we keep it',
    body: (
      <ul>
        <li>
          <strong>Enquiries:</strong> for as long as needed to respond and to manage any work that follows.
        </li>
        <li>
          <strong>Profiles and CVs:</strong> for as long as needed to consider you for current and future roles. You can
          ask us to delete them at any time.
        </li>
      </ul>
    ),
  },
  {
    title: 'Your rights',
    body: (
      <>
        <p>
          Under India’s Digital Personal Data Protection Act, 2023, you can ask us to:
        </p>
        <ul>
          <li>tell you what personal details we hold about you,</li>
          <li>correct or update them,</li>
          <li>delete them, or</li>
          <li>withdraw your consent.</li>
        </ul>
        <p>We will respond to your request within a reasonable time.</p>
      </>
    ),
  },
  {
    title: 'Keeping it safe',
    body: (
      <p>
        We protect your details with secure connections, restricted access and trusted providers. No system is
        completely secure, but we take reasonable steps to prevent loss, misuse or unauthorised access.
      </p>
    ),
  },
  {
    title: 'Children',
    body: <p>This website is meant for businesses and job seekers aged 18 or over. We do not knowingly collect details from children.</p>,
  },
  {
    title: 'Changes to this policy',
    body: <p>If we change how we use your details, we will update this page and the “Last updated” date at the top.</p>,
  },
  {
    title: 'Contact us',
    body: (
      <>
        <p>
          For any question or request about your personal details, use our{' '}
          <Link className={linkClass} to="/contact">
            Contact form
          </Link>{' '}
          or write to us at:
        </p>
        <address className="not-italic">
          {companyAddress.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </>
    ),
  },
]

export default function PrivacyPolicy() {
  const ref = useReveal<HTMLElement>()
  return (
    <MainLayout>
      <Seo
        title="Privacy Policy | ITUS Marine"
        description="How ITUS Marine collects, uses and protects the personal details you share through our Contact and Careers forms."
      />
      <EditorialHero
        label="Legal"
        title="Privacy Policy"
        intro="What personal details we collect, why we need them and how we keep them safe, in plain language."
        compact
      />
      <section ref={ref} className="bg-polar-white py-[80px] sm:py-[110px]">
        <div className="container-site grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-x-[8%]">
          <aside className="reveal lg:sticky lg:top-[110px] lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[.06em] text-oxide-red">Last updated {lastUpdated}</p>
            <div className="mt-6 border-t border-technical-border pt-6">
              <h2 className="mb-4 font-display text-[22px] font-semibold tracking-[-.03em] text-carbon-black">In short</h2>
              <ul className="space-y-3 text-[15px] leading-[1.6] text-slate-grey">
                {summary.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-oxide-red" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="max-w-[760px]">
            <p style={revealDelay(80)} className="reveal mb-12 text-[17px] leading-[1.7] text-slate-grey">
              This website is run by ITUS Sports and Safety Pvt. Ltd. This policy explains
              how we handle the personal details you share with us through this website.
            </p>
            {sections.map(({ title, body }, index) => (
              <article key={title} className="reveal border-t border-technical-border py-9">
                <h2 className="mb-4 flex items-baseline gap-4 font-display text-[26px] font-semibold leading-[1.15] tracking-[-.035em] text-carbon-black sm:text-[30px]">
                  <span className="text-xs font-semibold tracking-normal text-oxide-red">{String(index + 1).padStart(2, '0')}</span>
                  {title}
                </h2>
                <div className="space-y-4 text-base leading-[1.7] text-slate-grey [&_h3]:mt-6 [&_h3]:font-medium [&_h3]:text-carbon-black [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-carbon-black [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {body}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
