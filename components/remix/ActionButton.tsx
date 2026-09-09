import type { ReactNode } from 'react'

interface ActionButtonProps {
  variant: 'green' | 'red-tint' | 'blue' | 'disabled'
  onClick?: () => void
  children: ReactNode
}

// flex items-center justify-center is load-bearing, not decorative: globals.css
// resets button { text-align: inherit }, so a full-width button left-aligns its
// label unless it centers its own content.
const variantStyles = {
  green: 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--green)] text-[var(--surface)] font-semibold text-[16px]',
  'red-tint': 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--red-tint)] text-[var(--red)] font-semibold text-[16px]',
  blue: 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--blue)] text-[var(--surface)] font-semibold text-[16px]',
  disabled: 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--chip-bg)] text-[var(--ink-soft)] font-semibold text-[16px] cursor-not-allowed',
}

export default function ActionButton({ variant, onClick, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={variant === 'disabled'}
      className={variantStyles[variant]}
    >
      {children}
    </button>
  )
}
