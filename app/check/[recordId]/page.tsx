'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import FichaViewer from '@/components/remix/FichaViewer'
import ItemRow from '@/components/remix/ItemRow'
import ItemRowPlaceholder from '@/components/remix/ItemRowPlaceholder'
import CoverageCounter from '@/components/remix/CoverageCounter'
import FlagSheet from '@/components/remix/FlagSheet'
import ActionButton from '@/components/remix/ActionButton'
import { RECORDS, type SpecItem } from '@/lib/remix/record'
import { useRun, type RecordId } from '@/lib/remix/state'

export default function CheckPage() {
  const params = useParams()
  const router = useRouter()
  const recordId = params.recordId as RecordId
  const record = RECORDS.find((r) => r.id === recordId)

  if (!record) {
    return (
      <PhoneShell>
        <div className="flex items-center justify-center h-screen">
          <p className="text-[var(--ink-soft)]">Record not found</p>
        </div>
      </PhoneShell>
    )
  }
  const { run, ready, setMark, approve, correct, remaining, flagged, allChecked } = useRun(
    recordId,
    record.items,
    record.specVersion
  )

  const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null)
  const [flaggingItem, setFlaggingItem] = useState<SpecItem | null>(null)

  // The pinned ficha collapses only while a row is open. It used to collapse on
  // scroll as well, with 40/8px hysteresis; against a 267px page and an 80px
  // collapsed scroll range that toggled on every wheel notch or flick.
  const isPinnedCollapsed = expandedItemKey !== null

  // Count confirmed marks — safe to compute pre-ready (run defaults to the
  // seed), but only displayed once ready so a stale/seed count is never shown.
  const confirmed = record.items.filter((i) => run.marks[i.key].status !== 'unchecked').length
  const matching = confirmed - flagged.length

  return (
    <PhoneShell>
      {/* Nav — version comes from the record, not the run, so it never waits on hydration */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 linen px-4 py-2 border-b border-[var(--line)]">
        <Link href={`/record/${recordId}`} className="shrink-0 inline-flex items-center min-h-[44px] text-[17px] font-semibold text-[var(--blue)]">
          ‹ Record
        </Link>
        <p className="flex-1 text-center text-[15px] font-serif font-semibold text-[var(--ink)]">
          {record.name}
        </p>
        <div className="shrink-0 text-[13px] font-semibold bg-[var(--blue-tint)] text-[var(--blue)] px-2 py-1 rounded-[6px]">
          v{record.specVersion}
        </div>
      </div>

      {/* Main scroll area. overflow-anchor: none stops the browser from
          adjusting scrollTop on its own when the sticky ficha resizes as a
          row opens or closes — it is first in flow, so without this the
          browser would compensate for the height change by shifting scrollTop. */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ overflowAnchor: 'none' }}
      >
        {/* Scrollable content wrapper. min-height guarantees at least 80px of
            real scroll range in every state on every device, so collapsing
            the pinned page when a row opens can never bring scrollHeight
            below clientHeight and clamp scrollTop to 0 under the user.
            Resolves against this flex column's own resolved height, so there
            is no row/nav/action-bar arithmetic to keep in sync. */}
        <div className="flex flex-col" style={{ minHeight: 'calc(100% + 80px)' }}>
          {/* Ficha viewer — no run dependency, renders immediately. Scrolls away
              with the content until a row opens; then it sticks, collapsed to
              the strip, and paints paper so rows do not show through it. */}
          <div
            className={`shrink-0 px-4 pt-4 pb-2 ${
              isPinnedCollapsed ? 'sticky top-0 z-10 linen' : ''
            }`}
          >
            <FichaViewer hidePinnedPage={isPinnedCollapsed} />
          </div>

          {/* Item list header */}
          <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
            <div>
              <p className="text-[13px] font-semibold text-[var(--ink-soft)]">
                {record.reference}
              </p>
              <p className="text-[15px] text-[var(--ink)]">
                {record.name}
              </p>
            </div>
            {ready ? (
              <CoverageCounter confirmed={confirmed} total={record.items.length} />
            ) : (
              <div className="w-[120px] h-[17px] rounded-[4px] bg-[var(--tint-deep)]" />
            )}
          </div>

          {/* Item list — labels and summaries are record data and render either
              way; only the status chip waits on the hydrated run */}
          <div className="flex-1 px-4 pb-6 space-y-3">
            {record.items.map((item) =>
              ready ? (
                <ItemRow
                  key={item.key}
                  item={item}
                  mark={run.marks[item.key]}
                  onMark={(key, status, reason) => {
                    setMark(key, status, reason)
                  }}
                  onFlag={(item) => {
                    setFlaggingItem(item)
                  }}
                  expanded={expandedItemKey === item.key}
                  onExpand={(expand) => {
                    setExpandedItemKey(expand ? item.key : null)
                  }}
                />
              ) : (
                <ItemRowPlaceholder key={item.key} item={item} />
              )
            )}
          </div>
        </div>
      </div>

      {/* Action bar — a terracotta island inset from the screen edges, not a
          full-bleed bar. The island is always present so the bar keeps its
          shape across the three states; only the pill inside it changes. */}
      <div
        className="shrink-0 px-[10px] pt-2"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col gap-2 rounded-[26px] bg-[var(--red)] px-[15px] pt-4 pb-[18px]">
          {!ready ? (
            <>
              <div className="min-h-[44px] w-full rounded-[999px] bg-[var(--chip-bg)]" />
              <div className="mx-auto w-[160px] h-[15px] rounded-[4px] bg-[var(--chip-bg)]" />
            </>
          ) : !allChecked ? (
            <>
              <ActionButton variant="island-disabled">
                {remaining} item{remaining === 1 ? '' : 's'} left to check
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                variant="island"
                onClick={() => router.push(`/summary/${recordId}`)}
              >
                See summary
              </ActionButton>
              {/* --surface on --red: 4.57:1. --paper here would be 4.00:1. */}
              <p className="w-full text-center text-[13px] text-[var(--surface)]">
                {flagged.length} flagged · {matching} matching · {confirmed} of {record.items.length} confirmed
              </p>
            </>
          )}
        </div>
      </div>

      {/* Flag sheet */}
      {flaggingItem && (
        <FlagSheet
          item={flaggingItem}
          existingReason={run.marks[flaggingItem.key].reason}
          onCancel={() => setFlaggingItem(null)}
          onSave={(reason) => {
            setMark(flaggingItem.key, 'flagged', reason)
            setFlaggingItem(null)
            setExpandedItemKey(null)
          }}
        />
      )}
    </PhoneShell>
  )
}
