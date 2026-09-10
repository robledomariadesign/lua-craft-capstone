import type { SpecItem } from '@/lib/remix/record'

interface RecordCardProps {
  item: SpecItem
}

export default function RecordCard({ item }: RecordCardProps) {
  return (
    <div className="w-full rounded-[16px] border border-[var(--line)] bg-[var(--tint)] p-4">
      <div className="text-[13px] font-semibold text-[var(--ink-soft)] mb-2">
        YOUR RECORD SAYS
      </div>

      {item.type === 'string' && item.lines ? (
        <div className="space-y-2">
          {item.lines.map((line) => (
            <div key={line.label}>
              <div className="text-[12px] text-[var(--ink-soft)] mb-1">
                {line.label}
              </div>
              <div
                className="text-[16px] text-[var(--ink)] select-all"
                style={{ wordBreak: 'break-word' }}
              >
                {line.value}
              </div>
            </div>
          ))}
        </div>
      ) : item.type === 'string' ? (
        <div
          className="text-[16px] text-[var(--ink)] select-all"
          style={{ wordBreak: 'break-word' }}
        >
          {item.value}
        </div>
      ) : item.type === 'measurement' ? (
        <div className="text-[16px] text-[var(--ink)]">
          {item.value}
        </div>
      ) : item.type === 'yesno' && item.lines ? (
        <div className="space-y-2">
          {item.lines.map((line) => (
            <div key={line.label} className="flex items-center gap-2">
              <span className={`text-[16px] ${line.value === 'Yes' ? 'text-[var(--green)]' : 'text-[var(--ink-soft)]'}`}>
                {line.value === 'Yes' ? '✓' : '—'}
              </span>
              <span className="text-[14px] text-[var(--ink)]">
                {line.label}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="text-[13px] text-[var(--ink-soft)] mt-3 leading-[18px]">
        {item.hint}
      </div>
    </div>
  )
}
