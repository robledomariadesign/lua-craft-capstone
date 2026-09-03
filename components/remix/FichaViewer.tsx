'use client'

import { useState } from 'react'

const NUM_PAGES = 6

export default function FichaViewer() {
  const [pinnedPage, setPinnedPage] = useState(2)
  const [zoomedPage, setZoomedPage] = useState<number | null>(null)

  return (
    <div className="w-full flex flex-col gap-2 bg-[var(--tint-deep)] rounded-[12px] p-2">
      {/* Pinned page */}
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

      {/* Page strip */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {Array.from({ length: NUM_PAGES }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setPinnedPage(page)}
            className={`shrink-0 rounded-[8px] border-2 transition-colors flex flex-col items-center justify-center gap-0.5 p-1 ${
              page === pinnedPage
                ? 'border-[var(--blue)] bg-[var(--blue-tint)]'
                : 'border-[var(--line)] bg-[var(--surface)]'
            }`}
          >
            <img
              src={`/ficha-op3338-p${page}-thumb.jpg`}
              alt={`Page ${page}`}
              width={240}
              height={312}
              className="w-12 h-16 object-cover rounded-[4px]"
            />
            <span className="text-[10px] font-semibold">{page}</span>
          </button>
        ))}
      </div>

      {/* Zoom modal */}
      {zoomedPage !== null && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.9)] flex items-center justify-center p-4"
          onClick={() => setZoomedPage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <button
              type="button"
              onClick={() => setZoomedPage(null)}
              className="absolute top-4 right-4 text-white bg-[rgba(0,0,0,0.5)] rounded-full w-10 h-10 flex items-center justify-center font-semibold text-[14px] z-10"
            >
              Close
            </button>
            <div className="bg-white rounded-[12px] overflow-auto max-h-[90vh] max-w-[90vw]">
              <img
                src={`/ficha-op3338-p${zoomedPage}.jpg`}
                alt={`Ficha page ${zoomedPage} zoomed`}
                width={2000}
                height={2591}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
