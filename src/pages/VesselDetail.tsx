import { Link, useParams } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Label from '@/components/common/Label'
import SectionHeading from '@/components/common/SectionHeading'
import Seo from '@/components/common/Seo'
import MainLayout from '@/components/layout/MainLayout'
import { getRelatedVessels, orderedVessels as vessels, pickSpecs } from '@/data/vessels'
import NotFound from './NotFound'

export default function VesselDetail() {
  const { slug } = useParams()
  const vessel = vessels.find((item) => item.slug === slug)
  if (!vessel) return <NotFound />

  const rail = pickSpecs([
    ['LOA', vessel.length],
    ['Beam', vessel.beam],
    ['Draft', vessel.draft],
    ['Speed', vessel.speed],
    ['Capacity', vessel.capacity],
    ['Propulsion', vessel.propulsion],
  ])
  const related = getRelatedVessels(vessel)

  return (
    <MainLayout>
      <Seo title={`${vessel.name} | ITUS Marine`} description={vessel.shortDescription} />
      <section className="vessel-detail-hero">
        <img src={vessel.heroImage} alt={`${vessel.name} at sea`} />
        <div className="detail-shade" />
        <div className="container vessel-detail-title">
          <div className="crumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/vessels">Vessels</Link>
            <span>/</span>
            <b>{vessel.name}</b>
          </div>
          <Label>Vessel / {String(vessel.brochureOrder).padStart(2, '0')}</Label>
          <small>{vessel.category}</small>
          <h1>{vessel.name}</h1>
          <p>{vessel.shortDescription}</p>
        </div>
      </section>
      <section className="spec-rail">
        <div className="container">
          {rail.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="detail-overview section-light">
        <div className="container detail-editorial">
          <div>
            <b>01</b>
            <Label>Overview</Label>
          </div>
          <p>{vessel.longDescription}</p>
        </div>
      </section>
      <section className="detail-image">
        <img src={vessel.galleryImages[0] ?? vessel.heroImage} alt={`Profile of ${vessel.name}`} />
        <span>ITUS / {vessel.name} / General Arrangement</span>
      </section>
      {(vessel.missionApplications.length > 0 || vessel.keyFeatures.length > 0) && (
        <section className="detail-content section-ivory">
          <div className="container detail-columns">
            <div>
              <b>02</b>
              <SectionHeading title={'Designed to\nPerform.'} />
              <ul className="line-list">
                {vessel.missionApplications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {vessel.keyFeatures.length > 0 && (
              <div>
                <b>03</b>
                <SectionHeading title={'Key\nFeatures.'} />
                <ul className="line-list">
                  {vessel.keyFeatures.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
      {vessel.technicalSpecs.length > 0 && (
        <section className="technical-specs section-light">
          <div className="container specs-layout">
            <div>
              <b>04</b>
              <SectionHeading
                title="Principal Data."
                intro="Verified vessel data reproduced from the approved ITUS boat catalogue."
              />
            </div>
            <div className="spec-table">
              {vessel.technicalSpecs.map((spec) => (
                <div key={spec.label}>
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="related section-dark">
          <div className="container">
            <SectionHeading title="Continue the Index." />
            <div className="related-links">
              {related.map((item) => (
                <Link key={item.id} to={`/vessels/${item.slug}`}>
                  <img src={item.heroImage} alt={item.name} />
                  <span>{String(item.brochureOrder).padStart(2, '0')}</span>
                  <h3>{item.name}</h3>
                  <Arrow />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="platform-cta">
        <div className="container">
          <h2>Interested in this platform?</h2>
          <div className="button-row">
            <Link className="button button-gold" to="/contact">
              Discuss This Vessel <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
