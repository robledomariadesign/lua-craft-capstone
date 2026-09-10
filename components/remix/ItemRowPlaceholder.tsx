import type { SpecItem } from '@/lib/remix/record'

// Pre-hydration stand-in for ItemRow's resting state. Mirrors its markup
// exactly (same padding, same min-height) except the status chip, which
// cannot be known until the run has hydrated from localStorage — that
// becomes a fixed, non-animated block sized to match the chip it replaces.
interface ItemRowPlaceholderProps {
  item: SpecItem
}

export default function ItemRowPlaceholder({ item }: ItemRowPlaceholderProps) {
  return (
    <div className="flex flex-col w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-[14px] py-3">
      <div className="flex items-center gap-2 min-h-[44px]">
        <div className="flex-1">
          <div className="text-[15px] font-serif font-semibold text-[var(--ink)]">{item.label}</div>
          <div className="text-[14px] text-[var(--ink-soft)] mt-0.5 truncate">
            {item.summary}
          </div>
        </div>
        <div className="shrink-0 w-[64px] h-[27px] rounded-[12px] bg-[var(--tint-deep)]" />
      </div>
    </div>
  )
}
