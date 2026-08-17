import type { ReactNode } from 'react'

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell-outer">
      <div className="shell-frame">{children}</div>
    </div>
  )
}
