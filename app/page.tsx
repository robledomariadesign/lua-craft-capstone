'use client'

import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import ResearchFooter from '@/components/remix/ResearchFooter'
import { RECORDS } from '@/lib/remix/record'

export default function HomePage() {
  return (
    <PhoneShell>
      <div className="flex flex-col h-full bg-[var(--paper)]">
        {/* Header */}
        <div className="shrink-0 px-4 pt-6 pb-4">
          <h1 className="text-[24px] font-bold text-[var(--ink)]">Lua Craft</h1>
          <p className="text-[14px] text-[var(--ink-soft)] mt-1">Proof approval</p>
        </div>

        {/* Records list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {RECORDS.map((record) => (
            <Link
              key={record.id}
              href={`/check/${record.id}`}
              className="flex items-center justify-between p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] hover:bg-[var(--tint)] transition-colors"
            >
              <div>
                <p className="text-[16px] font-semibold text-[var(--ink)]">
                  {record.name}
                </p>
                <p className="text-[13px] text-[var(--ink-soft)] mt-0.5">
                  {record.reference} · v{record.specVersion}
                </p>
              </div>
              <div className="text-[14px] font-semibold text-[var(--blue)]">
                →
              </div>
            </Link>
          ))}
        </div>

        <ResearchFooter />
      </div>
    </PhoneShell>
  )
}
