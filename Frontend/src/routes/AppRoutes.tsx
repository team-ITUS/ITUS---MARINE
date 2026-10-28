import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import Home from '@/pages/Home'

// Home ships in the main bundle; every other page is its own chunk, fetched on first visit.
const About = lazy(() => import('@/pages/About'))
const Capabilities = lazy(() => import('@/pages/Capabilities'))
const CaseStudies = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyDetail = lazy(() => import('@/pages/CaseStudyDetail'))
const Contact = lazy(() => import('@/pages/Contact'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const VesselDetail = lazy(() => import('@/pages/VesselDetail'))
const Vessels = lazy(() => import('@/pages/Vessels'))

function LegacyVesselRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/vessels/${slug}`} replace />
}

export default function AppRoutes() {
  useScrollToTop()
  return (
    <Suspense fallback={<div className="min-h-svh bg-polar-white" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vessels" element={<Vessels />} />
        <Route path="/vessels/:slug" element={<VesselDetail />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* Legacy URLs from the earlier site structure */}
        <Route
          path="/marine-systems"
          element={<Navigate to="/capabilities#marine-systems" replace />}
        />
        <Route path="/shipyard" element={<Navigate to="/" replace />} />
        <Route path="/shipyard/vessels" element={<Navigate to="/vessels" replace />} />
        <Route path="/shipyard/vessels/:slug" element={<LegacyVesselRedirect />} />
        <Route
          path="/shipyard/marine-systems"
          element={<Navigate to="/capabilities#marine-systems" replace />}
        />
        <Route path="/shipyard/projects" element={<Navigate to="/" replace />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
