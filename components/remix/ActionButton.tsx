import type { ReactNode } from 'react'

interface ActionButtonProps {
  variant: 'green' | 'red-tint' | 'blue' | 'disabled'
  onClick?: () => void
  children: ReactNode
}

const variantStyles = {
  green: 'min-h-[44px] w-full rounded-[14px] bg-[var(--green)] text-[var(--surface)] font-semibold text-[16px]',
  'red-tint': 'min-h-[44px] w-full rounded-[14px] bg-[var(--red-tint)] text-[var(--red)] font-semibold text-[16px]',
  blue: 'min-h-[44px] w-full rounded-[14px] bg-[var(--blue)] text-[var(--surface)] font-semibold text-[16px]',
  disabled: 'min-h-[44px] w-full rounded-[14px] bg-[var(--chip-bg)] text-[var(--ink-soft)] font-semibold text-[16px] cursor-not-allowed',
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
