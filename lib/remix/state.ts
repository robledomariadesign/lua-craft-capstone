'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { RecordId } from './record'

export type { RecordId }

export type Status = 'unchecked' | 'match' | 'flagged'

export interface Mark {
  status: Status
  reason?: string
  markedAt?: string
  markedAgainstVersion: number
}

export interface Run {
  recordId: RecordId
  marks: Record<string, Mark>
  outcome: 'open' | 'approved' | 'corrected'
  outcomePanelDismissed: boolean
  specVersion: number
  events: { t: string; action: string; item?: string }[]
}

function createEmptyRun(recordId: RecordId, itemKeys: string[], specVersion: number): Run {
  return {
    recordId,
    marks: itemKeys.reduce((acc, key) => {
      acc[key] = {
        status: 'unchecked',
        markedAgainstVersion: specVersion,
      }
      return acc
    }, {} as Record<string, Mark>),
    outcome: 'open',
    outcomePanelDismissed: false,
    specVersion,
    events: [],
  }
}

function seedRun(recordId: RecordId, itemKeys: string[], specVersion: number): Run {
  const run = createEmptyRun(recordId, itemKeys, specVersion)
  run.events.push({
    t: new Date().toISOString(),
    action: 'seed',
  })
  return run
}

export function useRun(recordId: RecordId, itemKeys: string[], specVersion: number) {
  const [run, setRun] = useState<Run | null>(null)
  const [ready, setReady] = useState(false)

  // Memoize the storage key so it doesn't change on every render
  const storageKey = useMemo(() => `lua.remix.${recordId}.v1`, [recordId])
  const initialRun = useMemo(() => seedRun(recordId, itemKeys, specVersion), [recordId, itemKeys, specVersion])

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setRun(JSON.parse(stored))
      } catch {
        setRun(initialRun)
      }
    } else {
      setRun(initialRun)
    }
    setReady(true)
  }, [])

  // Persist to localStorage when run changes
  useEffect(() => {
    if (ready && run) {
      localStorage.setItem(storageKey, JSON.stringify(run))
    }
  }, [run, storageKey, ready])

  const setMark = useCallback((itemKey: string, status: Status, reason?: string) => {
    setRun((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        marks: {
          ...prev.marks,
          [itemKey]: {
            status,
            reason,
            markedAt: new Date().toISOString(),
            markedAgainstVersion: prev.specVersion,
          },
        },
        events: [
          ...prev.events,
          {
            t: new Date().toISOString(),
            action: status === 'flagged' ? 'flag' : 'match',
            item: itemKey,
          },
        ],
      }
    })
  }, [])

  const approve = useCallback(() => {
    setRun((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        outcome: 'approved' as const,
        events: [
          ...prev.events,
          {
            t: new Date().toISOString(),
            action: 'approve',
          },
        ],
      }
    })
  }, [])

  const correct = useCallback(() => {
    setRun((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        outcome: 'corrected' as const,
        specVersion: prev.specVersion + 1,
        events: [
          ...prev.events,
          {
            t: new Date().toISOString(),
            action: 'correct',
          },
        ],
      }
    })
  }, [])

  const resetRun = useCallback(() => {
    setRun(initialRun)
  }, [initialRun])

  const remaining = useMemo(() => {
    if (!run) return itemKeys.length
    return itemKeys.filter((key) => run.marks[key].status === 'unchecked').length
  }, [run, itemKeys])

  const flagged = useMemo(() => {
    if (!run) return []
    return itemKeys.filter((key) => run.marks[key].status === 'flagged')
  }, [run, itemKeys])

  const allChecked = useMemo(() => {
    if (!run) return false
    return itemKeys.every((key) => run.marks[key].status !== 'unchecked')
  }, [run, itemKeys])

  return {
    run: run || initialRun,
    ready,
    setMark,
    approve,
    correct,
    resetRun,
    remaining,
    flagged,
    allChecked,
  }
}
