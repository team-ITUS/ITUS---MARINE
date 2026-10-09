import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Brand from '@/components/common/Brand'
import { rescueUrl } from '@/data/navigation'

function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="footer-group">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Brand />
          <p>
            Integrated marine engineering, vessel construction and systems
            integration for professional, commercial and specialised maritime
            applications.
          </p>
        </div>
        <FooterGroup title="Vessels">
          <Link to="/vessels">All Vessels</Link>
        </FooterGroup>
        <FooterGroup title="Capabilities">
          <Link to="/capabilities">Capabilities</Link>
          <Link to="/capabilities#marine-systems">Marine Systems</Link>
          <Link to="/capabilities#lifecycle-support">Lifecycle Support</Link>
        </FooterGroup>
        <FooterGroup title="Company">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </FooterGroup>
        <FooterGroup title="Resources">
          <Link to="/request-quote">Request a Quote</Link>
          <a href={rescueUrl} target="_blank" rel="noopener noreferrer">
            ITUS Rescue <Arrow />
          </a>
        </FooterGroup>
      </div>
      <div className="container rescue-ribbon">
        <span>Looking for professional rescue equipment?</span>
        <a href={rescueUrl} target="_blank" rel="noopener noreferrer">
          Visit ITUS Rescue <Arrow />
        </a>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ITUS Marine</span>
        <span>Vessel Engineering / Shipbuilding</span>
      </div>
    </footer>
  )
}
