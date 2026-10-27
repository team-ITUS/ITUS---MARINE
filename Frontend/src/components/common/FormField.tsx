import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  wide?: boolean
}

/** Shared look for the input, select and textarea passed in as children. */
export const fieldClass =
  'min-h-[50px] w-full rounded-none border-0 border-b border-technical-border bg-transparent px-0.5 py-3.5 text-base leading-normal text-carbon-black outline-none focus:border-steel-blue'

export default function FormField({ label, children, wide = false }: FormFieldProps) {
  return (
    <label className={`flex flex-col gap-2 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-sm tracking-[.02em] text-slate-grey">{label}</span>
      {children}
    </label>
  )
}
