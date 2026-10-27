import { useEffect, useRef } from 'react'

/**
 * Scroll parallax for a hero background. Shifts the element down by up to `max` px while its
 * parent scrolls out of view, so it appears to move up slower than the page. The offset never
 * exceeds the scroll distance, so the top edge stays out of sight and the crop is unchanged.
 * Uses the `translate` property, leaving `transform` free for entrance animations.
 * Off below 768px and for reduced motion; without JS the image simply stays in place.
 */
export function useParallax<T extends HTMLElement>(max = 40, deps: readonly unknown[] = []) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    const container = el?.parentElement
    if (!el || !container) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(width < 48rem)')
    let frame = 0

    const update = () => {
      frame = 0
      if (reduced.matches || small.matches) {
        el.style.translate = ''
        return
      }
      const progress = Math.min(Math.max(window.scrollY / container.offsetHeight, 0), 1)
      el.style.translate = `0 ${(progress * max).toFixed(1)}px`
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    small.addEventListener('change', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
      small.removeEventListener('change', schedule)
      el.style.translate = ''
    }
  }, deps)

  return ref
}
