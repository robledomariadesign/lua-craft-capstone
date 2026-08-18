import type { SpecItem } from '@/lib/record'

export default function StepCard({ item, version }: { item: SpecItem; version: number }) {
  return (
    <>
      <div
        className="flex w-full shrink-0 flex-col gap-[6px] rounded-[16px] bg-[var(--surface)] p-4"
        style={{ border: '1.5px solid var(--blue)' }}
      >
        <p
          className="text-[10px] font-semibold text-[var(--blue)]"
          style={{ letterSpacing: '.8px' }}
        >
          YOUR RECORD SAYS · spec v{version}
        </p>
        <p
          className="wrapvalue text-[19px] font-medium text-[var(--ink)]"
          style={{ lineHeight: '27px' }}
        >
          {item.record}
        </p>
        <p className="wrapvalue text-[12px] text-[var(--ink-soft)]">{item.recordHint}</p>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-[6px] rounded-[16px] border border-[var(--line)] bg-[var(--tint)] p-4">
        <p
          className="text-[10px] font-semibold text-[var(--ink-soft)]"
          style={{ letterSpacing: '.8px' }}
        >
          WHAT THE PRINTER SENT
        </p>
        <p
          className="wrapvalue text-[19px] font-medium text-[var(--ink)]"
          style={{ lineHeight: '27px' }}
        >
          {item.proof}
        </p>
        <p className="wrapvalue text-[12px] text-[var(--ink-soft)]">{item.proofHint}</p>
      </div>

      <p
        className="wrapvalue text-[15px] text-[var(--ink-soft)]"
        style={{ lineHeight: '21px' }}
      >
        {item.question}
      </p>
    </>
  )
}
