import { Link } from 'react-router-dom'
import Arrow from './Arrow'

export default function SimpleCta({ title }: { title: string }) {
  return (
    <section className="simple-cta">
      <div className="container">
        <h2>{title}</h2>
        <Link className="button button-gold" to="/contact">
          Discuss Your Requirement <Arrow />
        </Link>
      </div>
    </section>
  )
}
