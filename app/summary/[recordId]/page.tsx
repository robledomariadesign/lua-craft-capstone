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

  if (!ready) {
    return <PhoneShell />
  }

  const flaggedItems = record.items.filter((item) => run.marks[item.key].status === 'flagged')
  const matchingItems = record.items.filter((item) => run.marks[item.key].status === 'match')
  const totalConfirmed = flaggedItems.length + matchingItems.length

  const handleSaveSummary = () => {
    // TODO: Generate and download PDF
    console.log('Save summary')
  }

  return (
    <PhoneShell>
      {/* Nav */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-[var(--surface)] px-4 py-2 border-b border-[var(--line)]">
        <button
          onClick={() => router.back()}
          className="shrink-0 text-[16px] font-semibold text-[var(--blue)] cursor-pointer"
        >
          ‹ Check
        </button>
        <p className="flex-1 text-center text-[14px] font-semibold text-[var(--ink)]">
          Summary
        </p>
        <div className="shrink-0 text-[12px] font-semibold bg-[var(--blue-tint)] text-[var(--blue)] px-2 py-1 rounded-[6px]">
          v{run.specVersion}
        </div>
      </div>

      {/* Main scroll area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--paper)]">
        <div className="flex flex-col gap-[13px] px-4 pt-4 pb-4">
          {/* Eyebrow */}
          <p className="text-[11px] font-semibold text-[var(--ink-soft)] uppercase">
            {record.name}
          </p>

          {/* Headline */}
          <p className="text-[24px] font-bold text-[var(--ink)]">
            {totalConfirmed} of {record.items.length} confirmed
          </p>

          {/* Flagged items */}
          {flaggedItems.map((item) => (
            <div
              key={item.key}
              className="bg-white border-[1.5px] border-[var(--red)] rounded-[12px] px-[14px] py-[11px] space-y-[5px]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-[var(--ink)]">{item.label}</p>
                <div className="bg-[var(--red-tint)] rounded-[999px] px-2 py-[3px]">
                  <p className="text-[10px] font-semibold text-[var(--red)]">⚑ Flagged</p>
                </div>
              </div>
              <p className="text-[13px] font-medium text-[var(--ink)]">
                {item.termEs}: {item.value}
              </p>
              <p className="text-[12px] text-[var(--ink-soft)]">
                {run.marks[item.key].reason}
              </p>
            </div>
          ))}

          {/* Matching items */}
          {matchingItems.length > 0 && (
            <div className="bg-[#e0f4e5] rounded-[12px] px-[14px] py-[11px] space-y-[6px]">
              <p className="text-[10px] font-semibold text-[var(--green)] uppercase">
                ✓ Matching · {matchingItems.length} item{matchingItems.length === 1 ? '' : 's'}
              </p>
              <div className="space-y-[8px]">
                {matchingItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-medium text-[var(--ink)]">
                      {item.label} / {item.termEs}
                    </p>
                    <div className="flex-1 h-px bg-[var(--line)]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <ActionButton variant="blue" onClick={handleSaveSummary}>
            Save summary to send
          </ActionButton>

          {/* Description */}
          <p className="text-[11px] text-[var(--ink-soft)]">
            PDF with version and date will be created in English and Spanish
          </p>

          {/* Back to records */}
          <Link
            href="/"
            className="flex items-center justify-center py-[13px] border border-[var(--line)] rounded-[14px] text-[15px] font-medium text-[var(--blue)]"
          >
            Back to records
          </Link>
        </div>
      </div>
    </PhoneShell>
  )
}
