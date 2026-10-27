import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { fieldClass } from '@/components/common/FormField'
import { experienceOptions, expertiseOptions, profileMessages, resumeRules } from '@/data/careers'
import { revealDelay } from '@/hooks/useReveal'

type Errors = Partial<Record<FieldName, string>>

/** Form fields in DOM order (the first invalid one gets focus). `website` is a honeypot and is not validated. */
const fields = ['fullName', 'email', 'phone', 'location', 'currentRole', 'experience', 'expertise', 'linkedin', 'cv', 'message'] as const
type FieldName = (typeof fields)[number]
const required: FieldName[] = ['fullName', 'email', 'phone', 'location', 'experience', 'expertise', 'cv']

const inputClass = `${fieldClass} aria-[invalid=true]:border-oxide-red`

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

function resumeError(file: File | null): string | undefined {
  if (!file || file.size === 0) return profileMessages.required
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  // Some systems report no MIME type for Word files; the extension check still applies and the server sniffs the content.
  const typeOk = file.type === '' || resumeRules.mimeTypes.includes(file.type)
  if (!resumeRules.extensions.includes(extension) || !typeOk || file.size > resumeRules.maxBytes) return profileMessages.resume
}

function fieldError(name: FieldName, data: FormData): string | undefined {
  if (name === 'cv') {
    const file = data.get('cv')
    return resumeError(file instanceof File ? file : null)
  }
  const value = String(data.get(name) ?? '').trim()
  if (!value) return required.includes(name) ? profileMessages.required : undefined
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return profileMessages.email
  if (name === 'phone' && !/^[0-9+()\- ]{7,20}$/.test(value)) return profileMessages.phone
  if (name === 'linkedin' && !/^https?:\/\/\S+\.\S+/i.test(value)) return profileMessages.url
}

interface FieldProps {
  name: FieldName
  label: string
  error?: string
  wide?: boolean
  children: ReactNode
}

/** Label above the control, error below it. The control itself carries id, aria-invalid and aria-describedby. */
function Field({ name, label, error, wide = false, children }: FieldProps) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={`profile-${name}`} className="mb-2 block text-sm tracking-[.02em] text-slate-grey">
        {label}
        {required.includes(name) ? (
          <span className="text-oxide-red" aria-hidden="true"> *</span>
        ) : (
          <span className="text-slate-grey/80"> (Optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`profile-${name}-error`} className="mt-2 flex items-start gap-2 text-sm leading-[1.5] text-oxide-red">
          <span aria-hidden="true" className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full border border-current text-[10px] font-semibold">!</span>
          {error}
        </p>
      )}
    </div>
  )
}

function Chevron() {
  return (
    <svg className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-blue" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileSent() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  return (
    <div role="status" className="hero-reveal border-t border-technical-border pt-10">
      <svg className="enquiry-check h-9 w-9" viewBox="0 0 28 28" fill="none" stroke="var(--color-oxide-red)" strokeWidth="1.6" aria-hidden="true">
        <circle cx="14" cy="14" r="12.5" />
        <path d="M8.5 14.5l3.6 3.6 7.4-7.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 ref={heading} tabIndex={-1} className="mb-4 mt-6 font-display text-[clamp(28px,3vw,40px)] font-semibold leading-[1.05] tracking-[-.04em] text-carbon-black">
        Thank you for sharing your profile.
      </h3>
      <p className="max-w-[560px] text-base leading-[1.65] text-slate-grey">
        Our team will review your details and get in touch if your experience matches a current or upcoming requirement
        at ITUS Marine.
      </p>
    </div>
  )
}

/**
 * Talent submission form. Validates on submit (then live on each field already in error), focuses the first invalid
 * field. A valid form is sent with the CV to the backend (POST /api/applications); field errors it returns are shown
 * the same way as the client-side ones.
 */
