'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { RECORDS, type RecordId } from '@/lib/remix/record'

interface RecordState {
  recordId: RecordId
  name: string
  markedCount: number
  totalItems: number
}

export default function ResetPage() {
  const [recordStates, setRecordStates] = useState<RecordState[]>([])
  const [clearedCount, setClearedCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load current state on mount
  useEffect(() => {
    const states = RECORDS.map((record) => {
      const storageKey = `lua.remix.${record.id}.v1`
      const stored = localStorage.getItem(storageKey)
      let markedCount = 0

      if (stored) {
        try {
          const run = JSON.parse(stored)
          markedCount = Object.values(run.marks).filter(
            (mark: any) => mark.status !== 'unchecked'
          ).length
        } catch {
          // Ignore parse errors
        }
      }

      return {
        recordId: record.id,
        name: record.name,
        markedCount,
        totalItems: record.items.length,
      }
    })

    setRecordStates(states)
    setIsLoading(false)
  }, [])

  const handleClearAll = () => {
    const keysToRemove: string[] = []

    // Find all keys starting with "lua."
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('lua.')) {
        keysToRemove.push(key)
      }
    }

    // Clear them
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    setClearedCount(keysToRemove.length)

    // Reset record states
    setRecordStates((prev) =>
      prev.map((state) => ({
        ...state,
        markedCount: 0,
      }))
    )
  }

  if (isLoading) {
    return <div>Reading storage</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#2196F3', textDecoration: 'underline', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
        ‹ Back to records
      </Link>
      <h1>Reset moderator control</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Current state</h2>
        <div>
          {recordStates.map((state) => (
            <div
              key={state.recordId}
              style={{
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                marginBottom: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div>
                <strong>{state.name}</strong> ({state.recordId})
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {state.markedCount} of {state.totalItems} items marked
              </div>
            </div>
          ))}
        </div>
      </section>

      {clearedCount === null && (
        <button
          onClick={handleClearAll}
          style={{
            padding: '10px 16px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Clear all localStorage keys (lua.*)
        </button>
      )}

      {clearedCount !== null && clearedCount > 0 && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#e8f5e9',
            border: '1px solid #4caf50',
            borderRadius: '6px',
            color: '#2e7d32',
          }}
        >
          <strong>Cleared {clearedCount} localStorage key(s)</strong>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            All records reset to 0 items marked. Verify by visiting /check/ref1 or /a or /b.
          </div>
        </div>
      )}

      {clearedCount === 0 && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            color: '#666',
          }}
        >
          <strong>No keys found</strong>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            No lua.* keys detected in localStorage. Nothing to clear.
          </div>
        </div>
      )}
    </div>
  )
}
