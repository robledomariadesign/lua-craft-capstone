'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RecordId } from './record'

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

  const storageKey = `lua.remix.${recordId}.v1`

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setRun(JSON.parse(stored))
      } catch {
        // If parse fails, start fresh
        setRun(seedRun(recordId, itemKeys, specVersion))
      }
    } else {
      setRun(seedRun(recordId, itemKeys, specVersion))
    }
    setReady(true)
  }, [recordId, storageKey, itemKeys, specVersion])

  // Persist run to localStorage whenever it changes
  useEffect(() => {
    if (ready && run) {
      localStorage.setItem(storageKey, JSON.stringify(run))
    }
  }, [run, ready, storageKey])

  const setMark = useCallback((itemKey: string, status: Status, reason?: string) => {
    setRun((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.marks[itemKey] = {
        status,
        reason,
        markedAt: new Date().toISOString(),
        markedAgainstVersion: prev.specVersion,
      }
      updated.events.push({
        t: new Date().toISOString(),
        action: status === 'flagged' ? 'flag' : 'match',
        item: itemKey,
      })
      return updated
    })
  }, [])

  const approve = useCallback(() => {
    setRun((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.outcome = 'approved'
      updated.events.push({
        t: new Date().toISOString(),
        action: 'approve',
      })
      return updated
    })
  }, [])

  const correct = useCallback(() => {
    setRun((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.outcome = 'corrected'
      updated.specVersion = prev.specVersion + 1
      updated.events.push({
        t: new Date().toISOString(),
        action: 'correct',
      })
      return updated
    })
  }, [])

  const dismissOutcomePanel = useCallback(() => {
    setRun((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.outcomePanelDismissed = true
      updated.events.push({
        t: new Date().toISOString(),
        action: 'dismiss-outcome',
      })
      return updated
    })
  }, [])

  const resetRun = useCallback(() => {
    setRun(seedRun(recordId, itemKeys, specVersion))
  }, [recordId, itemKeys, specVersion])

  const getRemaining = useCallback(() => {
    if (!run) return itemKeys.length
    return itemKeys.filter((key) => run.marks[key].status === 'unchecked').length
  }, [run, itemKeys])

  const getFlagged = useCallback(() => {
    if (!run) return []
    return itemKeys.filter((key) => run.marks[key].status === 'flagged')
  }, [run, itemKeys])

  const getAllChecked = useCallback(() => {
    if (!run) return false
    return itemKeys.every((key) => run.marks[key].status !== 'unchecked')
  }, [run, itemKeys])

  return {
    run: run || seedRun(recordId, itemKeys, specVersion),
    ready,
    setMark,
    approve,
    correct,
    dismissOutcomePanel,
    resetRun,
    remaining: getRemaining(),
    flagged: getFlagged(),
    allChecked: getAllChecked(),
  }
}
