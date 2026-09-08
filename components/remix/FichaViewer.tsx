'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const NUM_PAGES = 6

interface FichaViewerProps {
  hidePinnedPage?: boolean
}

export default function FichaViewer({ hidePinnedPage = false }: FichaViewerProps) {
  const [pinnedPage, setPinnedPage] = useState(2)
  const [zoomedPage, setZoomedPage] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Hydration: ensure we're on the client before rendering portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle Escape key to close zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedPage !== null) {
        setZoomedPage(null)
      }
    }
    if (zoomedPage !== null) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomedPage])

  // Reset scroll to top-left whenever the zoomed page changes
  useEffect(() => {
    if (zoomedPage !== null && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = 0
          scrollRef.current.scrollTop = 0
        }
      })
    }
  }, [zoomedPage])

  const tileStyle = {
    width: 'clamp(44px, 12.7vw, 50px)',
    aspectRatio: '50 / 62',
  }

  function renderTile(page: number, selected: boolean, onSelect: () => void) {
    return (
      <button
        key={page}
        type="button"
        onClick={onSelect}
        className={`relative shrink-0 overflow-hidden rounded-[6px] border-2 transition-colors ${
          selected ? 'border-[var(--blue)]' : 'border-[var(--line)]'
        }`}
        style={tileStyle}
      >
        <img
          src={`/ficha-op3338-p${page}-thumb.jpg`}
          alt={`Page ${page}`}
          width={240}
          height={312}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span
          className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-semibold py-0.5 ${
            selected ? 'bg-[var(--blue)] text-white' : 'bg-[rgba(0,0,0,0.55)] text-white'
          }`}
        >
          {page}
        </span>
      </button>
    )
  }

  // Zoom overlay rendered to document.body via portal (escapes shell-frame)
  const zoomOverlay = zoomedPage !== null && mounted ? createPortal(
    <>
      {/* Backdrop - tappable to close, z-40 below content */}
      <div
        className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.95)]"
        onClick={() => setZoomedPage(null)}
      />

      {/* Scrollable zoom container - z-50 above backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        <div ref={scrollRef} className="w-full h-full overflow-auto flex items-center justify-center">
          <img
            src={`/ficha-op3338-p${zoomedPage}.jpg`}
            alt={`Ficha page ${zoomedPage} zoomed`}
            width={2000}
            height={2591}
            className="block"
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* Page strip inside overlay - switch pages without closing, z-[55] */}
      <div
        className="fixed left-0 right-0 z-[55] flex gap-1.5 justify-center px-4"
        style={{
          bottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        {Array.from({ length: NUM_PAGES }, (_, i) => i + 1).map((page) =>
          renderTile(page, page === zoomedPage, () => {
            setPinnedPage(page)
            setZoomedPage(page)
          })
        )}
      </div>

      {/* Fixed Close button - z-[60] above all, always visible */}
      <button
        type="button"
        onClick={() => setZoomedPage(null)}
        className="fixed text-white bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.9)] rounded-full w-11 h-11 flex items-center justify-center font-semibold z-[60] cursor-pointer"
        style={{
          top: 'max(16px, env(safe-area-inset-top))',
          right: 'max(16px, env(safe-area-inset-right))',
        }}
      >
        Close
      </button>
    </>,
    document.body
  ) : null

  return (
    <div className="w-full flex flex-col gap-2 bg-[var(--tint-deep)] rounded-[12px] p-2">
      {/* Pinned page - always mounted; collapses via grid-template-rows so the
          transition is smooth instead of an abrupt mount/unmount. */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: hidePinnedPage ? '0fr' : '1fr' }}
      >
        <div className="overflow-hidden min-h-0">
          <button
            type="button"
            onClick={() => setZoomedPage(pinnedPage)}
            className="w-full bg-[var(--surface)] rounded-[12px] overflow-hidden border-none p-0 cursor-pointer"
          >
            <img
              src={`/ficha-op3338-p${pinnedPage}.jpg`}
              alt={`Ficha page ${pinnedPage}`}
              width={2000}
              height={2591}
              className="w-full h-auto block"
            />
          </button>
        </div>
      </div>

      {/* Page strip - numbered tiles with thumbnails. A tile always swaps the
          pinned page. It also opens zoom directly, but only when the pinned
          page isn't currently rendered (hidePinnedPage) — that's the same
          flag that controls the collapse above, so this can't drift out of
          sync with what's actually on screen. */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {Array.from({ length: NUM_PAGES }, (_, i) => i + 1).map((page) =>
          renderTile(page, page === pinnedPage, () => {
            setPinnedPage(page)
            if (hidePinnedPage) {
              setZoomedPage(page)
            }
          })
        )}
      </div>

      {/* Caption row */}
      <div className="flex justify-between items-center text-xs px-1 text-[var(--ink-soft)]">
        <span>FICHA TÉCNICA · OP 3338 · 6 PAGES</span>
        <button
          type="button"
          onClick={() => setZoomedPage(pinnedPage)}
          className="cursor-pointer"
        >
          Tap to zoom
        </button>
      </div>

      {/* Zoom overlay portal */}
      {zoomOverlay}
    </div>
  )
}
