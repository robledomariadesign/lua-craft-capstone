'use client'

import { useState } from 'react'

const NUM_PAGES = 6

interface FichaViewerProps {
  hidePinnedPage?: boolean
}

export default function FichaViewer({ hidePinnedPage = false }: FichaViewerProps) {
  const [pinnedPage, setPinnedPage] = useState(2)
  const [zoomedPage, setZoomedPage] = useState<number | null>(null)

  return (
    <div className={`w-full flex flex-col gap-2 bg-[var(--tint-deep)] rounded-[12px] p-2 ${
      hidePinnedPage ? 'max-h-[143px]' : ''
    }`}>
      {/* Pinned page - hidden when row is open */}
      {!hidePinnedPage && (
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
      )}

      {/* Page strip - numbered tiles instead of thumbnails */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {Array.from({ length: NUM_PAGES }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setPinnedPage(page)}
            className={`shrink-0 rounded-[6px] border-2 transition-colors font-semibold text-sm flex items-center justify-center ${
              page === pinnedPage
                ? 'border-[var(--blue)] bg-[var(--blue-tint)] text-[var(--blue)]'
                : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
            }`}
            style={{
              width: 'clamp(44px, 12.7vw, 50px)',
              aspectRatio: '50 / 62',
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Caption row */}
      <div className="flex justify-between items-center text-xs px-1 text-[var(--ink-soft)]">
        <span>FICHA TÉCNICA · OP 3338 · 6 PAGES</span>
        <span>Tap to zoom</span>
      </div>

      {/* Zoom modal - full screen with 2x zoom and pan capability */}
      {zoomedPage !== null && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.95)] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomedPage(null)
          }}
        >
          <div className="relative w-full h-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoomedPage(null)
              }}
              className="absolute top-4 right-4 text-white bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.9)] rounded-full w-10 h-10 flex items-center justify-center font-semibold z-10 cursor-pointer"
            >
              Close
            </button>
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
              <img
                src={`/ficha-op3338-p${zoomedPage}.jpg`}
                alt={`Ficha page ${zoomedPage} zoomed`}
                width={2000}
                height={2591}
                className="min-w-[200%] h-auto block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
