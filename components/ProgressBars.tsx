export default function ProgressBars({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex w-full shrink-0 items-start gap-[6px] bg-[var(--surface)] px-4 py-[4px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-[4px] min-w-px flex-1 rounded-[2px]"
          style={{ background: i < filled ? 'var(--blue)' : 'var(--line)' }}
        />
      ))}
    </div>
  )
}
