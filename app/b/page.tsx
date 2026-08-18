'use client'

import Link from 'next/link'
import { useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import ProgressBars from '@/components/ProgressBars'
import StepCard from '@/components/StepCard'
import VersionPill from '@/components/VersionPill'
import ActionButton from '@/components/ActionButton'
import FlagSheet from '@/components/FlagSheet'
import HistorySheet from '@/components/HistorySheet'
import OutcomePanel from '@/components/OutcomePanel'
import ResultRow from '@/components/ResultRow'
import { ITEMS, RECORD, type ItemKey, type SpecItem } from '@/lib/record'
import { useRun } from '@/lib/state'

const SUMMARY = ITEMS.length + 1

export default function VersionB() {
  const { run, ready, setMark, approve, correct, reset, remaining, flagged, allChecked } =
    useRun('b')

  // The step is DERIVED from the marks, never stored alongside them. The first
  // item without a mark is where the run stands, so leaving and re-entering /b
  // lands on the step after the last item marked, and Start over lands on step 1
  // because the marks it clears are the only thing the step reads.
  const firstUnmarked = ITEMS.findIndex((i) => run.marks[i.key].status === 'unchecked')
  const derivedStep = firstUnmarked === -1 ? SUMMARY : firstUnmarked + 1

  // `revisiting` is the ONE override that sits on top of the derived step, and it
  // clears the moment the participant returns to the summary. It is set only from
  // the summary — by tapping a result row, or by ‹ Back — so the first pass through
  // items 1–5 stays forward-only (plan §13.7). Version A already allows revision by
  // tapping a marked chip (§7.2); this closes that asymmetry, which would otherwise
  // confound catch rate between the two versions.
  const [revisiting, setRevisiting] = useState<number | null>(null)
  const step = revisiting ?? derivedStep

  const [flagging, setFlagging] = useState<SpecItem | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const isSummary = step >= SUMMARY
  const item = isSummary ? null : ITEMS[step - 1]
  const locked = run.outcome !== 'open'

  const headline =
    flagged.length === 0
      ? 'Everything matches'
      : `${flagged.length} item${flagged.length === 1 ? '' : 's'} flagged`

  // Marking always hands control back to the derived step. From a revisited step
  // every item already carries a mark, so that lands on the summary rather than
  // walking the participant forward into the next item.
  const mark = (key: ItemKey, reason?: string) => {
    setMark(key, reason === undefined ? 'match' : 'flagged', reason)
    setRevisiting(null)
  }

  const startOver = () => {
    setRevisiting(null)
    reset()
  }

  // Hold the first paint until localStorage has been read, so a restored run
  // never flashes step 1 before jumping to where the participant actually was.
  if (!ready) return <PhoneShell />

  return (
    <PhoneShell>
      {/* Nav matches Version A: [‹ Exit] [title] [version pill] — plan §7.3 + §13.5 */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-[var(--surface)] px-4 py-2">
        {isSummary ? (
          <button
            type="button"
            onClick={() => setRevisiting(ITEMS.length)}
            className="shrink-0 text-[17px] text-[var(--blue)]"
          >
            ‹ Back
          </button>
        ) : (
          <Link href="/" className="shrink-0 text-[17px] text-[var(--blue)]">
            ‹ Exit
          </Link>
        )}

        <p className="wrapvalue text-center text-[16px] font-semibold text-[var(--ink)]">
          {RECORD.name}
        </p>

        <VersionPill version={run.specVersion} onClick={() => setShowHistory(true)} />
      </div>

      <ProgressBars filled={isSummary ? ITEMS.length : step} total={ITEMS.length} />

      <div className="flex w-full flex-1 flex-col gap-[14px] overflow-y-auto bg-[var(--surface)] px-4 pb-2 pt-4">
        {item ? (
          <>
            {revisiting !== null ? (
              <button
                type="button"
                onClick={() => setRevisiting(null)}
                className="flex min-h-[44px] shrink-0 items-center self-start text-[17px] text-[var(--blue)]"
              >
                ‹ Back to summary
              </button>
            ) : null}

            <p
              className="text-[12px] font-semibold text-[var(--ink-soft)]"
              style={{ letterSpacing: '1px' }}
            >
              ITEM {step} OF {ITEMS.length}
            </p>
            <p className="wrapvalue text-[26px] font-bold text-[var(--ink)]">{item.title}</p>
            <StepCard item={item} version={run.specVersion} />

            {/* The mark currently on record, in the same row the participant tapped. */}
            {revisiting !== null ? <ResultRow item={item} mark={run.marks[item.key]} /> : null}
          </>
        ) : (
          <>
            <p
              className="text-[12px] font-semibold text-[var(--ink-soft)]"
              style={{ letterSpacing: '1px' }}
            >
              ALL ITEMS CHECKED
            </p>
            <p className="wrapvalue text-[26px] font-bold text-[var(--ink)]">{headline}</p>

            <div className="flex w-full flex-col gap-2">
              {ITEMS.map((row, i) => (
                <ResultRow
                  key={row.key}
                  item={row}
                  mark={run.marks[row.key]}
                  onRevisit={locked ? undefined : () => setRevisiting(i + 1)}
                />
              ))}
            </div>

            {allChecked && flagged.length > 0 && !locked ? (
              <div className="w-full rounded-[12px] bg-[var(--red-tint)] px-[14px] py-3">
                <p
                  className="wrapvalue text-[13px] text-[var(--red)]"
                  style={{ lineHeight: '18px' }}
                >
                  v{run.specVersion} cannot be approved with a flagged item. Correcting the record
                  retires v{run.specVersion} and creates v{run.specVersion + 1} — the correction
                  never lives only in chat.
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="safe-bottom flex w-full shrink-0 flex-col gap-2 bg-[var(--surface)] px-4 pt-[10px]">
        {item ? (
          <div className="flex w-full gap-[10px]">
            <ActionButton variant="red-tint" onClick={() => setFlagging(item)}>
              Flag · say why
            </ActionButton>
            <ActionButton variant="green" onClick={() => mark(item.key)}>
              Match
            </ActionButton>
          </div>
        ) : locked ? (
          <OutcomePanel run={run} onReset={startOver} />
        ) : !allChecked ? (
          // Derived from the marks on every render — never stored beside them.
          <>
            <ActionButton variant="disabled">
              Approve v{run.specVersion} for production
            </ActionButton>
            <p className="w-full text-center text-[13px] text-[var(--ink-soft)]">
              {remaining} item{remaining === 1 ? '' : 's'} still to check · approve unlocks once
              every item has your mark
            </p>
          </>
        ) : (
          <>
            {flagged.length > 0 ? (
              <ActionButton variant="blue" onClick={correct}>
                Correct the record — creates v{run.specVersion + 1}
              </ActionButton>
            ) : (
              <ActionButton variant="green" onClick={approve}>
                Approve v{run.specVersion} for production
              </ActionButton>
            )}
            <p className="w-full text-center text-[13px] text-[var(--ink-soft)]">
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
            mark(flagging.key, reason)
            setFlagging(null)
          }}
        />
      ) : null}

      {showHistory ? (
        <HistorySheet history={run.history} onClose={() => setShowHistory(false)} />
      ) : null}
    </PhoneShell>
  )
}
