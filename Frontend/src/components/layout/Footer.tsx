import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Brand from '@/components/common/Brand'
import { companyAddress, groupLinks } from '@/data/navigation'

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
      <div className="container-site grid grid-cols-1 gap-x-[5%] gap-y-10 pb-[70px] sm:grid-cols-[2fr_repeat(2,1fr)] lg:grid-cols-[1.6fr_repeat(3,.8fr)_1.5fr]">
        <div>
          <Brand className="h-14 sm:h-16" />
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
          <Link className={footerLink} to="/case-studies">Case Studies</Link>
          <Link className={footerLink} to="/gallery">Gallery</Link>
          <Link className={footerLink} to="/contact">Contact</Link>
        </FooterGroup>
        <FooterGroup title="Address">
          <address className="text-sm not-italic leading-[1.7] text-ice-grey">
            {companyAddress.map((line, index) => (
              <span key={line} className={`block ${index === 0 ? 'mb-1 font-medium text-white' : ''}`}>
                {line}
              </span>
            ))}
          </address>
        </FooterGroup>
      </div>
      <div className={`${stripClass} items-center gap-4 py-[22px] text-[13px]`}>
        <span className="uppercase tracking-[.06em]">ITUS Group</span>
        <div className="flex flex-wrap gap-2.5">
          {groupLinks.map(([label, url]) => (
            <a
              key={url}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-dark-steel-border px-4 text-ice-grey transition-colors duration-200 hover:border-oxide-red hover:text-white"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label} <Arrow className="text-oxide-red" />
            </a>
          ))}
        </div>
      </div>
      <div className={`${stripClass} pt-[22px] text-xs uppercase tracking-[.04em]`}>
        <span>© {new Date().getFullYear()} ITUS Marine</span>
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          <Link className="transition-colors duration-200 hover:text-white" to="/privacy-policy">Privacy Policy</Link>
          <span>Vessel Engineering / Shipbuilding</span>
        </span>
      </div>
    </footer>
  )
}
