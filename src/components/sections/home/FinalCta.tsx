import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'

export default function FinalCta() {
  return (
    <section className="final-cta">
      <div className="final-cta-media">
        <img src="/images/home/define-your-next-vessel/23-8m-crew-boat-2.webp" alt="ITUS vessel at sea" />
      </div>
      <div className="final-panel">
        <h2>
          Define Your Next
          <br />
          Vessel Requirement.
        </h2>
        <p>
          Engage with our team to evaluate vessel platforms, integrated marine
          systems and project-specific configurations aligned to your
          operational requirement.
        </p>
        <div className="button-row">
          <Link className="button button-gold" to="/request-quote">
            Discuss Your Requirement <Arrow />
          </Link>
          <Link className="text-action" to="/contact">
            Contact ITUS Marine
          </Link>
        </div>
      </div>
    </section>
  )
}
