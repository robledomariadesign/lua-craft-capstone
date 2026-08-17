'use client'

import { useEffect, type ReactNode } from 'react'

export default function Sheet({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="sheet-scrim absolute inset-0 bg-[rgba(28,28,31,.4)]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-panel safe-bottom relative flex max-h-[86%] flex-col gap-3 overflow-y-auto rounded-t-[20px] bg-[var(--surface)] p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="wrapvalue text-[19px] font-semibold text-[var(--ink)]">{title}</h2>
            {subtitle ? (
              <p className="wrapvalue mt-1 text-[13px] text-[var(--ink-soft)]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] shrink-0 px-2 text-[17px] text-[var(--blue)]"
          >
            Close
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  )
}
