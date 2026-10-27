import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP)

/**
 * SplitText from React Bits (reactbits.dev/text-animations/split-text, TS + Tailwind variant),
 * extended with GSAP's `mask` option so each piece rises out of a clipped wrapper
 * (styled by the `.split-*-mask` rules in index.css). Respects prefers-reduced-motion.
 */
export interface SplitTextProps {
  text: string
  className?: string
  style?: CSSProperties
  /** Stagger between pieces, in ms. */
  delay?: number
  /** Wait before the first piece starts, in ms. */
  startDelay?: number
  duration?: number
  ease?: string | ((t: number) => number)
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars'
  mask?: 'lines' | 'words' | 'chars'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  threshold?: number
  rootMargin?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  onLetterAnimationComplete?: () => void
}

export default function SplitText({
  text,
  className = '',
  style,
  delay = 100,
  startDelay = 0,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  mask,
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    if (document.fonts.status === 'loaded') setFontsLoaded(true)
    else document.fonts.ready.then(() => setFontsLoaded(true))
  }, [])

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !text || !fontsLoaded) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.style.visibility = 'visible'
        return
      }

      const startPct = (1 - threshold) * 100
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin)
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px'
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`
      const start = `top ${startPct}%${sign}`

      const split = new GSAPSplitText(el, {
        type: splitType,
        mask,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          const targets = splitType.includes('chars')
            ? self.chars
            : splitType.includes('words')
              ? self.words
              : self.lines
          el.style.visibility = 'visible'
          return gsap.fromTo(targets, { ...from }, {
            ...to,
            duration,
            ease,
            delay: startDelay / 1000,
            stagger: delay / 1000,
            scrollTrigger: { trigger: el, start, once: true, fastScrollEnd: true },
            onComplete: () => onLetterAnimationComplete?.(),
            willChange: 'transform, opacity',
            force3D: true,
          })
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill()
        })
        split.revert()
      }
    },
    {
      dependencies: [text, delay, startDelay, duration, ease, splitType, mask, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded],
      scope: ref,
    },
  )

  const Tag = tag as ElementType
  return (
    <Tag ref={ref} className={className} style={{ visibility: 'hidden', ...style }}>
      {text}
    </Tag>
  )
}
