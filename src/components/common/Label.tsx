import type { ReactNode } from 'react'

export default function Label({ children }: { children: ReactNode }) {
  return (
    <div className="label">
      <i />
      {children}
    </div>
  )
}
