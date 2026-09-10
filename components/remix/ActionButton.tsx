import type { ReactNode } from 'react'

interface ActionButtonProps {
  variant: 'green' | 'red-tint' | 'blue' | 'disabled' | 'island' | 'island-disabled'
  onClick?: () => void
  children: ReactNode
}

// flex items-center justify-center is load-bearing, not decorative: globals.css
// resets button { text-align: inherit }, so a full-width button left-aligns its
// label unless it centers its own content.
// Filled buttons outside the island keep --surface labels: white on --red
// measures 4.57:1, --paper on --red only 4.00:1. Inside the island the fill
// inverts — a --paper pill with --red text — so that pairing is the one
// place cream and terracotta meet.
const variantStyles = {
  green: 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--green)] text-[var(--surface)] font-serif font-semibold text-[16px]',
  'red-tint': 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--red-tint)] text-[var(--red-deep)] font-serif font-semibold text-[16px]',
  blue: 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--blue)] text-[var(--surface)] font-serif font-semibold text-[16px]',
  disabled: 'flex items-center justify-center min-h-[44px] w-full rounded-[14px] bg-[var(--chip-bg)] text-[var(--ink-soft)] font-serif font-semibold text-[16px] cursor-not-allowed',
  island: 'flex items-center justify-center min-h-[44px] w-full rounded-[999px] bg-[var(--paper)] text-[var(--red)] font-serif font-semibold text-[16px]',
  'island-disabled': 'flex items-center justify-center min-h-[44px] w-full rounded-[999px] bg-[var(--chip-bg)] text-[var(--ink-soft)] font-serif font-semibold text-[16px] cursor-not-allowed',
}

export default function ActionButton({ variant, onClick, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={variant === 'disabled' || variant === 'island-disabled'}
      className={variantStyles[variant]}
    >
      {children}
    </button>
  )
}
