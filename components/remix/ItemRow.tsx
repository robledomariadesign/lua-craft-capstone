import { useState } from 'react'
import type { SpecItem } from '@/lib/remix/record'
import type { Mark } from '@/lib/remix/state'
import RecordCard from './RecordCard'
import ActionButton from './ActionButton'

interface ItemRowProps {
  item: SpecItem
  mark: Mark
  onMark: (itemKey: string, status: 'match' | 'flagged', reason?: string) => void
  onFlag: (item: SpecItem) => void
  expanded: boolean
  onExpand: (expand: boolean) => void
}

const statusChipStyles = {
  unchecked: 'bg-[var(--chip-bg)] text-[var(--chip-text)]',
  match: 'bg-[var(--green)] text-[var(--surface)]',
  flagged: 'bg-[var(--red)] text-[var(--surface)]',
}

export default function ItemRow({
  item,
  mark,
  onMark,
  onFlag,
  expanded,
  onExpand,
}: ItemRowProps) {
  const [editingReason, setEditingReason] = useState(mark.reason || '')

  const statusLabel =
    mark.status === 'match' ? '✓ Match' : mark.status === 'flagged' ? '⚑ Flagged' : 'Not yet'

  const chipClass = statusChipStyles[mark.status]

  if (!expanded) {
    // Resting state
    const isFlagged = mark.status === 'flagged'
    return (
      <button
        type="button"
        onClick={() => onExpand(true)}
        className={`flex flex-col w-full rounded-[12px] bg-[var(--surface)] px-[14px] py-3 text-left hover:bg-[var(--tint)] transition-colors ${
          isFlagged ? 'border-[1.5px] border-[var(--red)]' : 'border border-[var(--line)]'
        }`}
      >
        <div className="flex items-center gap-2 min-h-[44px]">
          <div className="flex-1">
            <div className="text-[15px] font-serif font-semibold text-[var(--ink)]">{item.label}</div>
            <div className="text-[14px] text-[var(--ink-soft)] mt-0.5 truncate">
              {item.summary}
            </div>
          </div>
          <div
            className={`shrink-0 px-3 py-1.5 rounded-[12px] text-[13px] font-semibold ${chipClass}`}
          >
            {statusLabel}
          </div>
        </div>
        {isFlagged && mark.reason && (
          <div className="mt-2 rounded-[8px] bg-[var(--red-tint)] p-2 text-[14px] text-[var(--ink)] break-words">
            {mark.reason}
          </div>
        )}
      </button>
    )
  }

  // Expanded state
  return (
    <div className="w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3">
      {/* Header */}
      <button
        type="button"
        onClick={() => onExpand(false)}
        className="text-[15px] font-semibold text-[var(--blue)] mb-2"
      >
        Close
      </button>

      {/* Label and question */}
      <div>
        <h3 className="text-[19px] font-serif font-semibold text-[var(--ink)]">{item.label}</h3>
        <p className="text-[15px] text-[var(--ink-soft)] mt-1">{item.question}</p>
      </div>

      {/* Value card */}
      <RecordCard item={item} />

      {/* If already marked, show the reason */}
      {mark.status !== 'unchecked' && mark.reason && (
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--red-tint)] p-3">
          <div className="text-[13px] font-semibold text-[var(--ink)] mb-1">YOUR NOTES</div>
          <div className="text-[15px] text-[var(--ink)] break-words">{mark.reason}</div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            setEditingReason('')
            onFlag(item)
          }}
          className="flex flex-1 items-center justify-center min-h-[44px] rounded-[14px] bg-[var(--red-tint)] text-[var(--red-deep)] font-serif font-semibold text-[15px]"
        >
          Flag · say why
        </button>
        <button
          type="button"
          onClick={() => {
            onMark(item.key, 'match')
            onExpand(false)
          }}
          className="flex flex-1 items-center justify-center min-h-[44px] rounded-[14px] bg-[var(--green)] text-[var(--surface)] font-serif font-semibold text-[15px]"
        >
          Match
        </button>
      </div>
    </div>
  )
}
