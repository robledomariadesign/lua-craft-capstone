'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import ActionButton from '@/components/remix/ActionButton'
import { RECORDS, type RecordId } from '@/lib/remix/record'
import { useRun } from '@/lib/remix/state'

export default function SummaryPage() {
  const params = useParams()
  const router = useRouter()
  const recordId = params.recordId as RecordId
  const record = RECORDS.find((r) => r.id === recordId)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  if (!record) {
    return (
      <PhoneShell>
        <div className="flex items-center justify-center h-screen">
          <p className="text-[var(--ink-soft)]">Record not found</p>
        </div>
      </PhoneShell>
    )
  }

  const { run, ready } = useRun(recordId, record.items, record.specVersion)

  // Safe to compute pre-ready (run defaults to the seed), but only rendered
  // once ready — an un-hydrated run would show a false "0 flagged" beat.
  const flaggedItems = record.items.filter((item) => run.marks[item.key].status === 'flagged')
  const matchingItems = record.items.filter((item) => run.marks[item.key].status === 'match')
  const totalConfirmed = flaggedItems.length + matchingItems.length

  const handleSaveSummary = async () => {
    if (!ready) return
    try {
      const { generatePDF, downloadPDF } = await import('@/lib/remix/pdf')
      const blob = await generatePDF({
        record,
        run,
        items: record.items,
      })
      downloadPDF(blob, `${record.id}-v${run.specVersion}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }

  const handleCopySummary = async () => {
    if (!ready) return
    try {
      const { buildSummaryLines } = await import('@/lib/remix/pdf')
      const lines = buildSummaryLines({
        record,
        run,
        items: record.items,
      })
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch (error) {
      console.error('Failed to copy summary:', error)
    }
  }

  return (
    <PhoneShell>
      {/* Nav */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 linen px-4 py-2 border-b border-[var(--line)]">
        <button
          onClick={() => router.push(`/check/${recordId}`)}
          className="shrink-0 inline-flex items-center min-h-[44px] text-[17px] font-semibold text-[var(--blue)] cursor-pointer"
        >
          ‹ Check
        </button>
        <p className="flex-1 text-center text-[15px] font-semibold text-[var(--ink)]">
          Summary
        </p>
        <div className="shrink-0 text-[13px] font-semibold bg-[var(--blue-tint)] text-[var(--blue)] px-2 py-1 rounded-[6px]">
          v{record.specVersion}
        </div>
      </div>

      {/* Main scroll area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-[13px] px-4 pt-4 pb-4">
          {/* Eyebrow */}
          <p className="text-[12px] font-semibold text-[var(--ink-soft)] uppercase">
            {record.name}
          </p>

          {/* Headline */}
          {ready ? (
            <p className="text-[25px] font-serif font-semibold text-[var(--ink)]">
              {totalConfirmed} of {record.items.length} confirmed
            </p>
          ) : (
            <div className="w-[220px] h-[29px] rounded-[4px] bg-[var(--tint-deep)]" />
          )}

          {/* Flagged items — count is unknown pre-hydration, so nothing
              renders here until ready rather than guessing a footprint */}
          {ready && flaggedItems.map((item) => (
            <div
              key={item.key}
              className="bg-[var(--surface)] border-[1.5px] border-[var(--red)] rounded-[12px] px-[14px] py-[11px] space-y-[5px]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-semibold text-[var(--ink)]">{item.label}</p>
                <div className="bg-[var(--red-tint)] rounded-[999px] px-2 py-[3px]">
                  <p className="text-[11px] font-semibold text-[var(--red-deep)]">⚑ Flagged</p>
                </div>
              </div>
              {item.lines && item.lines.length > 0 ? (
                <>
                  <p className="text-[14px] font-medium text-[var(--ink)]">Your record:</p>
                  <div className="space-y-[3px] pl-[12px]">
                    {item.lines.map((line) => (
                      <p key={line.label} className="text-[14px] font-medium text-[var(--ink)]">
                        {line.value}
                      </p>
                    ))}
                  </div>
                  <p className="text-[13px] text-[var(--ink-soft)] mt-[5px]">
                    Your note: {run.marks[item.key].reason}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[14px] font-medium text-[var(--ink)]">
                    Your record: {item.value}
                  </p>
                  <p className="text-[13px] text-[var(--ink-soft)]">
                    Your note: {run.marks[item.key].reason}
                  </p>
                </>
              )}
            </div>
          ))}

          {/* Matching items. #C7CEEA is used here and nowhere else: the periwinkle
              panel needs an edge against the cream paper. */}
          {ready && matchingItems.length > 0 && (
            <div className="bg-[var(--blue-tint)] border border-[#C7CEEA] rounded-[12px] px-[14px] py-[11px] space-y-[6px]">
              <p className="text-[11px] font-semibold text-[var(--ink)] uppercase">
                ✓ Matching · {matchingItems.length} item{matchingItems.length === 1 ? '' : 's'}
              </p>
              <div className="space-y-[3px]">
                {matchingItems.map((item) => (
                  <p key={item.key} className="text-[13px] font-medium text-[var(--ink)]">
                    {item.label}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopySummary}
            disabled={!ready}
            className={`flex items-center justify-center py-[13px] rounded-[14px] text-[16px] font-serif font-semibold min-h-[44px] ${
              ready
                ? 'bg-[var(--tint)] text-[var(--ink)] cursor-pointer'
                : 'bg-[var(--chip-bg)] text-[var(--ink-soft)] cursor-not-allowed'
            }`}
          >
            {copyState === 'copied' ? 'Copied' : 'Copy summary as text'}
          </button>

          {/* Back to records */}
          <Link
            href="/"
            className="flex items-center justify-center py-[13px] border border-[var(--line)] rounded-[14px] text-[16px] font-medium text-[var(--blue)]"
          >
            Back to records
          </Link>
        </div>
      </div>

      {/* Action area — pinned below the scroll area, same island as the check
          screen, so content scrolls behind it instead of carrying it below
          the fold on a short viewport. */}
      <div
        className="shrink-0 px-[10px] pt-2"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col gap-2 rounded-[26px] bg-[var(--red)] px-[15px] pt-4 pb-[18px]">
          <ActionButton variant={ready ? 'island' : 'island-disabled'} onClick={handleSaveSummary}>
            Save summary to send
          </ActionButton>

          {/* --surface on --red, 4.57:1 */}
          <p className="w-full text-center text-[12px] text-[var(--surface)]">
            PDF with version and date will be created in English and Spanish
          </p>
        </div>
      </div>
    </PhoneShell>
  )
}
