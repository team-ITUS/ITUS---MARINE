import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Brand from '@/components/common/Brand'
import { primaryNav, rescueUrl } from '@/data/navigation'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header-solid' : ''} ${pathname === '/' ? 'header-on-light' : ''} ${pathname === '/contact' ? 'header-split' : ''}`}>
      <div className="header-shell">
        <Brand />
        <nav className="primary-nav" aria-label="Primary navigation">
          {primaryNav.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <a href={rescueUrl} target="_blank" rel="noopener noreferrer">
            Rescue Products <Arrow />
          </a>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {primaryNav.map(([label, path], index) => (
            <NavLink key={path} to={path}>
              <small>0{index + 1}</small>
              {label}
            </NavLink>
          ))}
        </nav>
        <a href={rescueUrl} target="_blank" rel="noopener noreferrer">
          Rescue Products <Arrow />
        </a>
      </div>
    </header>
  )
}
