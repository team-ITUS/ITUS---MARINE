import { Link } from 'react-router-dom'
import Label from '@/components/common/Label'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { revealDelay } from '@/hooks/useReveal'

export default function NotFound() {
  return (
    <MainLayout>
      <Seo
        title="Page Not Found | ITUS Marine"
        description="The requested ITUS Marine page could not be found."
      />
      <section className="relative flex min-h-screen items-center overflow-hidden bg-carbon-black text-white">
        <div className="draft-grid" aria-hidden="true" />
        <div className="container-site relative">
          <div className="hero-reveal" style={revealDelay(100)}>
            <Label>Error / 404</Label>
          </div>
          <h1 style={revealDelay(200)} className="hero-reveal my-[25px] font-display text-[clamp(70px,10vw,140px)] font-semibold leading-[.9] tracking-[-.06em] text-white">
            Off the Chart.
          </h1>
          <p style={revealDelay(350)} className="hero-reveal mb-[34px] text-ice-grey">The requested page does not exist or has moved.</p>
          <Link className="btn btn-primary hero-reveal" style={revealDelay(450)} to="/">
            Return Home
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
