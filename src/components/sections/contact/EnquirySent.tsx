import { useId } from 'react'
import { revealDelay } from '@/hooks/useReveal'

/**
 * Contact form success state. A night-sea scene: the patrol craft (same drawing as TimelineBoat) sails in from
 * the left, then bobs between the wave layers while the waves drift. All animation is CSS in index.css (.enquiry-*);
 * reduced motion shows the boat at rest.
 */
export default function EnquirySent({ onReset }: { onReset: () => void }) {
  const glass = `glass${useId().replace(/[^\w-]/g, '')}`
  return (
    <div role="status" aria-live="polite">
      <div className="enquiry-sea hero-reveal" aria-hidden="true">
        <span className="enquiry-moon" />
        <span className="enquiry-wave enquiry-wave-back" />
        <span className="enquiry-wave enquiry-wave-mid" />
        <div className="enquiry-boat">
          <div className="enquiry-boat-bob">
            <span className="enquiry-wake" />
            <svg className="block h-auto w-full" viewBox="0 0 240 64">
              <defs>
                <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--color-steel-blue)" />
                  <stop offset="1" stopColor="var(--color-carbon-black)" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="var(--color-arctic-blue-grey)" strokeWidth="1.2" strokeLinecap="round">
                <path d="M16 40V34M34 40V34M52 40V34M16 34H64L70 40" />
                <path d="M162 40V35.5M182 40V35.5M202 40V35M162 35.5H202L226 33" />
                <path d="M108 21V8M128 21L130 4" strokeWidth="1.6" />
              </g>
              <rect x="98" y="7.6" width="20" height="2.4" fill="var(--color-ice-grey)" />
              <circle className="enquiry-beacon" cx="108" cy="5.6" r="1.6" fill="var(--color-oxide-red)" />
              <path d="M78 24L80 21H142L144 24Z" fill="var(--color-ice-grey)" />
              <path d="M74 40L82 24H138L156 40Z" fill="var(--color-arctic-blue-grey)" />
              <path d="M86 27H134L146 36H82Z" fill={`url(#${glass})`} />
              <path d="M101 27V36M117 27V36M133 27L136 36" stroke="var(--color-arctic-blue-grey)" strokeWidth="1.6" />
              <path d="M10 40H206C220 40 230 37 238 31L234 41C228 52 214 59 192 60H16L10 54Z" fill="var(--color-ice-grey)" />
              <path d="M10 43H231L229 46H10Z" fill="var(--color-oxide-red)" />
              <path d="M12 53H221C216 57 206 60 192 60H16Z" fill="var(--color-arctic-blue-grey)" />
            </svg>
          </div>
        </div>
        <span className="enquiry-wave enquiry-wave-front" />
      </div>

      <div className="mt-10 flex items-center gap-3 hero-reveal" style={revealDelay(500)}>
        <svg className="enquiry-check h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none" stroke="var(--color-oxide-red)" strokeWidth="1.6" aria-hidden="true">
          <circle cx="14" cy="14" r="12.5" />
          <path d="M8.5 14.5l3.6 3.6 7.4-7.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-[.06em] text-oxide-red">Enquiry Received</span>
      </div>
      <h2 className="hero-reveal mb-4 mt-5 font-display text-[clamp(30px,3vw,42px)] font-semibold leading-[1.05] tracking-[-.04em] text-carbon-black" style={revealDelay(650)}>
        Thank you. Your enquiry is underway.
      </h2>
      <p className="hero-reveal max-w-[520px] text-base leading-[1.65] text-slate-grey" style={revealDelay(800)}>
        Our marine team will review your requirement and get back to you shortly on the contact number you shared.
      </p>
      <button
        type="button"
        className="hero-reveal mt-8 border-b border-technical-border pb-1.5 text-sm font-semibold uppercase tracking-ui text-steel-blue hover:border-steel-blue hover:text-carbon-black"
        style={revealDelay(950)}
        onClick={onReset}
      >
        Send Another Enquiry
      </button>
    </div>
  )
}
