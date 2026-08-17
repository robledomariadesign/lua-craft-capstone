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
import { ITEMS, RECORD, type SpecItem } from '@/lib/record'
import { useRun } from '@/lib/state'

export default function VersionB() {
  const { run, setMark, approve, correct, reset, flagged } = useRun('b')
  const [step, setStep] = useState<number>(1) // 1..5, then 6 = summary
  const [flagging, setFlagging] = useState<SpecItem | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const isSummary = step > ITEMS.length
  const item = isSummary ? null : ITEMS[step - 1]
  const locked = run.outcome !== 'open'

  const headline =
    flagged.length === 0
      ? 'Everything matches'
      : `${flagged.length} item${flagged.length === 1 ? '' : 's'} flagged`

  return (
    <PhoneShell>
      <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-[var(--surface)] px-4 py-2">
        {isSummary ? (
          <button
            type="button"
            onClick={() => setStep(ITEMS.length)}
            className="shrink-0 text-[17px] text-[var(--blue)]"
          >
            ‹ Back
          </button>
        ) : (
          <Link href="/" className="shrink-0 text-[17px] text-[var(--blue)]">
            ‹ Exit
          </Link>
        )}

        <div className="flex min-w-0 items-center justify-center gap-[6px]">
          <p className="wrapvalue text-center text-[16px] font-semibold text-[var(--ink)]">
            {RECORD.name}
          </p>
          <VersionPill version={run.specVersion} onClick={() => setShowHistory(true)} />
        </div>

        {isSummary ? (
          <span aria-hidden className="w-[42px] shrink-0" />
        ) : (
          <p className="shrink-0 text-[15px] font-semibold text-[var(--ink-soft)]">
            {step}/{ITEMS.length}
          </p>
        )}
      </div>

      <ProgressBars filled={isSummary ? ITEMS.length : step} total={ITEMS.length} />

      <div className="flex w-full flex-1 flex-col gap-[14px] overflow-y-auto bg-[var(--surface)] px-4 pb-2 pt-4">
        {item ? (
          <>
            <p
              className="text-[12px] font-semibold text-[var(--ink-soft)]"
              style={{ letterSpacing: '1px' }}
            >
              ITEM {step} OF {ITEMS.length}
            </p>
            <p className="wrapvalue text-[26px] font-bold text-[var(--ink)]">{item.title}</p>
            <StepCard item={item} version={run.specVersion} />
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
              {ITEMS.map((row) => {
                const mark = run.marks[row.key]
                const isFlagged = mark.status === 'flagged'
                return (
                  <div
                    key={row.key}
                    className="w-full rounded-[12px] bg-[var(--surface)] px-[14px] py-3"
                    style={{
                      border: isFlagged ? '1.5px solid var(--red)' : '1px solid var(--line)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="wrapvalue text-[15px] font-medium text-[var(--ink)]">
                        {row.title}
                      </p>
                      {isFlagged ? (
                        <p className="wrapvalue text-right text-[13px] font-semibold text-[var(--red)]">
                          ⚑ Flagged · {row.proof}
                        </p>
                      ) : mark.status === 'match' ? (
                        <p className="shrink-0 text-[13px] font-semibold text-[var(--green)]">
                          ✓ Match
                        </p>
                      ) : (
                        <p className="shrink-0 text-[13px] font-semibold text-[var(--ink-soft)]">
                          Not checked
                        </p>
                      )}
                    </div>
                    {isFlagged && mark.reason ? (
                      <p className="wrapvalue mt-1 text-[12px] text-[var(--ink-soft)]">
                        {mark.reason}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>

            {flagged.length > 0 && !locked ? (
              <div className="w-full rounded-[12px] bg-[var(--red-tint)] px-[14px] py-3">
                <p
                  className="wrapvalue text-[13px] text-[var(--red)]"
                  style={{ lineHeight: '18px' }}
                >
                  V{run.specVersion} cannot be approved with a flagged item. Correcting the record
                  retires V{run.specVersion} and creates V{run.specVersion + 1} — the correction
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
            <ActionButton
              variant="green"
              onClick={() => {
                setMark(item.key, 'match')
                setStep(step + 1)
              }}
            >
              Match
            </ActionButton>
          </div>
        ) : locked ? (
          <OutcomePanel run={run} onReset={reset} />
        ) : (
          <>
            {flagged.length > 0 ? (
              <ActionButton variant="blue" onClick={correct}>
                Correct the record — creates V{run.specVersion + 1}
              </ActionButton>
            ) : (
              <ActionButton variant="green" onClick={approve}>
                Approve V{run.specVersion} for production
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
            setMark(flagging.key, 'flagged', reason)
            setFlagging(null)
            setStep((s) => s + 1)
          }}
        />
      ) : null}

      {showHistory ? (
        <HistorySheet history={run.history} onClose={() => setShowHistory(false)} />
      ) : null}
    </PhoneShell>
  )
}
