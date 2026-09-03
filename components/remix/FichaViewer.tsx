'use client'

import { useState, useEffect, useRef } from 'react'
import * as pdfjs from 'pdfjs-dist'

// Set up the worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
}

interface FichaViewerProps {
  pdfPath: string
}

export default function FichaViewer({ pdfPath }: FichaViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [pinnedPage, setPinnedPage] = useState(2)
  const [zoomedPage, setZoomedPage] = useState<number | null>(null)

  return (
    <div className="w-full flex flex-col gap-2 bg-[var(--tint-deep)] rounded-[12px] p-2">
      {/* Pinned page */}
      <div
        className="w-full bg-[var(--surface)] rounded-[12px] aspect-[8.5/11] flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => setZoomedPage(pinnedPage)}
      >
        <PDFPageRenderer pdfPath={pdfPath} pageNumber={pinnedPage} scale={1.5} />
      </div>

      {/* Page strip */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setPinnedPage(page)}
            className={`shrink-0 w-12 h-16 rounded-[8px] border-2 flex items-center justify-center text-[11px] font-semibold transition-colors ${
              page === pinnedPage
                ? 'border-[var(--blue)] bg-[var(--blue-tint)]'
                : 'border-[var(--line)] bg-[var(--surface)]'
            }`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-12 bg-[var(--paper)] rounded-[4px]">
                <PDFPageRenderer pdfPath={pdfPath} pageNumber={page} scale={0.3} />
              </div>
              <span>{page}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Zoom modal */}
      {zoomedPage !== null && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.9)] flex items-center justify-center p-4"
          onClick={() => setZoomedPage(null)}
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setZoomedPage(null)}
              className="absolute top-4 right-4 text-white bg-[rgba(0,0,0,0.5)] rounded-full w-10 h-10 flex items-center justify-center font-semibold text-[14px]"
            >
              Close
            </button>
            <div className="bg-white rounded-[12px] overflow-auto max-h-[90vh] max-w-[90vw]">
              <PDFPageRenderer pdfPath={pdfPath} pageNumber={zoomedPage} scale={3} />
            </div>
          </div>
        </div>
      )}

      {/* PDF initialization */}
      <PDFInitializer pdfPath={pdfPath} onNumPages={setNumPages} />
    </div>
  )
}

function PDFInitializer({
  pdfPath,
  onNumPages,
}: {
  pdfPath: string
  onNumPages: (n: number) => void
}) {
  useEffect(() => {
    let isMounted = true

    const loadPDF = async () => {
      try {
        const pdf = await pdfjs.getDocument({ url: pdfPath }).promise
        if (isMounted) {
          onNumPages(pdf.numPages)
        }
      } catch (err) {
        console.error('Failed to load PDF:', err)
      }
    }

    loadPDF()
    return () => {
      isMounted = false
    }
  }, [pdfPath, onNumPages])

  return null
}

function PDFPageRenderer({
  pdfPath,
  pageNumber,
  scale,
}: {
  pdfPath: string
  pageNumber: number
  scale: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let isMounted = true

    const renderPage = async () => {
      try {
        const pdf = await pdfjs.getDocument({ url: pdfPath }).promise
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })

        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        } as any)
        await renderTask.promise
      } catch (err) {
        console.error(`Failed to render page ${pageNumber}:`, err)
      }
    }

    renderPage()
    return () => {
      isMounted = false
    }
  }, [pdfPath, pageNumber, scale])

  return <canvas ref={canvasRef} className="max-w-full h-auto" />
}
