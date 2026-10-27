import PatrolCraft from '@/components/common/PatrolCraft'
import { revealDelay } from '@/hooks/useReveal'

/**
 * Contact form success state. A night-sea scene: the patrol craft (same drawing as TimelineBoat) sails in from
 * the left, then bobs between the wave layers while the waves drift. All animation is CSS in index.css (.enquiry-*);
 * reduced motion shows the boat at rest.
 */
export default function EnquirySent({ onReset }: { onReset: () => void }) {
  return (
    <div role="status" aria-live="polite">
      <div className="enquiry-sea hero-reveal" aria-hidden="true">
        <span className="enquiry-moon" />
        <span className="enquiry-wave enquiry-wave-back" />
        <span className="enquiry-wave enquiry-wave-mid" />
        <div className="enquiry-boat">
          <div className="enquiry-boat-bob">
            <span className="enquiry-wake" />
            <PatrolCraft className="block h-auto w-full" beaconClassName="enquiry-beacon" />
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
