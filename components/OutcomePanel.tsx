'use client'

import { ITEMS, RECORD } from '@/lib/record'
import type { Run } from '@/lib/state'

const CAPTION = 'Nothing is sent from here — you send the sheet yourself on WhatsApp'

export default function OutcomePanel({ run, onReset }: { run: Run; onReset: () => void }) {
  const flagged = ITEMS.filter((i) => run.marks[i.key].status === 'flagged')

  if (run.outcome === 'approved') {
    return (
      <div className="flex w-full flex-col gap-2">
        <p
          className="text-[12px] font-semibold text-[var(--green)]"
          style={{ letterSpacing: '1px' }}
        >
          ✓ V{run.specVersion} APPROVED FOR PRODUCTION
        </p>
        <div className="flex w-full flex-col gap-1 rounded-[12px] border border-[var(--line)] p-[14px] text-[14px] text-[var(--ink)]">
          <p>Approved by Luisa · today</p>
          <p>Bound to spec v{run.specVersion}</p>
          <p>
            {RECORD.quantity.toLocaleString('en-US')} units · supplier minimum{' '}
            {RECORD.supplierMinimum}
          </p>
          <p>Lead time starts on approval</p>
        </div>
        <p className="w-full text-center text-[13px] text-[var(--ink-soft)]">{CAPTION}</p>
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] w-full text-center text-[15px] font-semibold text-[var(--blue)]"
        >
          Start over
        </button>
      </div>
    )
  }

  const retired = run.specVersion - 1

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-[12px] font-semibold text-[var(--blue)]" style={{ letterSpacing: '1px' }}>
        V{retired} RETIRED · V{run.specVersion} CREATED
      </p>

      <div
        className="flex w-full flex-col gap-1 rounded-[12px] p-[14px]"
        style={{ border: '1.5px solid var(--blue)' }}
      >
        <p className="text-[15px] font-semibold text-[var(--ink)]">
          v{run.specVersion} · current
        </p>
        {flagged.map((item) => (
          <p key={item.key} className="wrapvalue text-[14px] text-[var(--ink)]">
            {item.label} — {run.marks[item.key].reason}
          </p>
        ))}
        <p className="wrapvalue text-[14px] font-medium text-[var(--ink)]">
          Send v{run.specVersion} to the printer. This is the version to print.
        </p>
      </div>

      <div className="flex w-full flex-col gap-1 rounded-[12px] border border-[var(--line)] bg-[var(--tint)] p-[14px]">
        <p
          className="text-[15px] font-semibold text-[var(--red)]"
          style={{ letterSpacing: '.5px' }}
        >
          v{retired} · RETIRED
        </p>
        <p className="text-[14px] text-[var(--ink-soft)]">Cannot be sent or approved.</p>
      </div>

      <p className="w-full text-center text-[13px] text-[var(--ink-soft)]">{CAPTION}</p>
      <button
        type="button"
        onClick={onReset}
        className="min-h-[44px] w-full text-center text-[15px] font-semibold text-[var(--blue)]"
      >
        Start over
      </button>
    </div>
  )
}
