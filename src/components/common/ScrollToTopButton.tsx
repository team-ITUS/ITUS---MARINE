import { useEffect, useState } from 'react'

/** Floating button that appears after scrolling down and returns to the top of the page. */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <button
      className={`fixed bottom-4 right-4 z-40 grid h-11 w-11 cursor-pointer place-items-center border border-oxide-red bg-oxide-red p-0 text-white transition-[opacity,transform,background-color,border-color] duration-300 hover:border-oxide-red-hover hover:bg-oxide-red-hover focus-visible:shadow-[0_0_0_4px_var(--color-oxide-red)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-6 sm:right-6 ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      type="button"
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
  )
}
