import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Brand from '@/components/common/Brand'
import { rescueUrl } from '@/data/navigation'

const footerLink = 'text-sm text-ice-grey transition-colors duration-200 hover:text-oxide-red'
const stripClass =
  'container-site flex justify-between border-t border-dark-steel-border text-arctic-blue-grey max-sm:flex-col max-sm:gap-2.5'

function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[13px]">
      <h3 className="mb-2.5 text-[13px] uppercase tracking-[.06em] text-arctic-blue-grey">{title}</h3>
      {children}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-dark-steel-border bg-carbon-black pb-7 pt-[85px] text-white">
      <div className="container-site grid grid-cols-1 gap-x-[5%] gap-y-10 pb-[70px] sm:grid-cols-[2fr_repeat(2,1fr)] lg:grid-cols-[2fr_repeat(4,1fr)]">
        <div>
          <Brand />
          <p className="mt-[26px] max-w-[350px] text-[15px] leading-[1.65] text-ice-grey">
            Integrated marine engineering, vessel construction and systems
            integration for professional, commercial and specialised maritime
            applications.
          </p>
        </div>
        <FooterGroup title="Vessels">
          <Link className={footerLink} to="/vessels">All Vessels</Link>
        </FooterGroup>
        <FooterGroup title="Capabilities">
          <Link className={footerLink} to="/capabilities">Capabilities</Link>
          <Link className={footerLink} to="/capabilities#marine-systems">Marine Systems</Link>
          <Link className={footerLink} to="/capabilities#lifecycle-support">Lifecycle Support</Link>
        </FooterGroup>
        <FooterGroup title="Company">
          <Link className={footerLink} to="/about">About</Link>
          <Link className={footerLink} to="/contact">Contact</Link>
        </FooterGroup>
        <FooterGroup title="Resources">
          <a className={footerLink} href={rescueUrl} target="_blank" rel="noopener noreferrer">
            ITUS Rescue <Arrow />
          </a>
        </FooterGroup>
      </div>
      <div className={`${stripClass} py-[22px] text-[13px]`}>
        <span>Looking for professional rescue equipment?</span>
        <a
          className="text-ice-grey transition-colors duration-200 hover:text-oxide-red"
          href={rescueUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit ITUS Rescue <Arrow />
        </a>
      </div>
      <div className={`${stripClass} pt-[22px] text-xs uppercase tracking-[.04em]`}>
        <span>© {new Date().getFullYear()} ITUS Marine</span>
        <span>Vessel Engineering / Shipbuilding</span>
      </div>
    </footer>
  )
}
