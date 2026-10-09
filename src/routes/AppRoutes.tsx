import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import About from '@/pages/About'
import Capabilities from '@/pages/Capabilities'
import Contact from '@/pages/Contact'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import RequestQuote from '@/pages/RequestQuote'
import VesselDetail from '@/pages/VesselDetail'
import Vessels from '@/pages/Vessels'

function LegacyVesselRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/vessels/${slug}`} replace />
}

export default function AppRoutes() {
  useScrollToTop()
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vessels" element={<Vessels />} />
      <Route path="/vessels/:slug" element={<VesselDetail />} />
      <Route path="/capabilities" element={<Capabilities />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/request-quote" element={<RequestQuote />} />

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
  )
}
