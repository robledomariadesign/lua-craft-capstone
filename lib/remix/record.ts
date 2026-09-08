export type ItemType = 'string' | 'measurement' | 'yesno'
export type RecordId = 'ref1' | 'ref2' | 'ref3'

export interface SpecItem {
  key: string
  label: string
  termEs: string
  type: ItemType
  value: string | null
  lines?: { label: string; value: string }[]
  summary: string          // resting-row sub-line — explicit, not derived by truncation
  hint: string
  question: string
}

export interface VersionEntry {
  version: number
  created: string
  status: 'retired' | 'current'
  approvedBy?: string
  approvedOn?: string
  origin: 'created' | 'corrected-from-review' | 'record-amended'
  changedItems?: string[]
  note: string
}

export interface PackagingRecord {
  id: RecordId
  name: string
  reference: string
  orderNumber: '3338'
  specVersion: number
  savedOn: string
  items: SpecItem[]
  history: VersionEntry[]
}

// Shared items across all three records
const PRINT_TEXT: SpecItem = {
  key: 'print-text',
  label: 'Print text',
  termEs: 'Ortografía',
  type: 'string',
  value: null, // Will be set per record
  lines: [
    { label: 'Wordmark', value: 'Lua Craft STUDIO' },
    { label: 'Tagline', value: 'Crafted to be loved in Colombia' },
  ],
  summary: 'Wordmark, tagline',
  hint: 'Exact characters · capitalization counts',
  question: 'Does what the printer sent match character for character?',
}

const IMAGES: SpecItem = {
  key: 'images',
  label: 'Images',
  termEs: 'Imágenes',
  type: 'string',
  value: 'High-resolution artwork, applied to the outer face', // CONFIRM
  summary: 'High-resolution artwork',
  hint: 'Artwork applied to exterior',
  question: 'Do the images match?',
}

const PROCESSES_LINES = [
  { label: 'Corte de material', value: 'Yes' },
  { label: 'Troquelado', value: 'Yes' },
  { label: 'Corrugado', value: 'No' },
  { label: 'Pegado', value: 'No' },
  { label: 'Dorado', value: 'Yes' },
]

const PROCESSES: SpecItem = {
  key: 'processes',
  label: 'Processes',
  termEs: 'Procesos',
  type: 'yesno',
  value: PROCESSES_LINES.map(l => `${l.label}: ${l.value}`).join(' · '), // CONFIRM
  lines: PROCESSES_LINES,
  summary: `${PROCESSES_LINES.length} recorded`,
  hint: 'Cutting, die-cutting, and finishing',
  question: 'Are all processes correct?',
}

const QUANTITY: SpecItem = {
  key: 'quantity',
  label: 'Quantity',
  termEs: 'Cantidad',
  type: 'measurement',
  value: '3000 units',
  summary: '3000 units',
  hint: 'Per reference · supplier minimum 200',
  question: 'Is the quantity correct?',
}

const MATERIAL_COATING: SpecItem = {
  key: 'material-coating',
  label: 'Material & coating',
  termEs: 'Material y recubrimiento',
  type: 'string',
  value: 'Cartón blanco 0.56 · Mate', // CONFIRM
  summary: 'Cartón blanco 0.56 · Mate',
  hint: 'Stock and finish',
  question: 'Is the material and coating correct?',
}

function createRecord(id: RecordId, name: string, reference: string, dimensionsValue: string): PackagingRecord {
  const items: SpecItem[] = [
    {
      ...PRINT_TEXT,
      value: PRINT_TEXT.lines?.map(l => l.value).join(' · ') || null,
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      termEs: 'Medidas',
      type: 'measurement',
      value: dimensionsValue, // CONFIRM
      summary: dimensionsValue,
      hint: 'Finished size, flat',
      question: 'Do the dimensions match?',
    },
    IMAGES,
    PROCESSES,
    QUANTITY,
    MATERIAL_COATING,
  ]

  const history: VersionEntry[] = id === 'ref1'
    ? [
        {
          version: 1,
          created: '2026-01-12',
          status: 'retired',
          origin: 'created',
          note: 'Initial record created',
        },
        {
          version: 2,
          created: '2026-01-20',
          status: 'retired',
          origin: 'created',
          approvedBy: 'Luisa',
          approvedOn: '2026-01-29',
          note: 'Initial approval',
        },
        {
          version: 3,
          created: '2026-02-04',
          status: 'current',
          origin: 'corrected-from-review',
          changedItems: ['print-text', 'dimensions'],
          note: 'Corrected from review',
        },
      ]
    : [
        {
          version: 1,
          created: '2026-01-12',
          status: 'current',
          origin: 'created',
          note: 'Initial record created',
        },
      ]

  const current = history.find(h => h.status === 'current')
  if (!current) throw new Error(`No current version in history for ${id}`)

  return {
    id,
    name,
    reference,
    orderNumber: '3338',
    specVersion: current.version,
    savedOn: current.created,
    items,
    history,
  }
}

export const REF1: PackagingRecord = createRecord('ref1', 'Necklace card', 'REF 1', '11 × 10,8 cm')
export const REF2: PackagingRecord = createRecord('ref2', 'Short earring card', 'REF 2', '5 × 4 cm')
export const REF3: PackagingRecord = createRecord('ref3', 'Long earring card', 'REF 3', '9 × 5 cm')

export const RECORDS = [REF1, REF2, REF3]
