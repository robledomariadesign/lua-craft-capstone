'use client'

import Link from 'next/link'
import { useState } from 'react'
import { resetAll } from '@/lib/state'

export default function Home() {
  const [reset, setReset] = useState(false)

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[34rem] flex-col gap-6 px-5 py-10">
      <h1 className="text-[28px] font-bold text-[var(--ink)]">Lua Craft · Printer check</h1>

      <p className="wrapvalue text-[16px] leading-[24px] text-[var(--ink-soft)]">
        The Luna Necklace card, spec v3, saved Feb 4. The printer sent back the February card
        today over WhatsApp. Both versions start from this same record and the same photo
        from the printer.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/a"
          className="flex min-h-[56px] flex-1 flex-col justify-center gap-1 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
        >
          <span className="text-[17px] font-semibold text-[var(--ink)]">
            Version A · Side-by-side
          </span>
          <span className="text-[13px] text-[var(--ink-soft)]">
            The whole record and what the printer sent on one screen. Check in any order.
          </span>
        </Link>

        <Link
          href="/b"
          className="flex min-h-[56px] flex-1 flex-col justify-center gap-1 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
        >
          <span className="text-[17px] font-semibold text-[var(--ink)]">
            Version B · One at a time
          </span>
          <span className="text-[13px] text-[var(--ink-soft)]">
            Five items, one screen each, then a summary.
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            resetAll()
            setReset(true)
            window.setTimeout(() => setReset(false), 2000)
          }}
          className="min-h-[44px] rounded-[12px] bg-[var(--chip-bg)] px-4 text-[15px] font-semibold text-[var(--chip-text)]"
        >
          Reset both to seed
        </button>
        {reset ? <span className="text-[15px] text-[var(--green)]">Reset.</span> : null}
      </div>

      <p className="mt-auto text-[13px] text-[var(--ink-soft)]">
        Prototype for research. Nothing here is sent anywhere.
      </p>
    </main>
  )
}
