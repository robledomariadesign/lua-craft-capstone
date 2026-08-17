'use client'

import type { ReactNode } from 'react'

type Variant = 'green' | 'blue' | 'red-tint' | 'disabled' | 'neutral'

const STYLES: Record<Variant, string> = {
  green: 'bg-[var(--green)] text-white',
  blue: 'bg-[var(--blue)] text-white',
  'red-tint': 'bg-[var(--red-tint)] text-[var(--red)]',
  disabled: 'bg-[var(--tint-deep)] text-[var(--ink-faint)]',
  neutral: 'bg-[var(--chip-bg)] text-[var(--chip-text)]',
}

export default function ActionButton({
  variant,
  children,
  onClick,
  disabled,
  className = '',
  size = 17,
}: {
  variant: Variant
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?: number
}) {
  const isOff = disabled || variant === 'disabled'
  return (
    <button
      type="button"
      onClick={isOff ? undefined : onClick}
      disabled={isOff}
      aria-disabled={isOff}
      style={{ fontSize: size }}
      className={`flex min-h-[44px] w-full items-center justify-center rounded-[14px] px-3 py-[15px] text-center font-semibold ${STYLES[variant]} ${
        isOff ? 'cursor-default' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}
