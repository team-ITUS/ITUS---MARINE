import type { ReactNode } from 'react'

interface LabelProps {
  children: ReactNode
  /** "light" is for use on photographs and dark backgrounds. */
  tone?: 'default' | 'light'
}

export default function Label({ children, tone = 'default' }: LabelProps) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-label ${
        tone === 'light' ? 'text-white' : 'text-steel-blue'
      }`}
    >
      <i className="block h-px w-7 bg-current" />
      {children}
    </div>
  )
}
