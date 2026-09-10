interface CoverageCounterProps {
  confirmed: number
  total: number
}

export default function CoverageCounter({ confirmed, total }: CoverageCounterProps) {
  return (
    <div className="text-[15px] font-semibold text-[var(--ink)]">
      {confirmed} of {total} confirmed
    </div>
  )
}
