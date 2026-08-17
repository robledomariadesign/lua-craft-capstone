'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HISTORY, ITEMS, type ItemKey, type VersionEntry, itemByKey } from './record'

export type Status = 'unchecked' | 'match' | 'flagged'
export type Outcome = 'open' | 'approved' | 'corrected'

export interface Mark {
  status: Status
  reason?: string
  markedAt?: string
}

export interface RunEvent {
  t: string
  action: string
  item?: ItemKey
}

export interface Run {
  marks: Record<ItemKey, Mark>
  outcome: Outcome
  specVersion: number
  history: VersionEntry[]
  events: RunEvent[]
}

export type Version = 'a' | 'b'

const KEYS: Record<Version, string> = {
  a: 'lua.proof.a.v1',
  b: 'lua.proof.b.v1',
}

export function seedRun(): Run {
  const marks = {} as Record<ItemKey, Mark>
  for (const item of ITEMS) marks[item.key] = { status: 'unchecked' }
  return {
    marks,
    outcome: 'open',
    specVersion: 3,
    history: HISTORY.map((h) => ({ ...h })),
    events: [],
  }
}

export function resetAll() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEYS.a)
  window.localStorage.removeItem(KEYS.b)
}

export function useRun(version: Version) {
  const [run, setRun] = useState<Run>(seedRun)
  const [ready, setReady] = useState(false)
  const key = KEYS[version]
  const readyRef = useRef(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) setRun({ ...seedRun(), ...(JSON.parse(raw) as Run) })
    } catch {
      /* corrupt or unavailable storage falls back to seed */
    }
    readyRef.current = true
    setReady(true)
  }, [key])

  useEffect(() => {
    if (!readyRef.current) return
    try {
      window.localStorage.setItem(key, JSON.stringify(run))
    } catch {
      /* storage full or blocked; the session still works in memory */
    }
  }, [key, run])

  const log = (r: Run, action: string, item?: ItemKey): Run => ({
    ...r,
    events: [...r.events, { t: new Date().toISOString(), action, item }],
  })

  const setMark = useCallback((item: ItemKey, status: Status, reason?: string) => {
    setRun((r) =>
      log(
        {
          ...r,
          marks: {
            ...r.marks,
            [item]: { status, reason, markedAt: new Date().toISOString() },
          },
        },
        status,
        item,
      ),
    )
  }, [])

  const clearMark = useCallback((item: ItemKey) => {
    setRun((r) =>
      log({ ...r, marks: { ...r.marks, [item]: { status: 'unchecked' } } }, 'unmark', item),
    )
  }, [])

  const approve = useCallback(() => {
    setRun((r) =>
      log(
        {
          ...r,
          outcome: 'approved',
          history: r.history.map((h) =>
            h.version === r.specVersion
              ? { ...h, approvedBy: 'Luisa', approvedOn: 'today', note: 'Approved today · bound to this version' }
              : h,
          ),
        },
        'approve',
      ),
    )
  }, [])

  const correct = useCallback(() => {
    setRun((r) => {
      const flagged = ITEMS.filter((i) => r.marks[i.key].status === 'flagged')
      const labels = flagged.map((i) => i.title).join(', ')
      const next = r.specVersion + 1
      return log(
        {
          ...r,
          outcome: 'corrected',
          specVersion: next,
          history: [
            ...r.history.map((h) =>
              h.version === r.specVersion
                ? {
                    ...h,
                    status: 'retired' as const,
                    note: `Retired today — corrected: ${labels}`,
                  }
                : h,
            ),
            {
              version: next,
              created: 'today',
              status: 'current' as const,
              note: `Corrected from v${r.specVersion} — ${flagged.length} item${
                flagged.length === 1 ? '' : 's'
              }`,
            },
          ],
        },
        'correct',
      )
    })
  }, [])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
    setRun(seedRun())
  }, [key])

  const checked = ITEMS.filter((i) => run.marks[i.key].status !== 'unchecked').length
  const flagged = ITEMS.filter((i) => run.marks[i.key].status === 'flagged')

  return {
    run,
    ready,
    setMark,
    clearMark,
    approve,
    correct,
    reset,
    checked,
    remaining: ITEMS.length - checked,
    flagged,
    allChecked: checked === ITEMS.length,
    itemByKey,
  }
}
