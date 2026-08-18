'use client'

import type { SpecItem } from '@/lib/record'
import type { Mark } from '@/lib/state'

/**
 * One result line from the Version B summary.
 *
 * Rendered as a button when the participant may go back and change the mark. Plan
 * §13.7 keeps the FIRST pass through items 1–5 forward-only — that fixed order is
 * the variable under test — so revision is reachable only from the summary, never
 * as a per-step back button. The same row is reused read-only on a revisited step
 * to show the mark currently on record, so no second wording exists for it.
 */
export default function ResultRow({
  item,
  mark,
  onRevisit,
}: {
  item: SpecItem
  mark: Mark
  onRevisit?: () => void
}) {
  const flagged = mark.status === 'flagged'

  const inner = (
    <>
      <span className="flex w-full items-start justify-between gap-2">
        <span className="wrapvalue block text-[15px] font-medium text-[var(--ink)]">
          {item.title}
        </span>

        <span className="flex min-w-0 items-start gap-[6px]">
          {flagged ? (
            <span className="wrapvalue block text-right text-[13px] font-semibold text-[var(--red)]">
              ⚑ Flagged · {item.proof}
            </span>
          ) : mark.status === 'match' ? (
            <span className="block shrink-0 text-[13px] font-semibold text-[var(--green)]">
              ✓ Match
            </span>
          ) : (
            <span className="block shrink-0 text-[13px] font-semibold text-[var(--ink-soft)]">
              Not checked
            </span>
          )}

          {/* The affordance is the same chevron the nav already uses, mirrored.
              No new label, no icon dependency. */}
          {onRevisit ? (
            <span aria-hidden className="block shrink-0 text-[15px] text-[var(--blue)]">
              ›
            </span>
          ) : null}
        </span>
      </span>

      {flagged && mark.reason ? (
        <span className="wrapvalue mt-1 block text-[12px] text-[var(--ink-soft)]">
          {mark.reason}
        </span>
      ) : null}
    </>
  )

  const className = 'w-full rounded-[12px] bg-[var(--surface)] px-[14px] py-3 text-left'
  const style = { border: flagged ? '1.5px solid var(--red)' : '1px solid var(--line)' }

  if (!onRevisit) {
    return (
      <div className={className} style={style}>
        {inner}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onRevisit}
      aria-label={`${item.title} — go back and change this mark`}
      className={`${className} min-h-[44px]`}
      style={style}
    >
      {inner}
    </button>
  )
}
