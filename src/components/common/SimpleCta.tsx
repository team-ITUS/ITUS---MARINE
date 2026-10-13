import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { revealDelay } from '@/hooks/useReveal'

export default function SimpleCta({ title }: { title: string }) {
  return (
    <section className="bg-steel-blue py-[115px] text-white">
      <div className="container-site grid grid-cols-1 items-center gap-10 sm:grid-cols-[1fr_auto]">
        <h2 className="reveal m-0 font-display text-[45px] font-semibold leading-[.96] tracking-display sm:text-[clamp(44px,5vw,68px)]">
          {title}
        </h2>
        <Link className="btn btn-primary reveal" style={revealDelay(120)} to="/contact">
          Discuss Your Requirement <Arrow />
        </Link>
      </div>
    </section>
  )
}
