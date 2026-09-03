import { useState } from 'react'
import type { SpecItem } from '@/lib/remix/record'
import Sheet from './Sheet'
import ActionButton from './ActionButton'

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
  const isValid = reason.trim().length >= 3

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
        placeholder="Explain what doesn't match…"
        className="w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-3 text-[14px] text-[var(--ink)] placeholder-[var(--ink-faint)] resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
      />

      <div className="text-[12px] text-[var(--ink-soft)]">
        {reason.length} characters · minimum 3
      </div>

      <ActionButton
        variant={isValid ? 'blue' : 'disabled'}
        onClick={() => {
          if (isValid) {
            onSave(reason.trim())
          }
        }}
      >
        Save note
      </ActionButton>
    </Sheet>
  )
}
