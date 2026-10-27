import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'

// Routes live under the site's base path (VITE_BASE), e.g. "/demo" when the
// site is deployed to https://example.com/demo/.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  )
}
