'use client'

import Link from 'next/link'
import { useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import ProofWell from '@/components/ProofWell'
import SpecRow from '@/components/SpecRow'
import VersionPill from '@/components/VersionPill'
import ActionButton from '@/components/ActionButton'
import FlagSheet from '@/components/FlagSheet'
import HistorySheet from '@/components/HistorySheet'
import OutcomePanel from '@/components/OutcomePanel'
import { ITEMS, RECORD, type ItemKey, type SpecItem } from '@/lib/record'
import { useRun } from '@/lib/state'

export default function VersionAClient({ proofSrc }: { proofSrc: string | null }) {
  const { run, ready, setMark, approve, correct, reset, checked, remaining, flagged, allChecked } =
    useRun('a')
  const [expanded, setExpanded] = useState<ItemKey | null>(null)
  const [flagging, setFlagging] = useState<SpecItem | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const locked = run.outcome !== 'open'

  // Hold the first paint until localStorage has been read, so a restored run never
  // flashes as unchecked. Identical to /b — the versions must not differ here.
  if (!ready) return <PhoneShell />

  return (
    <PhoneShell>
      <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-[var(--surface)] px-4 py-2">
        <Link href="/" className="shrink-0 text-[17px] text-[var(--blue)]">
          ‹ Records
        </Link>
        {/* 16px, not the 17px of §7.2, so the nav title is identical to Version B's.
            §0 rule 1 — the versions may differ only in interaction — outranks the
            per-screen typography spec, and at 393px the longer `v3 · current` pill
            wrapped a 17px title onto two lines. */}
        <p className="wrapvalue text-center text-[16px] font-semibold text-[var(--ink)]">
          {RECORD.name}
        </p>
        <VersionPill version={run.specVersion} onClick={() => setShowHistory(true)} />
      </div>

      <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto bg-[var(--surface)] px-4 py-2">
        <ProofWell src={proofSrc} />

        <div className="flex w-full shrink-0 items-start justify-between gap-2 text-[12px] font-semibold">
          <p className="text-[var(--ink-soft)]" style={{ letterSpacing: '.6px' }}>
            YOUR RECORD · spec v{run.specVersion} ·{' '}
            {run.outcome === 'corrected' ? 'saved today' : `saved ${RECORD.savedOn}`}
          </p>
          <p className="shrink-0 text-[var(--ink)]">{checked} of {ITEMS.length} checked</p>
        </div>

        <div className="flex w-full flex-col gap-2">
          {ITEMS.map((item) => (
            <SpecRow
              key={item.key}
              item={item}
              mark={run.marks[item.key]}
              expanded={expanded === item.key}
              locked={locked}
              onToggle={() => setExpanded(expanded === item.key ? null : item.key)}
              onMatch={() => {
                setMark(item.key, 'match')
                setExpanded(null)
              }}
              onFlag={() => setFlagging(item)}
            />
          ))}
        </div>
      </div>

      <div className="safe-bottom flex w-full shrink-0 flex-col gap-[6px] bg-[var(--surface)] px-4 pt-[10px]">
        {locked ? (
          <OutcomePanel run={run} onReset={reset} />
        ) : !allChecked ? (
          <>
            <ActionButton variant="disabled">Approve v{run.specVersion} for production</ActionButton>
            <p className="w-full text-center text-[12px] text-[var(--ink-soft)]">
              {remaining} item{remaining === 1 ? '' : 's'} still to check · approve unlocks once
              every item has your mark
            </p>
          </>
        ) : flagged.length === 0 ? (
          <>
            <ActionButton variant="green" onClick={approve}>
              Approve v{run.specVersion} for production
            </ActionButton>
            <p className="w-full text-center text-[12px] text-[var(--ink-soft)]">
              Approving binds this run to spec v{run.specVersion} ·{' '}
              {RECORD.quantity.toLocaleString('en-US')} units · supplier minimum{' '}
              {RECORD.supplierMinimum} · lead time starts on approval
            </p>
          </>
        ) : (
          <>
            <div className="w-full rounded-[12px] bg-[var(--red-tint)] px-[14px] py-3">
              <p className="wrapvalue text-[13px] text-[var(--red)]" style={{ lineHeight: '18px' }}>
                v{run.specVersion} cannot be approved with a flagged item. Correcting the record
                retires v{run.specVersion} and creates v{run.specVersion + 1} — the correction never
                lives only in chat.
              </p>
            </div>
            <ActionButton variant="blue" onClick={correct}>
              Correct the record — creates v{run.specVersion + 1}
            </ActionButton>
            <p className="w-full text-center text-[12px] text-[var(--ink-soft)]">
              Nothing is sent from here — you send the sheet yourself on WhatsApp
            </p>
          </>
        )}
      </div>

      {flagging ? (
        <FlagSheet
          item={flagging}
          onCancel={() => setFlagging(null)}
          onSave={(reason) => {
            setMark(flagging.key, 'flagged', reason)
            setFlagging(null)
            setExpanded(null)
          }}
        />
      ) : null}

      {showHistory ? (
        <HistorySheet history={run.history} onClose={() => setShowHistory(false)} />
      ) : null}
    </PhoneShell>
  )
}
