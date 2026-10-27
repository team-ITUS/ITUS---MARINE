import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { revealDelay } from '@/hooks/useReveal'

interface CtaLink {
  label: string
  to: string
}

interface SimpleCtaProps {
  title: string
  /** Oxide-red button. Defaults to the contact page. */
  primary?: CtaLink
  /** Optional underlined text link beside the button. */
  secondary?: CtaLink
}

const contactLink: CtaLink = { label: 'Discuss Your Requirement', to: '/contact' }

export default function SimpleCta({ title, primary = contactLink, secondary }: SimpleCtaProps) {
  return (
    <section className="bg-steel-blue py-[115px] text-white">
      <div
        className={`container-site grid grid-cols-1 items-center gap-10 ${
          secondary ? 'lg:grid-cols-[1fr_auto]' : 'sm:grid-cols-[1fr_auto]'
        }`}
      >
        <h2 className="reveal m-0 font-display text-[45px] font-semibold leading-[.96] tracking-display sm:text-[clamp(44px,5vw,68px)]">
          {title}
        </h2>
        <div className="reveal flex flex-wrap items-center gap-x-9 gap-y-7" style={revealDelay(120)}>
          <Link className="btn btn-primary" to={primary.to}>
            {primary.label} <Arrow />
          </Link>
          {secondary && (
            <Link className="action" to={secondary.to}>
              {secondary.label} <Arrow className="text-oxide-red" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
