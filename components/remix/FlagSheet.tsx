import { useState } from 'react'
import type { SpecItem } from '@/lib/remix/record'
import Sheet from './Sheet'

interface FlagSheetProps {
  item: SpecItem
  existingReason?: string
  onCancel: () => void
  onSave: (reason: string) => void
}

export default function FlagSheet({
  item,
  existingReason = '',
  onCancel,
  onSave,
}: FlagSheetProps) {
  const [reason, setReason] = useState(existingReason)
  const isValid = reason.trim().length >= 1

  return (
    <Sheet onDismiss={onCancel}>
      <div>
        <h3 className="text-[16px] font-semibold text-[var(--ink)]">
          Flag · {item.label}
        </h3>
        <p className="text-[13px] text-[var(--ink-soft)] mt-1">
          What needs attention?
        </p>
      </div>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain, in your own words, what the manufacturer needs to change"
        className="w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-3 text-[14px] text-[var(--ink)] placeholder-[var(--ink-faint)] resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center min-h-[44px] rounded-[14px] bg-[var(--tint)] text-[var(--ink)] font-semibold text-[16px]"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!isValid}
          onClick={() => {
            if (isValid) {
              onSave(reason.trim())
            }
          }}
          className={`flex flex-1 items-center justify-center min-h-[44px] rounded-[14px] font-semibold text-[16px] ${
            isValid
              ? 'bg-[var(--red-tint)] text-[var(--red)]'
              : 'bg-[var(--chip-bg)] text-[var(--ink-soft)] cursor-not-allowed'
          }`}
        >
          Save flag
        </button>
      </div>
    </Sheet>
  )
}
