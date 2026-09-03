import { useEffect, type ReactNode } from 'react'

interface SheetProps {
  onDismiss: () => void
  children: ReactNode
}

export default function Sheet({ onDismiss, children }: SheetProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onDismiss])

  return (
    <>
      <div
        className="sheet-scrim fixed inset-0 bg-[rgba(28,28,31,0.4)]"
        onClick={onDismiss}
      />
      <div className="sheet-panel fixed bottom-0 left-0 right-0 flex flex-col gap-3 rounded-t-[20px] bg-[var(--surface)] p-4">
        {children}
      </div>
    </>
  )
}
