'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import FichaViewer from '@/components/remix/FichaViewer'
import ItemRow from '@/components/remix/ItemRow'
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
  const [scrollCollapsed, setScrollCollapsed] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Collapse/expand the pinned ficha as the user scrolls, with hysteresis so
  // the collapse-induced layout shift (scroll anchoring) cannot bounce the
  // state back and forth. Collapse above ~40px, only re-expand below ~8px.
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollTop = container.scrollTop
      setScrollCollapsed((prev) => {
        if (scrollTop > 40) return true
        if (scrollTop < 8) return false
        return prev
      })
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // A row being open always forces the collapsed state; otherwise scroll decides.
  const isPinnedCollapsed = expandedItemKey !== null || scrollCollapsed

  // Count confirmed marks
  const confirmed = record.items.filter((i) => run.marks[i.key].status !== 'unchecked').length

  if (!ready) {
    return <PhoneShell />
  }

  return (
    <PhoneShell>
      {/* Nav */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-[var(--surface)] px-4 py-2 border-b border-[var(--line)]">
        <Link href={`/record/${recordId}`} className="shrink-0 inline-flex items-center min-h-[44px] text-[16px] font-semibold text-[var(--blue)]">
          ‹ Record
        </Link>
        <p className="flex-1 text-center text-[14px] font-semibold text-[var(--ink)]">
          {record.name}
        </p>
        <div className="shrink-0 text-[12px] font-semibold bg-[var(--blue-tint)] text-[var(--blue)] px-2 py-1 rounded-[6px]">
          v{run.specVersion}
        </div>
      </div>

      {/* Main scroll area */}
      <div ref={scrollContainerRef} className="flex-1 flex flex-col overflow-y-auto bg-[var(--paper)]">
        {/* Ficha viewer */}
        <div className="sticky top-0 z-10 shrink-0 px-4 pt-4 pb-2 bg-[var(--paper)]">
          <FichaViewer hidePinnedPage={isPinnedCollapsed} />
        </div>

        {/* Item list header */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <p className="text-[12px] font-semibold text-[var(--ink-soft)]">
              {record.reference}
            </p>
            <p className="text-[14px] text-[var(--ink)]">
              {record.name}
            </p>
          </div>
          <CoverageCounter confirmed={confirmed} total={record.items.length} />
        </div>

        {/* Item list */}
        <div className="flex-1 px-4 pb-4 space-y-2">
          {record.items.map((item) => (
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
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="safe-bottom flex w-full shrink-0 flex-col gap-2 bg-[var(--surface)] px-4 pt-[10px] border-t border-[var(--line)]">
        {!allChecked ? (
          <>
            <ActionButton variant="disabled">
              {remaining} item{remaining === 1 ? '' : 's'} to check
            </ActionButton>
            <p className="w-full text-center text-[12px] text-[var(--ink-soft)]">
              Mark every item to continue
            </p>
          </>
        ) : (
          <>
            <ActionButton
              variant="blue"
              onClick={() => router.push(`/summary/${recordId}`)}
            >
              See summary
            </ActionButton>
            <p className="w-full text-center text-[12px] text-[var(--ink-soft)]">
              {confirmed} confirmed {flagged.length > 0 && `· ${flagged.length} flagged`}
            </p>
          </>
        )}
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
