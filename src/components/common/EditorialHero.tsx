import type { ReactNode } from 'react'
import { revealDelay } from '@/hooks/useReveal'

interface EditorialHeroProps {
  title: ReactNode
  intro: string
  compact?: boolean
}

export default function EditorialHero({ title, intro, compact = false }: EditorialHeroProps) {
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-steel-blue text-white max-sm:min-h-[560px] max-sm:pb-[75px] max-sm:pt-[150px] ${
        compact ? 'min-h-[500px] pb-[72px] pt-[155px]' : 'min-h-[650px] pb-[100px] pt-[180px]'
      }`}
    >
      <div className="draft-grid" aria-hidden="true" />
      <div className="container-site relative">
        <h1
          style={revealDelay(150)}
          className={`hero-reveal mb-[26px] max-w-[1050px] font-display font-semibold leading-[.9] tracking-[-.055em] max-sm:text-[51px] ${
            compact ? 'text-[clamp(52px,6vw,78px)]' : 'text-[clamp(62px,7vw,96px)]'
          }`}
        >
          {title}
        </h1>
        <p className="hero-reveal max-w-[680px] text-[17px] leading-[1.65] text-ice-grey" style={revealDelay(300)}>{intro}</p>
      </div>
    </section>
  )
}
