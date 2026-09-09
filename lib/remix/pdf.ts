import type { PackagingRecord, SpecItem } from './record'
import type { Run, Status } from './state'

interface PDFOptions {
  record: PackagingRecord
  run: Run
  items: SpecItem[]
}

// Helper to parse date without timezone shift
function parseDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Build summary content as array of lines
export function buildSummaryLines({ record, run, items }: PDFOptions): string[] {
  const lines: string[] = []

  // Header
  lines.push(record.name)
  lines.push(`Reference: ${record.reference}`)
  lines.push(`Order: ${record.orderNumber}`)
  lines.push(`Version: v${run.specVersion}`)
  lines.push(`Date: ${parseDate(record.savedOn)}`)
  lines.push('')

  // Items section
  items.forEach((item) => {
    const mark = run.marks[item.key]
    const statusStr = mark.status === 'flagged' ? 'Flagged' : 'Match'

    // Item header
    lines.push(`${item.label} / ${item.termEs}`)

    // Item value or lines
    if (item.lines && item.lines.length > 0) {
      item.lines.forEach((line) => {
        lines.push(`  ${line.label}: ${line.value}`)
      })
    } else if (item.value) {
      lines.push(`  ${item.value}`)
    }

    // Status and reason
    if (mark.status === 'flagged') {
      lines.push(`Status / Estado: ${statusStr}`)
      if (mark.reason) {
        lines.push(`Reason: ${mark.reason}`)
      }
    } else if (mark.status === 'match') {
      lines.push(`Status / Estado: ${statusStr}`)
    }

    lines.push('')
  })

  return lines
}

export async function generatePDF({ record, run, items }: PDFOptions): Promise<Blob> {
  const { jsPDF } = await import('jspdf')

  // Create PDF: A4 size, mm units, UTF-8 encoding
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: false, // Disable compression to preserve text encoding
  })

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin
  let yPos = margin

  // Set default font (helvetica with WinAnsi encoding)
  doc.setFont('helvetica', 'normal')

  // Helper to add text with consistent spacing
  const addText = (text: string, size: number = 12, weight: 'normal' | 'bold' = 'normal', indent: number = 0) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', weight)
    const x = margin + indent
    doc.text(text, x, yPos, { maxWidth: contentWidth - indent })
    yPos += size / 2.5 // Approximate line height
  }

  // Get content lines
  const contentLines = buildSummaryLines({ record, run, items })

  // Render lines to PDF
  contentLines.forEach((line) => {
    if (line === '') {
      yPos += 2
    } else if (line.startsWith('  ')) {
      addText(line, 9, 'normal')
    } else if (line.match(/^\s*[A-Z]/)) {
      // Headers and labels
      addText(line, 10, 'bold')
    } else {
      addText(line, 10)
    }

    // Check if we need a new page
    if (yPos > pageHeight - margin) {
      doc.addPage()
      yPos = margin
    }
  })

  // Convert to blob
  return doc.output('blob')
}

export function downloadPDF(blob: Blob, filename: string = 'export.pdf'): void {
  const url = URL.createObjectURL(blob)
  // Open in new window so we can inspect the PDF
  window.open(url, '_blank')
}
