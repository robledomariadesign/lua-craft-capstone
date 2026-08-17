export type ItemKey = 'printText' | 'dimensions' | 'paper' | 'ink' | 'finish'

export interface SpecItem {
  key: ItemKey
  label: string
  title: string
  record: string
  recordHint: string
  proof: string
  proofHint: string
  question: string
  differs: boolean
}

export const RECORD = {
  name: 'Luna Necklace Card',
  specVersion: 3,
  savedOn: 'Feb 4',
  proofLabel: 'Printer render · Feb proof',
  proofReceived: 'received today via WhatsApp',
  quantity: 3000,
  supplierMinimum: 200,
}

export const ITEMS: SpecItem[] = [
  {
    key: 'printText',
    label: 'PRINT TEXT',
    title: 'Print text',
    record: 'Lua Craft Studio · Hecho a mano en Colombia',
    recordHint: '43 characters · capitalization counts',
    proof: 'lua craft studio · Hecho a mano en Colombia',
    proofHint: 'Printer render, cropped to the text',
    question: 'Does the proof match, character for character?',
    differs: true,
  },
  {
    key: 'dimensions',
    label: 'DIMENSIONS',
    title: 'Dimensions',
    record: '9.0 × 5.5 cm',
    recordHint: 'Card face, before rounding',
    proof: '9.0 × 5.0 cm',
    proofHint: "Dimensions read off the printer's proof",
    question: 'Does the size on the proof match the record?',
    differs: true,
  },
  {
    key: 'paper',
    label: 'PAPER',
    title: 'Paper',
    record: '300 gsm matte, cream',
    recordHint: 'Card stock weight and tone',
    proof: '300 gsm matte, cream',
    proofHint: "Material note on the printer's proof",
    question: 'Does the stock on the proof match the record?',
    differs: false,
  },
  {
    key: 'ink',
    label: 'INK',
    title: 'Ink',
    record: 'Terracotta, single colour',
    recordHint: 'Named ink, not screen colour',
    proof: 'Terracotta, single colour',
    proofHint: "Ink named on the printer's sheet",
    question: 'Checking the named ink only — colour accuracy on screen is out of scope.',
    differs: false,
  },
  {
    key: 'finish',
    label: 'FINISH',
    title: 'Finish',
    record: 'Rounded corners, 4 mm radius',
    recordHint: 'All four corners',
    proof: 'Rounded corners, 4 mm radius',
    proofHint: 'Corner detail cropped from the proof',
    question: 'Last item — the summary of all five checks comes next.',
    differs: false,
  },
]

export interface VersionEntry {
  version: number
  created: string
  status: 'retired' | 'current' | 'draft'
  approvedBy?: string
  approvedOn?: string
  note: string
}

export const HISTORY: VersionEntry[] = [
  {
    version: 1,
    created: 'Jan 12',
    status: 'retired',
    note: 'Retired Jan 20 — corrected: print text wording',
  },
  {
    version: 2,
    created: 'Jan 20',
    status: 'retired',
    approvedBy: 'Luisa',
    approvedOn: 'Jan 29',
    note: 'Retired Feb 4 — corrected: paper 250 → 300 gsm matte',
  },
  {
    version: 3,
    created: 'Feb 4',
    status: 'current',
    note: 'Sent Feb 5 · proof received today · awaiting your check',
  },
]

export const FLAG_CHIPS = [
  'Wrong value',
  'Wrong wording or capitalization',
  'Wrong size',
  "Can't tell from the proof",
]

export const itemByKey = (key: ItemKey) => ITEMS.find((i) => i.key === key)!
