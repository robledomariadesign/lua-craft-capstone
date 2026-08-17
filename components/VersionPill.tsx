'use client'

export default function VersionPill({
  version,
  onClick,
}: {
  version: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Version ${version} — open approval history`}
      className="relative shrink-0 rounded-[999px] bg-[var(--blue-tint)] px-[10px] py-[4px] text-[13px] font-semibold text-[var(--blue)] after:absolute after:left-1/2 after:top-1/2 after:h-[44px] after:w-[44px] after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"
    >
      v{version}
    </button>
  )
}
