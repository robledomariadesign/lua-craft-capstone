'use client'

import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import { RECORDS, JEWELRY_RECORDS } from '@/lib/remix/record'

export default function FluirCollectionPage() {
  return (
    <PhoneShell>
      <div className="flex flex-col h-full bg-[var(--paper)]">
        {/* Nav */}
        <div className="flex w-full shrink-0 items-center bg-[var(--surface)] px-4 py-2 border-b border-[var(--line)]">
          <Link href="/" className="shrink-0 text-[15px] font-normal text-[var(--blue)]">
            ‹ Records
          </Link>
          <div className="w-[34px]" />
          <p className="text-[16px] font-semibold text-[var(--ink)]">Fluir Collection</p>
          <div className="flex-1" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pt-[18px] pb-6 flex flex-col gap-[10px]">
          <p className="text-[11px] font-semibold text-[var(--ink-soft)]">JEWELRY · DISPLAY ONLY</p>

          {JEWELRY_RECORDS.map((jewelry) => (
            <div
              key={jewelry.id}
              className="flex items-center w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-[14px] py-[13px]"
            >
              <div className="flex-1 flex flex-col gap-[3px]">
                <p className="text-[15px] font-medium text-[var(--ink)]">{jewelry.name}</p>
                <p className="text-[12px] text-[var(--ink-soft)]">Not checkable this round</p>
              </div>
            </div>
          ))}

          <div className="h-[10px]" />

          <p className="text-[11px] font-semibold text-[var(--ink-soft)]">PACKAGING</p>

          {RECORDS.map((record) => {
            const dimensions = record.items.find((i) => i.key === 'dimensions')
            return (
              <Link
                key={record.id}
                href={`/record/${record.id}`}
                className="flex items-center gap-3 w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-[14px] py-[13px] hover:bg-[var(--tint)] transition-colors"
              >
                <div className="flex-1 flex flex-col gap-[3px]">
                  <p className="text-[15px] font-medium text-[var(--ink)]">{record.name}</p>
                  <p className="text-[12px] text-[var(--ink-soft)]">{dimensions?.value}</p>
                </div>
                <p className="text-[18px] text-[var(--ink-faint)]">›</p>
              </Link>
            )
          })}
        </div>
      </div>
    </PhoneShell>
  )
}
