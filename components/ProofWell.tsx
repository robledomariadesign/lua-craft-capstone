'use client'

import { useState } from 'react'
import { RECORD } from '@/lib/record'

function Well({ big, src }: { big?: boolean; src: string | null }) {
  return (
    <div
      className="relative flex w-full flex-col items-center justify-center gap-[4px] overflow-hidden bg-[var(--tint-deep)]"
      style={{ padding: big ? '120px 0' : '44px 0' }}
    >
      {/* Swappable: drop a real proof at /public/proof.png and it takes over. */}
      {src ? (
        // A research prototype swaps this file by hand; next/image would add a
        // build step for no benefit.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="What the printer sent"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <>
          <p
            className="text-[12px] font-semibold text-[var(--ink-faint)]"
            style={{ letterSpacing: '1px' }}
          >
            WHAT THE PRINTER SENT
          </p>
          <p className="text-[13px] text-[var(--ink-soft)]">{RECORD.proofReceived}</p>
        </>
      )}
    </div>
  )
}

export default function ProofWell({ src }: { src: string | null }) {
  const [zoom, setZoom] = useState(false)
  return (
    <>
      <div className="w-full shrink-0 overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--tint)]">
        <Well src={src} />
        <div className="flex w-full items-center justify-between gap-2 bg-[var(--surface)] px-3 py-2 text-[12px]">
          <p className="font-medium text-[var(--ink-soft)]">{RECORD.proofLabel}</p>
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="min-h-[44px] shrink-0 font-semibold text-[var(--blue)]"
          >
            Zoom Image
          </button>
        </div>
      </div>

      {zoom && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[rgba(28,28,31,.92)]">
          <div className="safe-bottom flex shrink-0 items-center justify-end px-4 py-3">
            <button
              type="button"
              onClick={() => setZoom(false)}
              className="min-h-[44px] px-2 text-[17px] font-semibold text-white"
            >
              Close
            </button>
          </div>
          <div className="flex flex-1 items-center overflow-y-auto px-4 pb-6">
            <div className="w-full overflow-hidden rounded-[16px] border border-[var(--line)]">
              <Well big src={src} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
