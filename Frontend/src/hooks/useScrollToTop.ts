import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to the #hash target, or to the top of the page, on every route change. */
export function useScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView()
      } else {
        window.scrollTo(0, 0)
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])
}
