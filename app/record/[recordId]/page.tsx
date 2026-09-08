'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PhoneShell from '@/components/remix/PhoneShell'
import ActionButton from '@/components/remix/ActionButton'
import { RECORDS, type RecordId } from '@/lib/remix/record'

export default function RecordPage() {
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

  return (
    <PhoneShell>
      {/* Nav */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-[var(--surface)] px-4 py-2 border-b border-[var(--line)]">
        <Link href="/collection/fluir" className="shrink-0 text-[16px] font-semibold text-[var(--blue)]">
          ‹ Fluir Collection
        </Link>
        <p className="flex-1 text-center text-[14px] font-semibold text-[var(--ink)]">
          {record.name}
        </p>
        <div className="shrink-0 text-[12px] font-semibold bg-[var(--blue-tint)] text-[var(--blue)] px-2 py-1 rounded-[6px]">
          v{record.specVersion}
        </div>
      </div>

      {/* Main scroll area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--paper)]">
        <div className="flex flex-col gap-3 px-4 pt-4 pb-4">
          {/* Timestamp */}
          <p className="text-[11px] font-semibold text-[var(--ink-soft)] uppercase">
            Last saved {(() => {
              const [year, month, day] = record.savedOn.split('-')
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
              return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              }).toLowerCase()
            })()}
          </p>

          {/* Items */}
          {record.items.map((item) => (
            <div
              key={item.key}
              className="bg-white border border-[var(--line)] rounded-[12px] px-[14px] py-[11px] space-y-[5px]"
            >
              {/* Header row with label and term */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-[var(--ink)]">{item.label}</p>
                <div className="flex-1 h-px bg-[var(--line)]" />
                <p className="text-[12px] text-[var(--ink-soft)] whitespace-nowrap">
                  {item.termEs}
                </p>
              </div>

              {/* Value(s) */}
              {item.lines && item.lines.length > 0 ? (
                // Multi-line value (string or yesno type)
                <div className="space-y-[5px]">
                  {item.lines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <p className="text-[12px] text-[var(--ink-soft)]">{line.label}</p>
                      <div className="flex-1 h-px bg-[var(--line)]" />
                      <p className="text-[13px] font-medium text-[var(--ink)] whitespace-nowrap">
                        {line.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Single-line value
                <p className="text-[15px] font-medium text-[var(--ink)]">{item.value}</p>
              )}
            </div>
          ))}

          {/* Primary action */}
          <ActionButton
            variant="blue"
            onClick={() => router.push(`/check/${recordId}`)}
          >
            Compare for production
          </ActionButton>
        </div>
      </div>
    </PhoneShell>
  )
}
