import Link from 'next/link'

export default function ResearchFooter() {
  return (
    <div className="safe-bottom shrink-0 px-4 py-4 border-t border-[var(--line)] text-center text-[12px] text-[var(--ink-soft)]">
      <p>
        Research versions:{' '}
        <Link href="/a" className="text-[var(--blue)] underline">
          A
        </Link>
        {' '}/{' '}
        <Link href="/b" className="text-[var(--blue)] underline">
          B
        </Link>
        {' '}/{' '}
        <Link href="/reset" className="text-[var(--blue)] underline">
          Reset
        </Link>
      </p>
    </div>
  )
}