export default function ProfileForm() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [file, setFile] = useState<File | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState('')

  if (sent) return <ProfileSent />

  const describedBy = (name: FieldName, hint?: string) =>
    [hint, errors[name] && `profile-${name}-error`].filter(Boolean).join(' ') || undefined
  const control = (name: FieldName, hint?: string) => ({
    id: `profile-${name}`,
    name,
    required: required.includes(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': describedBy(name, hint),
  })

  // Once a field shows an error, re-check it as the user corrects it.
  const recheck = (event: FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name as FieldName
    if (!errors[name]) return
    const error = fieldError(name, new FormData(event.currentTarget))
    setErrors((current) => ({ ...current, [name]: error }))
  }

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const found: Errors = {}
    for (const name of fields) {
      const error = fieldError(name, data)
      if (error) found[name] = error
    }
    setErrors(found)
    const firstInvalid = fields.find((name) => found[name])
    if (firstInvalid) {
      const count = Object.keys(found).length
      setAnnouncement(`${count} ${count === 1 ? 'field needs' : 'fields need'} attention before you can submit.`)
      ;(form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus()
      return
    }

    setSending(true)
    setFormError('')
    try {
      // FormData includes the CV file; don't set Content-Type, the browser adds it.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok) {
        if (result.errors) setErrors(result.errors)
        setFormError(result.message ?? 'Please check the highlighted fields.')
        return
      }
      setSent(true)
    } catch {
      setFormError('Could not submit your profile. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form style={revealDelay(150)} className="reveal relative grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2" noValidate onSubmit={submit} onChange={recheck}>
      <Field name="fullName" label="Full Name" error={errors.fullName}>
        <input className={inputClass} {...control('fullName')} autoComplete="name" />
      </Field>
      <Field name="email" label="Email Address" error={errors.email}>
        <input className={inputClass} {...control('email')} type="email" autoComplete="email" />
      </Field>
      <Field name="phone" label="Phone Number" error={errors.phone}>
        <input className={inputClass} {...control('phone')} type="tel" inputMode="tel" autoComplete="tel" />
      </Field>
      <Field name="location" label="Current Location" error={errors.location}>
        <input className={inputClass} {...control('location')} autoComplete="address-level2" />
      </Field>
      <Field name="currentRole" label="Current Role / Designation" error={errors.currentRole}>
        <input className={inputClass} {...control('currentRole')} autoComplete="organization-title" />
      </Field>
      <Field name="experience" label="Years of Experience" error={errors.experience}>
        <div className="relative">
          <select className={`${inputClass} cursor-pointer appearance-none pr-8`} {...control('experience')} defaultValue="">
            <option value="">Select</option>
            {experienceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <Chevron />
        </div>
      </Field>
      <Field name="expertise" label="Area of Expertise" error={errors.expertise}>
        <div className="relative">
          <select className={`${inputClass} cursor-pointer appearance-none pr-8`} {...control('expertise')} defaultValue="">
            <option value="">Select</option>
            {expertiseOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <Chevron />
        </div>
      </Field>
      <Field name="linkedin" label="LinkedIn Profile" error={errors.linkedin}>
        <input className={inputClass} {...control('linkedin')} type="url" inputMode="url" placeholder="https://" />
      </Field>

      <Field name="cv" label="Upload CV / Resume" error={errors.cv} wide>
        {/* The native input covers the box (transparent), so click, keyboard and drag-and-drop all work as normal. */}
        <div
          className={`relative flex min-h-[76px] items-center gap-4 border border-dashed bg-white px-4 py-3 transition-colors hover:border-steel-blue has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-oxide-red ${
            errors.cv ? 'border-oxide-red' : 'border-technical-border'
          }`}
        >
          <input
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            {...control('cv', 'profile-cv-hint')}
            type="file"
            accept={[...resumeRules.extensions.map((ext) => `.${ext}`), ...resumeRules.mimeTypes].join(',')}
            onChange={chooseFile}
          />
          <span aria-hidden="true" className="inline-flex min-h-11 shrink-0 items-center border border-steel-blue px-4 text-xs font-semibold uppercase tracking-ui text-steel-blue">
            Choose File
          </span>
          <span aria-hidden="true" className="min-w-0 text-sm leading-[1.5] text-slate-grey">
            {file ? (
              <>
                <span className="block truncate font-medium text-carbon-black">{file.name}</span>
                {formatSize(file.size)}
              </>
            ) : (
              'No file chosen'
            )}
          </span>
        </div>
        <p id="profile-cv-hint" className="mt-2 text-sm text-slate-grey">
          PDF, DOC or DOCX, up to 10 MB.
          {file && <span className="sr-only"> Selected file: {file.name}.</span>}
        </p>
      </Field>

      <Field name="message" label="Short Message" error={errors.message} wide>
        <textarea className={`${inputClass} resize-none`} {...control('message')} rows={4} maxLength={2000} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech. The backend currently ignores this field. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        {formError && <p className="mb-4 text-sm text-oxide-red" role="alert">{formError}</p>}
        <button className="btn btn-primary w-full sm:w-fit" type="submit" disabled={sending}>
          {sending ? 'Submitting…' : 'Submit Profile'}
        </button>
        <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </form>
  )
}
