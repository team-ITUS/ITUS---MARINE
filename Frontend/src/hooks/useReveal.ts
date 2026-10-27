import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

/** Stagger delay for a `.reveal` element, read by the CSS in index.css. */
export const revealDelay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/**
 * Scroll reveal. Attach the returned ref to a section; every `.reveal` element inside it gets
 * `.is-in` (once) when it enters the viewport. The hidden start state only applies once the
 * `js-reveal` class is on <html>, so content stays visible if this never runs.
 * Pass `deps` when `.reveal` elements can mount later (e.g. a filtered list) so they are picked up.
 */
export function useReveal<T extends HTMLElement>(deps: readonly unknown[] = []) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }
    document.documentElement.classList.add('js-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, deps)

  return ref
}
