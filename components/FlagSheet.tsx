'use client'

import { useState } from 'react'
import Sheet from './Sheet'
import ActionButton from './ActionButton'
import { FLAG_CHIPS, type SpecItem } from '@/lib/record'

export default function FlagSheet({
  item,
  onCancel,
  onSave,
}: {
  item: SpecItem
  onCancel: () => void
  onSave: (reason: string) => void
}) {
  const [reason, setReason] = useState('')
  const canSave = reason.trim().length >= 3

  return (
    <Sheet
      title={`What's wrong with ${item.title}?`}
      subtitle={`The printer's proof shows: ${item.proof}`}
      onClose={onCancel}
    >
      <div className="flex flex-wrap gap-2">
        {FLAG_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setReason(chip)}
            className="min-h-[44px] rounded-[999px] bg-[var(--chip-bg)] px-3 py-[8px] text-[13px] font-semibold text-[var(--chip-text)]"
          >
            {chip}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Say what the printer got wrong"
        className="wrapvalue w-full resize-none rounded-[12px] border border-[var(--line)] p-3 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--blue)]"
      />

      <div className="flex gap-[10px]">
        <ActionButton variant="neutral" onClick={onCancel} size={15}>
          Cancel
        </ActionButton>
        <ActionButton
          variant={canSave ? 'red-tint' : 'disabled'}
          disabled={!canSave}
          onClick={() => onSave(reason.trim())}
          size={15}
          className={canSave ? '!bg-[var(--red)] !text-white' : ''}
        >
          Save flag
        </ActionButton>
      </div>
    </Sheet>
  )
}
