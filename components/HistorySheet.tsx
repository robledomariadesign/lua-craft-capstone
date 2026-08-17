'use client'

import Sheet from './Sheet'
import { RECORD, type VersionEntry } from '@/lib/record'

function Entry({ entry }: { entry: VersionEntry }) {
  const isCurrent = entry.status === 'current'
  const approved = Boolean(entry.approvedOn)

  return (
    <div
      className="flex w-full flex-col gap-1 rounded-[12px] px-[14px] py-3"
      style={{
        border: isCurrent ? '1.5px solid var(--blue)' : '1px solid var(--line)',
        background: !isCurrent && !approved ? 'var(--tint)' : 'var(--surface)',
      }}
    >
      <p
        className="text-[13px] font-semibold"
        style={{
          letterSpacing: '.5px',
          color: isCurrent
            ? 'var(--blue)'
            : approved
              ? 'var(--red)'
              : 'var(--ink-soft)',
        }}
      >
        v{entry.version} · {isCurrent ? 'CURRENT' : 'RETIRED'}
      </p>

      {approved ? (
        <p className="text-[14px] font-semibold text-[var(--green)]">
          ✓ Approved by {entry.approvedBy} · {entry.approvedOn}
        </p>
      ) : (
        !isCurrent && <p className="text-[13px] text-[var(--ink-soft)]">Never approved</p>
      )}

      <p className="text-[13px] text-[var(--ink-soft)]">Created {entry.created}</p>
      <p className="wrapvalue text-[13px] text-[var(--ink-soft)]">{entry.note}</p>
    </div>
  )
}

export default function HistorySheet({
  history,
  onClose,
}: {
  history: VersionEntry[]
  onClose: () => void
}) {
  return (
    <Sheet
      title={`${RECORD.name} · version history`}
      subtitle="Packaging record · shared across collections"
      onClose={onClose}
      footer={
        <p className="text-[12px] text-[var(--ink-soft)]">
          Approval binds to a version number. Only the version shown as current can be sent.
        </p>
      }
    >
      <div className="flex flex-col gap-2">
        {[...history].reverse().map((entry) => (
          <Entry key={entry.version} entry={entry} />
        ))}
      </div>
    </Sheet>
  )
}
