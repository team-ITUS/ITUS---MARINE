import type { ReactNode } from 'react'

interface EditorialHeroProps {
  title: ReactNode
  intro: string
  compact?: boolean
}

export default function EditorialHero({ title, intro, compact = false }: EditorialHeroProps) {
  return (
    <section className={`editorial-hero ${compact ? 'editorial-hero-compact' : ''}`}>
      <div className="draft-grid" aria-hidden="true" />
      <div className="container">
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  )
}
