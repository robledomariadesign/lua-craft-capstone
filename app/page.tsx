'use client'

import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import ResearchFooter from '@/components/remix/ResearchFooter'
import { RECORDS, JEWELRY_RECORDS } from '@/lib/remix/record'

export default function CollectionsIndexPage() {
  return (
    <PhoneShell>
      <div className="flex flex-col h-full bg-[var(--paper)]">
        {/* Nav — top of stack, no back link */}
        <div className="flex w-full shrink-0 items-center bg-[var(--surface)] px-4 py-2 border-b border-[var(--line)]">
          <div className="flex-1" />
          <p className="text-[16px] font-semibold text-[var(--ink)]">Records</p>
          <div className="flex-1" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pt-[18px] pb-6 flex flex-col gap-[10px]">
          <p className="text-[11px] font-semibold text-[var(--ink-soft)]">LUA CRAFT STUDIO</p>
          <h1 className="text-[28px] font-bold text-[var(--ink)]">Collections</h1>

          <div className="h-[6px]" />

          <Link
            href="/collection/fluir"
            className="flex items-center gap-3 w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-[14px] py-[13px] hover:bg-[var(--tint)] transition-colors"
          >
            <div className="flex-1 flex flex-col gap-[3px]">
              <p className="text-[15px] font-serif font-semibold text-[var(--ink)]">Fluir Collection</p>
              <p className="text-[12px] text-[var(--ink-soft)]">
                {JEWELRY_RECORDS.length} jewelry · {RECORDS.length} packaging records
              </p>
            </div>
            <p className="text-[18px] text-[var(--ink-faint)]">›</p>
          </Link>
        </div>

        <ResearchFooter />
      </div>
    </PhoneShell>
  )
}
