import type { PackagingRecord } from '@/lib/remix/record'
import Sheet from './Sheet'

interface HistorySheetProps {
  record: PackagingRecord
  onClose: () => void
}

// "4 February 2026" — day, full month name, year, no ordinal suffix.
// Parsed manually (not via locale) so the day-month-year order is guaranteed
// regardless of runtime locale.
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const monthName = date.toLocaleDateString('en-US', { month: 'long' })
  return `${parseInt(day)} ${monthName} ${year}`
}

export default function HistorySheet({ record, onClose }: HistorySheetProps) {
  const entries = [...record.history].reverse()

  return (
    <Sheet onDismiss={onClose}>
      <h3 className="text-[17px] font-semibold text-[var(--ink)]">Version history</h3>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.version}
            className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-3 space-y-1"
          >
            <p className="text-[15px] font-semibold text-[var(--ink)]">
              <span className="font-serif">v{entry.version}</span> · {formatDate(entry.created)}
            </p>
            <span className="inline-block rounded-[6px] bg-[var(--tint)] text-[var(--ink)] text-[13px] font-semibold px-2 py-0.5">
              {entry.status === 'current' ? 'Current' : 'Retired'}
            </span>
            {entry.approvedBy && entry.approvedOn ? (
              <p className="text-[14px] text-[var(--ink)]">
                Approved by {entry.approvedBy}
                {entry.channel ? ` over ${entry.channel}` : ''} · {formatDate(entry.approvedOn)}
              </p>
            ) : (
              <p className="text-[14px] text-[var(--ink)]">Never approved</p>
            )}
            {entry.note && (
              <p className="text-[14px] text-[var(--ink-soft)]">{entry.note}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center justify-center w-full min-h-[44px] rounded-[14px] bg-[var(--tint)] text-[var(--ink)] font-serif font-semibold text-[17px]"
      >
        Close
      </button>
    </Sheet>
  )
}
