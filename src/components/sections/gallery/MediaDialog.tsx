import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE = 'button:not([disabled]), [href], iframe, video[controls], [tabindex]:not([tabindex="-1"])'

interface MediaDialogProps {
  /** Accessible name of the dialog (not shown). */
  label: string
  onClose: () => void
  /** Element that opened the dialog; focus goes back to it on close. */
  returnFocus: HTMLElement | null
  children: ReactNode
}

/**
 * Full-screen modal shell for the gallery lightbox and video player. It renders outside #root, makes the page
 * behind it inert, locks page scroll, keeps Tab inside, closes on Escape, and returns focus to the opener.
 * The first control in `children` gets focus on open, so put the close button first.
 */
export default function MediaDialog({ label, onClose, returnFocus, children }: MediaDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const { documentElement: html, body } = document
    const page = document.getElementById('root')
    const scrollbar = window.innerWidth - html.clientWidth
    const previous = { overflow: html.style.overflow, paddingRight: body.style.paddingRight }
    html.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    if (page) page.inert = true
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    return () => {
      html.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
      if (page) page.inert = false
      returnFocus?.focus({ preventScroll: true })
    }
  }, [returnFocus])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !ref.current) return
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const inside = ref.current.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="dialog-in fixed inset-0 z-[60] bg-carbon-black/97 text-white"
    >
      {children}
    </div>,
    document.body,
  )
}

interface DialogButtonProps {
  label: string
  onClick: () => void
  className?: string
  children: ReactNode
}

/** 48px icon-only control for the gallery overlays, with a scrim so it stays legible over any image. */
export function DialogButton({ label, onClick, className = '', children }: DialogButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute z-10 grid h-12 w-12 cursor-pointer place-items-center border border-white/25 bg-carbon-black/60 text-white transition-colors duration-200 hover:border-oxide-red hover:bg-oxide-red focus-visible:outline-white ${className}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

export const CloseIcon = () => <path d="M6 6l12 12M18 6 6 18" />
