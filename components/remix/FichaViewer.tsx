'use client'

import { useState, useEffect, useRef } from 'react'
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface FichaViewerProps {
  pdfPath: string
}

export default function FichaViewer({ pdfPath }: FichaViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [pinnedPage, setPinnedPage] = useState(2) // Page 2 by default
  const [zoomedPage, setZoomedPage] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-2 bg-[var(--tint-deep)] rounded-[12px] p-2">
      {/* Pinned page */}
      <div
        className="w-full bg-[var(--surface)] rounded-[12px] aspect-[8.5/11] flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => setZoomedPage(pinnedPage)}
      >
        <PDFPage pdfPath={pdfPath} pageNumber={pinnedPage} scale={1.5} />
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
              <div className="w-full aspect-[8.5/11] bg-[var(--paper)] rounded-[4px] text-[10px]">
                <PDFPage pdfPath={pdfPath} pageNumber={page} scale={0.5} />
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
          <div className="relative max-w-full max-h-full">
            <button
              type="button"
              onClick={() => setZoomedPage(null)}
              className="absolute top-4 right-4 text-white bg-[rgba(0,0,0,0.5)] rounded-full w-10 h-10 flex items-center justify-center font-semibold"
            >
              Close
            </button>
            <div className="bg-white rounded-[12px] overflow-auto max-h-[90vh] max-w-[90vw]">
              <PDFPage pdfPath={pdfPath} pageNumber={zoomedPage} scale={3} />
            </div>
          </div>
        </div>
      )}

      {/* PDF initialization — counts pages */}
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
        const pdf = await pdfjs.getDocument(pdfPath).promise
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

function PDFPage({
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
        const pdf = await pdfjs.getDocument(pdfPath).promise
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })

        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context, viewport }).promise
      } catch (err) {
        console.error(`Failed to render page ${pageNumber}:`, err)
      }
    }

    renderPage()
    return () => {
      isMounted = false
    }
  }, [pdfPath, pageNumber, scale])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
}
