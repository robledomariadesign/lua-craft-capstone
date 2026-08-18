'use client'

import { useCallback, useEffect, useState } from 'react'
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

  // Read first. This effect must be able to run more than once (React StrictMode
  // double-invokes it in dev) without the write effect below having clobbered the
  // stored run in between — which is exactly what a ref-based guard did, and why
  // re-entering /b used to come back empty.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      // Plan §6 requires reading localStorage inside an effect so the server render
      // and the first client render agree; hydrating during render would reintroduce
      // the mismatch. The cascading render this warns about is the intended one.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setRun({ ...seedRun(), ...(JSON.parse(raw) as Run) })
    } catch {
      /* corrupt or unavailable storage falls back to seed */
    }
    setReady(true)
  }, [key])

  // Write only once `ready` is true as STATE, not as a ref. State flips on the
  // next render — the same render that carries the hydrated run — so the seed can
  // never be written over a saved run.
  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(key, JSON.stringify(run))
    } catch {
      /* storage full or blocked; the session still works in memory */
    }
  }, [key, run, ready])

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

  // The single source of truth for a reset. seedRun() rebuilds marks (all
  // unchecked), outcome ('open'), specVersion (3) and a fresh copy of HISTORY —
  // so the v4 entry disappears and v3 goes back to 'current' in one move. Nothing
  // derived from a run is stored separately, so nothing else needs clearing.
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
