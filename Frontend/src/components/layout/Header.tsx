import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Arrow from '@/components/common/Arrow'
import Brand from '@/components/common/Brand'
import { primaryNav, rescueUrl } from '@/data/navigation'

/** Nav link with an oxide-red underline that grows on hover and for the active route. */
const underline =
  "relative whitespace-nowrap text-sm uppercase tracking-ui after:absolute after:left-0 after:top-[27px] after:h-px after:bg-oxide-red after:transition-[width] after:duration-[250ms] after:content-[''] hover:text-white hover:after:w-full"

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
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-dark-steel-border after:content-[''] ${
        scrolled ? 'bg-carbon-black/98' : 'bg-linear-to-b from-carbon-black/60 to-transparent'
      }`}
    >
      <div className="container-site grid h-[70px] grid-cols-[1fr_auto] items-center gap-8 sm:h-[76px] lg:grid-cols-[auto_1fr] lg:gap-[clamp(20px,2vw,38px)]">
        <Brand />
        <nav
          className="hidden h-full items-center gap-[clamp(20px,2vw,38px)] justify-self-end lg:flex"
          aria-label="Primary navigation"
        >
          {primaryNav.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${underline} ${isActive ? 'text-white after:w-full' : 'text-ice-grey after:w-0'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.75 justify-self-end border border-dark-steel-border bg-transparent lg:hidden"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="h-px w-[18px] bg-white" />
          <span className="h-px w-[18px] bg-white" />
        </button>
      </div>
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 bottom-0 top-[70px] flex flex-col bg-carbon-black px-[6vw] py-[6vh] text-white transition-transform duration-[350ms] sm:top-[76px] lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile navigation">
          {primaryNav.map(([label, path], index) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className="border-b border-dark-steel-border py-3.5 font-display text-[30px] font-medium leading-[normal] text-white"
            >
              <small className="inline-block w-[45px] font-sans text-[8px] font-medium leading-[normal] text-oxide-red">
                0{index + 1}
              </small>
              {label}
            </NavLink>
          ))}
        </nav>
        <a
          className="mt-6 text-[15px] text-arctic-blue-grey hover:text-white"
          href={rescueUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Rescue Products <Arrow />
        </a>
      </div>
    </header>
  )
}
