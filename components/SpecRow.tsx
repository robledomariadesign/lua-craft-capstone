'use client'

import type { SpecItem } from '@/lib/record'
import type { Mark } from '@/lib/state'

export default function SpecRow({
  item,
  mark,
  expanded,
  locked,
  onToggle,
  onMatch,
  onFlag,
}: {
  item: SpecItem
  mark: Mark
  expanded: boolean
  locked: boolean
  onToggle: () => void
  onMatch: () => void
  onFlag: () => void
}) {
  const flagged = mark.status === 'flagged'
  const matched = mark.status === 'match'

  const chip = matched ? '✓ Match' : flagged ? '⚑ Flagged' : 'Check'
  const chipClass = matched
    ? 'bg-transparent text-[var(--green)]'
    : flagged
      ? 'bg-transparent text-[var(--red)]'
      : 'bg-[var(--chip-bg)] text-[var(--chip-text)]'

  return (
    <div
      className="w-full shrink-0 rounded-[12px] bg-[var(--surface)] pb-[10px] pl-[14px] pr-[10px] pt-[10px]"
      style={{ border: flagged ? '1.5px solid var(--red)' : '1px solid var(--line)' }}
    >
      <button
        type="button"
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className="text-[10px] font-semibold text-[var(--ink-soft)]"
            style={{ letterSpacing: '.8px' }}
          >
            {item.label}
          </span>

          {/* Record value and proof value are typographically identical — see plan §7.2 */}
          <span className="wrapvalue block text-[14px] font-medium text-[var(--ink)]">
            {item.record}
          </span>

          <span
            className="text-[10px] font-semibold text-[var(--ink-micro)]"
            style={{ letterSpacing: '.8px' }}
          >
            THE PRINTER SENT
          </span>
          <span className="wrapvalue block text-[14px] font-medium text-[var(--ink)]">
            {item.proof}
          </span>

          {flagged && mark.reason ? (
            <span className="wrapvalue block text-[11px] text-[var(--red)]">{mark.reason}</span>
          ) : null}
        </span>

        <span
          className={`flex min-h-[44px] shrink-0 items-center rounded-[999px] px-[10px] py-[5px] text-[12px] font-semibold ${chipClass}`}
        >
          {chip}
        </span>
      </button>

      {expanded && !locked ? (
        <div className="mt-[10px] flex gap-[10px]">
          <button
            type="button"
            onClick={onFlag}
            className="min-h-[44px] flex-1 rounded-[12px] bg-[var(--red-tint)] px-2 py-[10px] text-[15px] font-semibold text-[var(--red)]"
          >
            Flag · say why
          </button>
          <button
            type="button"
            onClick={onMatch}
            className="min-h-[44px] flex-1 rounded-[12px] bg-[var(--green)] px-2 py-[10px] text-[15px] font-semibold text-white"
          >
            Match
          </button>
        </div>
      ) : null}
    </div>
  )
}
