import { Link } from 'react-router-dom'
import Label from '@/components/common/Label'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'

export default function NotFound() {
  return (
    <MainLayout>
      <Seo
        title="Page Not Found | ITUS Marine"
        description="The requested ITUS Marine page could not be found."
      />
      <section className="not-found">
        <div className="draft-grid" aria-hidden="true" />
        <div className="container">
          <Label>Error / 404</Label>
          <h1>Off the Chart.</h1>
          <p>The requested page does not exist or has moved.</p>
          <Link className="button button-gold" to="/">
            Return Home
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
