import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  wide?: boolean
}

export default function FormField({ label, children, wide = false }: FormFieldProps) {
  return (
    <label className={wide ? 'wide' : ''}>
      <span>{label}</span>
      {children}
    </label>
  )
}
