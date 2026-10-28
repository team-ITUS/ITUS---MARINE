import type { InputHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

interface ConsentCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  /** Plain-language reason the form needs the visitor's details. Leave out when `agreement` already says why. */
  why?: string
  /** What the visitor agrees to by ticking the box. */
  agreement: string
  error?: string
}

/**
 * Data-use notice and required consent checkbox shown above a form's submit button. Sends `consent=yes`; the backend
 * rejects submissions without it and records when consent was given.
 */
export default function ConsentCheck({ id, why, agreement, error, className = '', ...input }: ConsentCheckProps) {
  return (
    <div className={`${why ? 'border-t border-technical-border pt-5' : ''} ${className}`}>
      {why && (
        <p id={`${id}-why`} className="mb-4 text-sm leading-[1.6] text-slate-grey">
          <span className="font-medium text-carbon-black">Why we ask for your details: </span>
          {why}
        </p>
      )}
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-[1.6] text-carbon-black">
        <input
          id={id}
          name="consent"
          value="yes"
          type="checkbox"
          className="mt-[3px] h-[18px] w-[18px] shrink-0 cursor-pointer accent-oxide-red"
          aria-describedby={[why && `${id}-why`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
          {...input}
        />
        <span>
          {agreement} Read our{' '}
          {/* New tab, so following the link doesn't lose what has been typed. */}
          <Link className="text-steel-blue underline underline-offset-4 hover:text-oxide-red" to="/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </Link>
          .<span className="text-oxide-red" aria-hidden="true"> *</span>
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm leading-[1.5] text-oxide-red">
          <span aria-hidden="true" className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full border border-current text-[10px] font-semibold">!</span>
          {error}
        </p>
      )}
    </div>
  )
}
