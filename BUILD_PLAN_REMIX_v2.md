# BUILD PLAN — Lua Craft · Remix v2

**Handoff for Claude Code.** One Next.js app, same repo, same Vercel project, same URL. The remix ships at `/`.

| | |
|---|---|
| Project | Lua Craft Studio · Manufacturer Handoff and Approval |
| Client | Luisa Diaz · Student: Maria Ayelen Robledo · Instructor: Jumar Balacy |
| Course | UEWD.X490 · build week 1 of 3 |
| Critical job | **Approve the proof** — *she judges what came back and commits a specific design to a specific run. Done when what gets produced is what she last agreed to.* |
| Core screen | Check — the record against the ficha técnica |
| Stack | Next.js (App Router) · TypeScript · Tailwind · Vercel |
| Repo | `lua-craft-capstone` — no new project, no new URL |
| Supersedes | `claude/BUILD_PLAN_A-B_Proof_Approval.md`, which stays in the repo unchanged |
| Parent decision | Linear `ROB-12` |

---

> **Amendments — decided before the build. These override the sections named.**
>
> 1. **File locations.** §13 puts remix files in `lib/` and `components/`, which would
>    overwrite files `/a` and `/b` depend on. Remix files go in `lib/remix/` and
>    `components/remix/` instead. Route files stay as §13 states. No existing file in
>    `lib/` or `components/` is modified.
>
> 2. **Scope for build week 1.** §1 rows 1–7 and 9–12 ship. Rows 8 (record edit) and
>    13 (`not recorded` state) are deferred — neither blocks a P1, P2 or P3 task.
>
> 3. **No `not recorded` state.** Item 6, Material & coating, seeds with
>    `Cartón blanco 0.56 · Mate` rather than `value: null`. The counter reads one number
>    (`0 of 6 confirmed`). Everywhere the plan describes `not recorded` — §3.4, §3.5, §7,
>    §9.2, §9.3, §10.1, §15, §18 — does not apply.
>
> 4. **No record edit.** §11.2 does not apply and `RecordEditSheet.tsx` is not built.
>    The record-edit entry point is omitted from §8.1's record screen. `markedAgainstVersion`
>    is no longer load-bearing but may stay — it costs nothing and keeps the export honest.

---

## 0. Read this first — the guardrail

**The tool is a forcing function, not a detector.**

It has no OCR, no image parsing, no error detection of any kind. It structures a comparison Luisa already performs and records that every item was judged. It does not and cannot know whether her judgments were correct.

Four rules that override any instinct to improve things:

1. **Nothing in the shipped model claims to know what the manufacturer sent.** There is no `proof` string, no `proofHint`, no `differs` boolean. The only thing the app holds from the manufacturer is the ficha PDF itself, rendered as an image. Anything that would let the app say "this item is wrong" is out of bounds — that is the line the A/B build crossed (`ROB-16`).
2. **Copy reflects coverage, never correctness.** "5 of 5 items confirmed", never "Review complete ✓". No checkmark that reads as a verdict on the work.
3. **Every feature traces to a Linear issue with session evidence.** Anything without a citation does not get built. This replaces §0 rule 1 of the old plan, which existed only to protect an A/B comparison that no longer exists.
4. **Where a string is not given in this document, ask Maria.** This plan supplies copy *rules*. New wording is a design decision made by the designer, not in the build (`ROB-17`). Strings marked **[carried]** below are already-tested copy from the A/B build and may be used as written.

**Ground truth is not in this document, and must not enter the code.** Which items on OP 3338 actually differ from the record is moderator-only analysis data. It lives in Maria's notes. If you find yourself wanting a field to mark an item as genuinely-wrong, stop — that is the detector line.

---

## 1. In scope, stack-ranked

Each row ships in this order. Each is tied to a P1 task and to the evidence that puts it on the list.

*This table doubles as §4.2 of the findings report — it is written to be transcribed.*

| # | What ships | Serves | Evidence |
|---|---|---|---|
| 1 | **The ficha pinned at the top of the check screen** — page 2 by default, a strip of all five pages underneath, tap to swap, tap to zoom, persistent while any row is open | P1 | Luisa, on Version A's *empty placeholder*: *"Having the picture on the top is very helpful to compare while I am checking."* · `ROB-16` `ROB-24` |
| 2 | **Item row: resting shows the record's value and a status chip; expanded shows one card, the question, and Flag / Match.** One row open at a time. No value claiming to be what the printer sent | P1 | Version A let a user mark Match while glancing at two values in peripheral vision; Luisa did exactly that on one of two planted errors · `ROB-16` |
| 3 | **Six record-defined items per record, typed** (exact string, measurement, yes/no) — not a five-element constant | P1 | The manufacturer's own document names what must be checked: *medidas, colores, ortografía, imágenes, procesos* · `ROB-27` `ROB-18` |
| 4 | **Saving a flag does not advance. A marked item re-opens, reads and edits without re-entering the reason** | P1 | Luisa: *"I couldn't check what I wrote."* Josefina: *"Can I go back to see what I wrote?… well I guess not."* · `ROB-14` |
| 5 | **Handoff, continuous with the summary: text-based PDF, bilingual, version and date stamped, plus copy-to-clipboard for the print text** | P2 | Task 2 failed identically on both versions for both participants. Josefina rated it 1/1/1/1, the lowest number in the study · `ROB-13` |
| 6 | **Record screen** — the collection, its records, and one deliberate way into the check | P1 | Josefina hesitated ~40 seconds: *"What are all these?"* Class: *"a first screen showing the records with synthetic data will help the user immediately to understand the context"* · `ROB-15` `ROB-21` |
| 7 | **Version history, reachable from the record screen, plainly named** | P3 | Luisa completed Task 3 only *with help*, on both versions. Josefina found it only because she works with that vocabulary professionally · `ROB-15` `ROB-17` |
| 8 | **Record edit, outside the review, creating a new version; history distinguishes `corrected from review:` from `record amended:`** | P2 | Both participants smuggled record corrections into flag reasons because there was nowhere else to put them · `ROB-25` `ROB-21` · proposal req. 6 |
| 9 | **The outcome panel is dismissible**, returning to the list with marks intact | P1 | Josefina tried to hide Version A's approve panel to re-read the list and could not. Class: *"a no-mistakes flow"* · `ROB-19` |
| 10 | **Copy pass** — fewer words, plainer version language, a plainly named history entry point | all | Class: *"too many words, very much AI style."* Luisa hesitated over a minute on *"What is the V3 and V4"* · `ROB-17` |
| 11 | **Colour hierarchy in the version history** — retired-ness and approved-ness stop competing for one visual channel | P3 | Josefina: *"why some of them are gray and others not? … Color hierarchy is confusing."* · `ROB-20` |
| 12 | **Three records from one document** — one ficha covering three card references maps onto three records, each with its own item list, history and export | P1 | The ficha states `CANTIDAD 3000` against three references; the record structure resolves an ambiguity the document could not · `ROB-18` `ROB-24` |
| 13 | **A third item state, `not recorded`** — an item the record never captured cannot be marked Match or Flagged, and says so | P1 | Fields that were never written down are the underlying failure · proposal req. 1 |

### Deferred, with reasons

| Deferred | Reason |
|---|---|
| Consolidating several products into one spec document | Explicitly v2. In this build the shared print text is flagged once per record. That friction is expected and will be observed in sessions, not designed away |
| Jewelry proof review | Out of scope this round. Jewelry records are displayed on the record screen and are not checkable |
| Colour accuracy | The ficha states twice that colours are simulated and must be compared against a physical Pantone book. The supplier itself says screen colour cannot be trusted · `ROB-27` |
| Manufacturer-side screens | Manufacturers are reachable only through Luisa, so they are neither designable nor testable here |
| The curved-box record | A separate later order at a volume discount. It likely has its own ficha, which does not exist in this build |
| Five further ficha items — inks, corrugado and pegado as separate rows, plano mecánico, order number, supplier minimum | Folded into **Processes** or cut, to keep the list at six. See §17 for what was cut and why |
| WhatsApp / send integration | Export and copy only. No API. The tool produces the artifact that accompanies a message Luisa already has to send · `ROB-27` |

---

## 2. The record model — read this twice

**The manufacturer's document is order-shaped. Luisa's records are product-shaped.**

The real ficha técnica (OP 3338) is one document covering three card references at once. Luisa's records are one per physical product. One incoming document therefore maps onto **three separate records**, each with its own item list, its own version history and its own exported PDF.

| Record | Size | Quantity |
|---|---|---|
| Card REF 1 | 11 × 10,8 cm | 3000 |
| Card REF 2 | 5 × 4 cm | 3000 |
| Card REF 3 | 9 × 5 cm | 3000 |
| Curved box | — | 500, later +1000 · *not in this build* |

Total cards: 9,000 across three designs.

**Why this matters.** The ficha states `CANTIDAD 3000` against three references, and Luisa could never tell whether that meant 3000 total or 3000 each. Under the three-record model it reads as 3000 per reference, totalling the 9,000 she ordered. The record structure resolves an ambiguity the document could not.

> **Do not "fix" the quantity, and do not seed it as an error.** It is correct under this model. It is one of two items on the list that look suspicious and are fine — which is what lets the next sessions measure whether participants flag things that are not wrong.

**Consequence for the build:** one shared print-text correction means three separate flags, in three separate records, producing three separate new versions. That is friction. It is expected, it is observed, and it is not designed away in this build.

---

## 3. The seed record

Rewrites §3 of the old plan entirely. The fixture is gone; these are the real values from OP 3338 (`ROB-24`).

### 3.1 Values read off the ficha

| Field | Value on the ficha |
|---|---|
| Orden de producción | 3338 |
| Cantidad | 3000 unidades |
| Tipo de empaque | Tarjetas |
| Medidas REF 1 | 11 × 10,8 cm |
| Medidas REF 2 | 5 × 4 cm |
| Medidas REF 3 | 9 × 5 cm |
| Material | Cartón blanco 0.56 |
| Recubrimiento externo | Mate |
| Aplicación de imagen | Resolución alta, externo |
| Tintas | CMYK (tiro / exterior) |
| Proceso adicional | Dorado (metalizado / reserva UV) |
| Corte de material | Sí |
| Troquelado | Sí |
| Corrugado | No |
| Pegado | No |

**The ficha is the claim. The record is the authority.** Values in the record below are what Luisa's record *should* say, which is not always what the ficha says — that difference is the entire point of the screen. Values still awaiting Luisa's confirmation are listed in §18 and marked in the code with a `// CONFIRM` comment. Do not remove those comments.

### 3.2 The item list — six per record, English labels

Decided 27 Aug. The manufacturer names five categories — *medidas, colores, ortografía, imágenes, procesos*. Colour is out of scope, and quantity and material are added because they are line items on the ficha and because the supplier minimum is what turns an error into a loss.

| # | Item (English label) | Ficha term | Type |
|---|---|---|---|
| 1 | Print text | Ortografía | `string` |
| 2 | Dimensions | Medidas | `measurement` |
| 3 | Images | Imágenes | `string` |
| 4 | Processes | Procesos | `yesno` |
| 5 | Quantity | Cantidad | `measurement` |
| 6 | Material & coating | Material y recubrimiento | `string` — **`not recorded` in the seed** |

Labels render in English. The ficha's Spanish term is available to the UI as a secondary line and is required on the export (§10.4). Every translated term is logged as data (`ROB-18`).

### 3.3 The three types, and what each does

The types exist because the items do not check the same way. They change the rendering of the record card, nothing else. **No type gives the app an opinion about correctness.**

- **`string`** — exact characters. Renders as selectable, copyable text with a character count in the hint. Multi-line values render line by line, each line labelled. Proposal req. 4: never as an image, never as a description.
- **`measurement`** — a number with a unit. Renders the value exactly as the record holds it, including the Spanish decimal comma where the record uses one (`11 × 10,8 cm`), so nothing has to be mentally re-formatted against the document on screen. Use `×` (U+00D7), not the letter x.
- **`yesno`** — a set of named yes/no processes, each on its own line with its recorded answer. One mark covers the set; which line the participant objected to comes out in the flag reason.

### 3.4 `lib/record.ts`

```ts
export type ItemType = 'string' | 'measurement' | 'yesno'
export type RecordId = 'ref1' | 'ref2' | 'ref3'

export interface SpecItem {
  key: string
  label: string            // English, sentence case
  termEs: string           // the ficha's own term — secondary line + export
  type: ItemType
  value: string | null     // null = never recorded. NOT an empty string.
  lines?: { label: string; value: string }[]   // string / yesno multi-line values
  hint: string             // one short line under the value
  question: string         // the line under the card in the expanded row
}

export interface PackagingRecord {
  id: RecordId
  name: string
  reference: string        // 'REF 1'
  orderNumber: '3338'
  specVersion: number
  savedOn: string
  items: SpecItem[]
  history: VersionEntry[]
}
```

Rules the shape enforces:

- `ITEMS` is **per record**, never a module-level constant. No item count is ever hard-coded. The counter derives from two lengths — the items that can be marked and the items whose `value` is `null` — so a record with six items, one of them never recorded, reads `0 of 5 confirmed · 1 not recorded` (§9.3). Adding or removing an item changes every number in the interface with no other edit.
- `value: null` is the `not recorded` state. An empty string is a bug, not a state.
- There is **no** `proof`, `proofHint`, `proofLabel` or `differs` field. If one appears, delete it.

### 3.5 The seeded values

All three records share items 1, 3, 4, 5, 6 and differ only on **Dimensions** — which is exactly why the shared print text landing wrong cost three references at once.

**Item 1 · Print text** · `string` · shared across all three records

```
lines: [
  { label: 'Wordmark',  value: 'Lua Craft STUDIO' },
  { label: 'Tagline',   value: 'Crafted to be loved in Colombia' },
]
hint: 'Exact characters · capitalization counts'
```

Both lines are copyable independently. The wordmark's caps lockup is correct for packaging — do not "fix" it, and do not seed it as an error.

**Item 2 · Dimensions** · `measurement` · differs per record

| Record | value |
|---|---|
| REF 1 | `11 × 10,8 cm` |
| REF 2 | `5 × 4 cm` |
| REF 3 | `9 × 5 cm` |

`hint: 'Finished size, flat'` · `// CONFIRM with Luisa`

**Item 3 · Images** · `string` · `'High-resolution artwork, applied to the outer face'` · `// CONFIRM`

**Item 4 · Processes** · `yesno`

```
lines: [
  { label: 'Corte de material', value: 'Yes' },
  { label: 'Troquelado',        value: 'Yes' },
  { label: 'Corrugado',         value: 'No'  },
  { label: 'Pegado',            value: 'No'  },
  { label: 'Dorado',            value: 'Yes' },
]
```

**Item 5 · Quantity** · `measurement` · `'3000 units'` · `hint: 'Per reference · supplier minimum 200'`

**Item 6 · Material & coating** · `string` · **`value: null`**

The record never captured it. The printer proposed `Cartón blanco 0.56 · Mate` and it was accepted without being written down. This is the seeded instance of the third state, and it is a claim about Luisa's record rather than about the ficha — **`// CONFIRM` before any session** (§18).

### 3.6 Version history

Each record carries its own. `VersionEntry` carries the old plan's shape plus one new field:

```ts
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
```

`origin` is what makes the history answerable six months later. It renders as:

- `v4 — corrected from review: print text, dimensions`
- `v4 — record amended: dimensions`

Without it nobody can tell whether the printer erred or Luisa changed her mind (`ROB-25`).

**Seed:** REF 1 carries the three-entry history (v1 created, v2 approved and later retired, v3 current and unapproved) so P3 has a precise, findable answer — **v2, approved by Luisa, 29 January** — that does not depend on anything the participant did. REF 2 and REF 3 sit at v1 · current · never approved, which also gives the history screen both of its dimensions to distinguish (§11.3). Dates carry over from the A/B fixture so the research tasks keep the same right answer; they are synthetic and listed in §18.

`current` and `approved` are deliberately not the same version. That is Luisa's real situation: a sign-off overtaken by a correction that only ever lived in chat.

---

## 4. The artifact

**Ships with the build:** the real ficha técnica, `FICHA TÉCNICA OP 3338 · TARJETAS`, Cajas y Empaques de Colombia, client Luisa Diaz, designer María José Parra. Five pages: notice cover · mockup + processes · plano mecánico tiro · medidas finales · closing approval page.

This is the first file the printer sent — the one carrying the error. Corrections after it happened as typed WhatsApp messages and photos, which is the version-control failure in its original form.

> **Do not edit the file. Do not clean it up. Do not add errors to it. Do not re-render it.** Its fidelity is the point.

### 4.1 How it renders — decided 27 Aug

**Pinned page + page strip.**

- The PDF ships in `public/` unmodified. Page images are generated from it at build time or committed alongside it; either way the source PDF stays in the repo untouched and is what the export links to conceptually.
- **Pinned:** page 2 (mockup + processes) by default, filling the top of the check screen.
- **Page strip:** five small page thumbnails beneath the pinned page, numbered. Tapping one swaps which page is pinned. The strip is the only navigation; no arrows, no carousel, no library.
- **Zoom:** tapping the pinned page opens it full-screen at ≥2× with a `Close` control. Must not be dead — a dead control mid-task reads as a broken build and contaminates the session.
- The pinned page **persists while a row is expanded.** Opening a row must never scroll the artifact off screen or replace it. If the viewport cannot hold both, the artifact area shrinks; it does not disappear.

**Why the strip, and not page 2 alone:** the final measurements are on page 4. With page 2 pinned and no way to reach page 4, the Dimensions item is a row nobody can honestly judge — a dead end inside the core task, in a week whose brief says *clickable all the way through*. The strip is the cheapest thing that keeps every one of the six items judgeable.

### 4.2 What the artifact is not

It is not a source of data. Nothing is read out of it, parsed from it, or compared against it in code. It is an image on a screen, next to text in an app, and Luisa's eyes do the comparison. The app records that the comparison happened.

---

## 5. Design tokens

Carried from old plan §4, unchanged. Declare once in `app/globals.css` as CSS variables; reference from Tailwind as arbitrary values (`bg-[var(--paper)]`).

```css
:root {
  --paper:        #fcfaf6;  /* app background        */
  --surface:      #ffffff;  /* cards, bars           */
  --tint:         #f4f0e8;  /* artifact card fill    */
  --tint-deep:    #ece9e2;  /* artifact well, disabled */
  --line:         #e5e0d6;  /* hairline border       */
  --ink:          #1c1c1f;  /* primary text          */
  --ink-soft:     #736f66;  /* secondary text        */
  --ink-faint:    #9e9c96;  /* disabled text         */
  --chip-bg:      #eceae6;  /* unchecked chip fill   */
  --chip-text:    #5c5954;
  --blue:         #3478f6;  /* links, record accent  */
  --blue-tint:    #e1ebfe;  /* version chip fill     */
  --green:        #27ae60;  /* Match                 */
  --red:          #e53e32;  /* Flag                  */
  --red-tint:     #ffeae7;  /* Flag button, notices  */
}
```

The version history fix (§11.3) is a change of channel, not of palette: lifecycle moves to border and label weight, approval moves to its own explicit line. Try it with the tokens above first. **If it genuinely needs a new colour value, ask Maria — do not invent a hex.**

`--ink-micro` is retired with the "printer sent" line it existed for.

**Type.** `font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif`. Do not load a webfont. Figma `Regular`→400 · `Medium`→`font-medium` · `Semibold`→`font-semibold` · `Bold`→700.

**Radii.** Cards 16 · rows and chips 12 · buttons 14 · pills 999 · device frame 28.

**Known bug carried over — fix it this time.** `button { font: inherit }` in `globals.css` sits outside `@layer`, so it beats every Tailwind utility inside `@layer utilities`: every `<button>` renders at weight 400 and the version pill at 16px instead of 13px. Wrap the rule in `@layer base { … }`.

---

## 6. Shell and viewport

Carried from old plan §5, unchanged except where the artifact area needs room.

- Viewport ≤ 430px: full-bleed, `background: var(--paper)`. No frame, no radius, no border.
- Viewport > 430px: centre a `393 × 852` box, radius 28, `1px solid var(--line)`, so it demos on a laptop.
- `app/layout.tsx` metadata: `viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, viewportFit: 'cover' }`.
- Bottom action bars: `padding-bottom: max(6px, env(safe-area-inset-bottom))`.
- Every interactive element ≥ 44 × 44px. No hover-only affordances.
- **No fake iOS status bar, no fake home indicator.** Figma's `9:41` is device chrome, not UI.
- All record values are real selectable text, never images (proposal req. 4).

**Responsive check — run at 320 · 375 · 393 · 430 and one desktop width.** Nothing clipped, no horizontal scroll at 320. Scroll the item list to the bottom and confirm the action bar still clears `env(safe-area-inset-bottom)`. Confirm the pinned artifact and the page strip both survive at 320 without the strip wrapping to two rows.

---

## 7. State

`lib/state.ts` — one hook. Rewritten from old plan §6 for three records and the third item state.

```ts
export type Status = 'unchecked' | 'match' | 'flagged' | 'not-recorded'

export interface Mark {
  status: Status
  reason?: string
  markedAt?: string
  markedAgainstVersion: number   // which record version this judgment was made against
}

export interface Run {
  recordId: RecordId
  marks: Record<string, Mark>
  outcome: 'open' | 'approved' | 'corrected'
  outcomePanelDismissed: boolean
  specVersion: number
  events: { t: string; action: string; item?: string }[]
}
```

- **One run per record**, persisted to `localStorage` under `lua.remix.{recordId}.v1`. Three independent keys. A participant who checks REF 1 must not find REF 2 pre-filled.
- **`markedAgainstVersion`** is new and load-bearing. It is how the summary and the export can say, truthfully, which version of the record each judgment was made against — see §9.5.
- **`outcomePanelDismissed`** is what makes the panel dismissible without undoing anything (`ROB-19`). Dismissing sets it true; the marks and the outcome are untouched. Re-opening is always available from the action bar.
- **`not-recorded`** is derived, not chosen: an item whose `value` is `null` gets `status: 'not-recorded'` at seed and cannot be set to `match` or `flagged`. It is not a mark the user makes.
- Hydrate inside `useEffect`, never during render. Guard the persist effect on a `ready` **state** flag, not a ref — a ref flips synchronously and the seed overwrites the saved run on the same commit (this exact bug ate Version B's progress; see `BUILD_CHANGES_2026-08-18` §5).
- `resetRun(recordId | 'all')` clears back to seed, including history.
- `events` appends on every mark, flag, unflag, record edit, dismissal and outcome. Cheap, no SDK, and it gives rough time-on-task for the capture sheets. Nice to have — do not let it delay the build.

---

## 8. Screen 1 — Record

**Route:** `/` — the home route. This screen replaces the old scenario-plus-two-tap-targets home page. The scenario paragraph moves into the moderator's script; this screen now does that job inside the product (`ROB-23`).

Its purpose is not onboarding. **It establishes that the record is the authority.** Both participants entered the review without knowing what the record was, and both then corrected toward their own memory rather than toward the record. If the user overrides the record from memory, the WhatsApp failure has been rebuilt inside the tool (`ROB-21`).

### 8.1 Contains

- **The collection, Fluir**, with its records under it.
- **Jewelry records** — synthetic data, **display only**. Fields per the signed proposal, req. 3: materials · dimensions · colorway and plating · stone type and count · assigned manufacturer · quantity ordered · minimum order quantity. Not checkable, not tappable into a review. Jewelry proof review is out of scope this round.
- **Packaging records** — the three card records. Each shows its name, reference, current version, and its state (waiting on your check / approved / corrected).
- **The version history entry point** (§11.3). This is where P3 is answered from.
- **The record-edit entry point** (§11.2). Outside the review, deliberately.
- **One deliberate action out:** start the check on a chosen record. Entry into the review is an act taken from this screen, not the app's landing state.
- **A small footer note** linking `/a` and `/b`, per the assignment brief. Small. Not a primary choice.

### 8.2 Watch for

**Do not let this become a wall of text.** Density was a documented complaint — the class read the A/B copy as machine-written. A context screen nobody reads is worse than none, because it creates a false sense that context was provided. If a jewelry record needs seven fields, they are seven short lines, not seven sentences.

---

## 9. Screen 2 — Check

**Version A's shell with Version B's item treatment.** This is the core screen. Build it first.

### 9.1 Layout, top to bottom

1. **Nav** — back to the record, the record's name and reference, the version pill.
2. **The pinned ficha page + page strip** (§4.1). Persistent while any row is open, zoomable.
3. **Item list header** — what the record is and its version on the left, the coverage counter on the right.
4. **Item list** — six rows, any order.
5. **Action bar** — three states (§9.4).

### 9.2 The row

**Resting:** item label · the record's value · status chip. **Nothing on the row claims to be what the printer sent.** No second value, no "the printer sent" line, no grey card. That line is removed from the model and from the UI (`ROB-16`).

**Expanded, in place:** one card containing the record's value rendered per its type (§3.3) and its hint, the question line, and two buttons — `Flag · say why` **[carried]** and `Match` **[carried]**. **One row open at a time.**

**Why comparison requires opening the row:** Version A let a user mark Match while glancing at two values in peripheral vision, and Luisa did exactly that on one of the two planted errors. This costs speed — she rated A's ease 4.5, the highest number in the study — and it is spent deliberately.

**Marked:** the chip becomes `✓ Match` or `⚑ Flagged`; a flagged row's border goes `1.5px solid var(--red)` and the reason renders beneath in the participant's own words. **Tapping a marked chip re-opens the row, shows what was written, and allows an edit — without re-entering anything** (`ROB-14`). Closing returns the user where they came from.

**Not recorded:** the row renders its label, the words for *no recorded value* (rule, §12), and a chip that is visibly not a mark. `Match` and `Flag` are absent, not disabled-looking-tappable. The row offers one action: go to the record edit for this item (§11.2). It does not block the run (§9.3).

### 9.3 The counter

Derived from list length, never hard-coded. Two numbers, not one:

```
4 of 5 confirmed · 1 not recorded
```

Not-recorded items are **counted separately and never folded into confirmed.** The run can reach its outcome with a not-recorded item outstanding — decided 27 Aug — but that item travels, visibly, into the summary, the export and the version history. The gap is never silently approved; it is carried.

### 9.4 Action bar

| Condition | Button | Caption |
|---|---|---|
| Any checkable item unmarked | Approve, disabled, `aria-disabled` | how many items still need a mark — rule, §12 |
| All checkable items marked, none flagged | Approve the run, enabled | what is being committed: version, quantity, supplier minimum, lead time starting on approval (proposal req. 14) |
| All checkable items marked, ≥1 flagged | Correct the record — creates the next version | the notice block, rewritten per §12 |

Approve is never available while a checkable item is unmarked. Making a mark changeable is not the same as making it optional (`ROB-14`).

### 9.5 Marks carry their version

Every mark stores `markedAgainstVersion`. This is what lets the summary and the export state which version each judgment was made against — and it is the mechanism that keeps the mid-review edit decision (§11.2) honest.

---

## 10. Screen 3 — Summary and handoff, continuous

Version B's terminal screen, computed from the marks. **The handoff is not a fourth screen.** Both participants hit "what happens next" precisely at the summary, and the answer to that question *is* the share step, so it belongs here (`ROB-13`).

### 10.1 The summary

- Headline computed from the marks — matched / n flagged. Never a completion verdict (§0 rule 2).
- One row per item: name and outcome. A flagged row shows `⚑ Flagged` **plus the participant's reason** — never `⚑ Flagged · {some value the app claims the printer sent}` (`ROB-16`).
- Not-recorded items appear as their own line, named as such.
- **Rows re-open** into the same expanded state as the check screen, read and edit without re-entry, and close back to the summary (`ROB-14`).

### 10.2 The outcome panel

Appears on approve or correct. **It is dismissible** (`ROB-19`): dismissing returns to the reviewed list with marks intact and the outcome intact. Dismissing is not undoing. Re-opening it is always one tap away.

Do not use a "Start over" button as the answer to this — it resets the whole run, it is a blunt instrument standing in for *let me look again*, and both participants avoided it.

### 10.3 The export — decided

- **Text-based PDF, not rasterized.** The manufacturer must be able to select and copy characters out of it. WhatsApp sends PDFs as document attachments without recompressing them; it compresses images.
- **A copy-to-clipboard action for the print text specifically.** Luisa's own fallback was copy-paste into WhatsApp — make it a supported act rather than a workaround.
- **Version number and date stamped on the sheet** (proposal req. 5). This is what makes "print v4, not v3" checkable at the printer's end.
- **PNG/JPG export is explicitly rejected.** An image is the failure mode: the manufacturer retypes from a picture and a character is lost. Proposal req. 4 forbids it.

### 10.4 What the sheet contains

- Record name, reference, order number `3338`, version number, date.
- Every item, in list order, with its recorded value — **bilingual: the English label and the ficha's own Spanish term on the same line** (decided 27 Aug). `Print text / Ortografía`. The printed text itself is never translated, never re-typeset, never altered.
- Flagged items with the participant's reason.
- Not-recorded items, named as not recorded. The gap goes to the printer rather than being hidden from them.
- A line stating which version each judgment was made against, where it differs from the current version (§9.5).

The bilingual sheet doubles as the translation log `ROB-18` asks for: every English label ships next to the Spanish term it stands in for.

### 10.5 What the export is not

It does not send anything. The approval act is already a WhatsApp message — the ficha's own closing page requires *"que envíe un mensaje APROBANDO este documento"*. The PDF supports that message; it does not replace it, and there is no API (`ROB-27` · `ROB-13`).

---

## 11. Shared components

All three are overlays over the same sheet shell: scrim `rgba(28,28,31,.4)`, `bg-[var(--surface)]`, top radius 20, `p-4`, `gap-3`, tap-scrim or `Close` to dismiss, 180ms slide, `prefers-reduced-motion` respected.

### 11.1 Flag reason sheet

Carried from old plan §7.5, with two changes.

- Required reason, ≥3 characters, textarea, chip row that pre-fills and stays editable.
- **Remove the line `What the printer sent: {value}`.** The app does not know what the printer sent (`ROB-16`).
- **Saving does not advance and does not close the screen out from under the user.** It confirms the mark in place. Luisa was startled by the jump and immediately doubted her own correction: *"I couldn't check what I wrote."* Advancing is a separate, user-initiated act (`ROB-14`).
- Re-opening a flagged item loads the existing reason into the field. The user edits it; they never retype it.

### 11.2 Record edit

New. This is the affordance most likely to weaken the forcing function, so it is deliberate, versioned and logged — never a quick inline fix (`ROB-25`).

Two acts, kept visibly separate:

| Act | Meaning | Where |
|---|---|---|
| **Flag an item** | The printer got the record wrong | Inside the review |
| **Edit the record** | The record itself was wrong | Outside the review |

- Reached from the record screen and from a not-recorded row. Not a step in the review.
- **Editing creates a new version.** It never silently mutates the current one (proposal req. 6).
- **A reason is optional** — decided 27 Aug. The field exists, it can be left empty, and the history entry falls back to naming the changed fields.
- The history entry is written with `origin: 'record-amended'` and the changed item keys, so it renders as `v4 — record amended: dimensions`.
- Supplying a value for a not-recorded item is a record edit like any other: it creates a version, and the item becomes checkable in the run from that point on.

**Mid-review edits — decided 27 Aug: marks are kept, and a banner warns.**

- Existing marks survive an edit. The check screen shows a banner naming the items whose recorded value changed since they were judged.
- The banner is per item, not one global bar: an affected row is visibly marked as *judged against an earlier version*, and re-opening it clears that marker.
- `markedAgainstVersion` (§7) is what makes this truthful rather than decorative — the summary and the export both carry it.

> **Flagged in the plan, not resolved by it.** This is the one decision in this build that can let a run be approved where an item was judged against a value that no longer exists. The banner and `markedAgainstVersion` are the guardrails; whether they are enough is a session question, and it belongs on the observation list for the next round alongside `ROB-21`.

### 11.3 Version history

Reached from the **record screen** (`ROB-15`), not only from a nav pill. Luisa completed Task 3 only with help on both versions; a rename of the pill is not enough. It answers *which version, by whom, on what date*, and it stays reachable mid-task without losing marks.

**Colour hierarchy — the actual fix** (`ROB-20`). Two dimensions are currently fighting over one visual channel:

| Dimension | Values | Channel it gets |
|---|---|---|
| Lifecycle | current · retired | **Border and label weight.** Current is bordered and prominent; retired is not |
| Approval | approved · never approved | **A separate, explicit approval line.** Present with its mark when approved; present as words when not |

No entry is greyed for being retired while another retired entry is not. Josefina read that difference as meaningful and could not work out what it meant. Retired-ness and approved-ness never share a colour slot again.

Each entry shows: version, lifecycle state, created date, the approval line, and the origin note (`created` / `corrected from review: …` / `record amended: …`).

**Do not add** a filter, a search box, a timeline graphic, or pagination. Three entries, four after a correction.

**Weighting note for the report:** the specific defect here is one participant on one screen. The broader class claim that colour hierarchy is inconsistent across the whole interface is craft opinion from people who saw the screens for minutes — worth acting on, not a research finding. Do not write it up as though the sessions established it.

---

## 12. Copy rules

**Maria supplies rules, not strings.** Where a string is needed and not fixed below, ask her. Do not invent wording, do not "improve" microcopy, do not translate (`ROB-17`).

**Fixed strings, already tested — use as written:** `Flag · say why` · `Match` · `✓ Match` · `⚑ Flagged` · `Close` · `Zoom`.

**Rules that govern every string in the build:**

1. **Coverage, never correctness.** `5 of 5 items confirmed`, never `Review complete ✓`. Nothing in the interface may imply the app checked anything.
2. **Fewer words.** The class read the A/B copy as machine-written — *"too many words, very much AI style."* Josefina, twice, on what was missing: *"More visual help, less words."* A caption that repeats what the button says gets deleted.
3. **Plain version language.** Luisa hesitated over a minute on *"What is the V3 and V4"* and pressed `Correct the record` only because of the word "Create". Version numbers are never the only thing distinguishing two states — say what the version *is* (current / retired / approved), not just its number.
4. **The history entry point is named in plain words.** Josefina's suggestion — *See previous versions* — is a reasonable starting point, not a mandate. Maria decides the string.
5. **The red notice gets rewritten.** Luisa could not parse *"the correction never lives only in chat."* Its meaning has to survive without the designer in the room. Rule: say what happens to the old version and what the printer must be sent. Maria supplies the wording.
6. **No third renaming of the artifact.** "Proof" became "what the printer sent" (`ROB-10`) and that was still confusing — because the label was describing evidence that was not present. The evidence is now present (§4). Solve the absence, not the wording. Do not rename it again without asking.
7. **English labels, Spanish terms alongside.** Interface English (standing project constraint), the ficha's term available as a secondary line, both on the export. Every translated term is logged as data.
8. **Never claim the app knows.** No string anywhere may say what the printer sent, what is wrong, or what matches.

---

## 13. File layout

```
app/
  layout.tsx              viewport, metadata
  globals.css             §5 tokens · button rule inside @layer base
  page.tsx                Screen 1 — Record (the remix home route)
  check/[recordId]/page.tsx   Screen 2 + Screen 3
  a/page.tsx              frozen — do not touch
  b/page.tsx              frozen — do not touch
components/
  PhoneShell.tsx
  FichaViewer.tsx         pinned page + page strip + zoom overlay
  ItemRow.tsx             resting · expanded · marked · not-recorded
  RecordCard.tsx          renders a value by ItemType
  CoverageCounter.tsx
  Sheet.tsx               shared overlay shell
  FlagSheet.tsx
  RecordEditSheet.tsx
  HistorySheet.tsx
  OutcomePanel.tsx        dismissible
  ExportSheet.tsx         PDF + copy print text
  ActionButton.tsx
lib/
  record.ts               §3 — three records, the only place content lives
  state.ts                §7
  pdf.ts                  text-based generation only
public/
  ficha-op3338.pdf        the real file, unmodified
  ficha-op3338-p1..p5.png page images for the viewer
```

`/a` and `/b` stay live and frozen. They are the research artifact behind `ROB-12`'s decision; deleting them erases the evidence trail.

---

## 14. Do not build

### Waivers — recorded explicitly, so they do not lift silently

| Old §9 constraint | Status | Driver |
|---|---|---|
| No PDF generation | **Lifted** — text-based PDF is now the deliverable | `ROB-13` |
| No WhatsApp / share integration | **Partially lifted** — export and copy only, no API | `ROB-13` |
| No image generation | **Still holds** | — |
| No sixth spec item, no extra record fields | **Waived** | `ROB-18` |
| No new or reworded copy | **Waived**, under the rules in §12 | `ROB-17` |
| No difference between A and B | **Void** — there is one version now | `ROB-12` |

### Still forbidden

- No backend, database, API route, Supabase, auth, or user accounts
- No file upload, camera, or drag-and-drop
- No OCR, image parsing, text extraction from the ficha, or any form of automated comparison — **this is the detector line, not a scope line**
- No analytics SDK, cookie banner, or consent modal
- No dark mode or theme switcher
- No animation library, component library, or icon package — the glyphs needed are `‹ ✓ ⚑ ·`
- No fake iOS status bar, no fake home indicator
- No tests, Storybook, or CI; no README beyond three lines
- No A/B assignment logic, cookies, or feature flags
- No manufacturer-side screens — manufacturers are unreachable and untestable
- No jewelry proof review — jewelry records display only
- No consolidated multi-product spec document — that is v2 (§2)

If something feels missing, it is either in §11 or it is out of scope. **Ask before adding.**

---

## 15. Acceptance checklist

Run this on a real phone before booking a participant.

**Model integrity — check this first**

- [ ] `grep -r "proof\|differs" lib/` returns nothing in the shipped record model
- [ ] No string anywhere in the UI claims to state what the manufacturer sent
- [ ] Every "6" in copy and logic derives from `record.items.length`
- [ ] The ficha PDF in `public/` is byte-identical to the file Maria supplied

**P1 — judge what the manufacturer sent**

- [ ] Every checkable item on each record can be marked in any order; the counter runs `0 of 5 confirmed · 1 not recorded` → `5 of 5 confirmed · 1 not recorded`
- [ ] The pinned ficha stays visible while a row is expanded, at 320px and at 393px
- [ ] The page strip swaps the pinned page; page 4 (medidas finales) is reachable in one tap
- [ ] Zoom opens and closes and is never dead
- [ ] Flagging requires a reason; saving does **not** advance and does **not** close the row
- [ ] A flagged item re-opens showing the reason, edits in place, and closes back where it came from — with no retyping at any point
- [ ] The not-recorded item cannot be marked, is counted separately, and offers the record-edit path
- [ ] Marks survive a refresh; the three records' runs are independent

**P2 — make sure they print the corrected version**

- [ ] With ≥1 flag, approve is not offered — only the correction
- [ ] Correcting retires the current version and creates the next; the retired one is visibly unusable
- [ ] The history entry reads `corrected from review: …`, and a record edit reads `record amended: …`
- [ ] The exported PDF carries the version number and date, is text-based, and its characters can be selected and copied out of it
- [ ] The export is bilingual — English label and Spanish term on every line
- [ ] Copy-to-clipboard puts the exact print text on the clipboard, character for character
- [ ] A not-recorded item appears on the export, named as not recorded
- [ ] The outcome panel dismisses back to the list with marks and outcome intact, and re-opens

**P3 — find what was approved, and when**

- [ ] The version history is reachable from the record screen
- [ ] It answers *which version, by whom, on what date* in one glance: **v2 · approved by Luisa · 29 January**
- [ ] REF 1 v3 reads current-and-unapproved; REF 2 and REF 3 read v1 · never approved
- [ ] No entry is greyed for being retired while another retired entry is not
- [ ] Reachable mid-task without losing marks

**Device**

- [ ] Opens on a phone that is not yours, on cellular data, from a cold link
- [ ] Nothing clipped at 320px; no horizontal scroll anywhere
- [ ] Action bar clears the home bar
- [ ] No console errors, no hydration warning
- [ ] `/a` and `/b` still load, unchanged, from the footer note

---

## 16. Build order and deployment

**Same repo (`lua-craft-capstone`), same Vercel project, same URL. No new deployment.**

- The remix ships at `/`. Opening the URL lands on the remix.
- `/a` and `/b` stay live and frozen, reachable from a small footer note only.
- Push as you go — every push deploys. **A link that does not load scores zero for that portion.**
- Open it from a device that is not yours before the deadline.

**Order — core screen first, then outward along the flow map:**

1. `lib/record.ts` and `app/globals.css` — the seed and the tokens
2. `PhoneShell`, `Sheet`, `ActionButton`, `RecordCard`
3. **Screen 2, the check** — `FichaViewer`, `ItemRow`, `CoverageCounter`, `FlagSheet`. This is the critical job. It works before anything else is built.
4. **Screen 3, summary and handoff** — `OutcomePanel` (dismissible), `ExportSheet`, `lib/pdf.ts`
5. **Screen 1, the record** — the entry point, the lists, the jewelry records
6. `HistorySheet` and `RecordEditSheet`
7. The footer note to `/a` and `/b`
8. Walk §15 and report which boxes fail

**Rough visuals are fine. Dead ends are not.** The brief's words: *"when I say real I don't mean production ready, I mean clickable all the way through."*

---

## 17. Decisions made 27 Aug, and what was cut

Answers to the open decisions in the brief. Recorded here so the next reader knows they were decided rather than defaulted.

| # | Decision | Chosen |
|---|---|---|
| 1 | Item list per record | **Six**, English labels: print text · dimensions · images · processes · quantity · material & coating |
| 2 | Item types | **Three** — exact string, measurement, yes/no |
| 3 | Artifact rendering | **Pinned page + page strip**, five pages, zoomable |
| 4 | Record editing mid-review | **Marks are kept; a banner warns** which items were judged against an earlier version |
| 4b | Does an edit require a reason | **Optional note** |
| 5 | Fields with no recorded value | **A third state, `not recorded`, which does not block the run** — it travels into the summary, the export and the history instead |
| 6 | Language | Interface and labels **English**; the ficha's Spanish term alongside; **the export is bilingual** |
| 7 | Figma | See §18 — the referenced node does not exist |

### What was cut from the item list, and why

ROB-18's full candidate list runs to eleven. Six ship. The cut, recorded per `ROB-18`'s instruction not to silently ship a shorter list:

| Cut | Why |
|---|---|
| Medidas REF 1 / REF 2 / REF 3 as three separate items | Each reference is its own record now (§2), so each record carries one Dimensions item. The information is not lost; it is distributed correctly |
| Tintas (CMYK) | Colour is out of scope in the supplier's own words — the ficha states twice that colours are simulated and must be checked against a physical Pantone book (`ROB-27`) |
| Corrugado · Pegado · Troquelado · Corte · Dorado as separate rows | Folded into one **Processes** item with five named yes/no lines. Five one-word rows would have made the list eleven long and the counter meaningless. Which line a participant objects to comes out in the flag reason |
| Material and Recubrimiento as two items | Combined into one. They are one decision in practice — the stock and its finish are specified together |
| Orden de producción · supplier minimum | Not judgeable items. They are record metadata and appear as context, on the export, and in the approval commitment |
| Colores | Out of scope, per the proposal and per `ROB-27` |

**If any of these need to come back, they are additions to one array.** The list is record-defined for exactly this reason.

---

## 18. Still open — do not resolve these in the build

### Needs Luisa's confirmation before the next session

The ficha is the claim; the record is the authority. Right now only the claim exists in writing. These values are seeded so the build is clickable, and every one is marked `// CONFIRM` in `lib/record.ts`:

| Value | Seeded as | Status |
|---|---|---|
| Print text — tagline | `Crafted to be loved in Colombia` | Confirmed in the brief |
| Print text — wordmark | `Lua Craft STUDIO` | Confirmed in the brief · correct lockup for packaging |
| Dimensions, all three references | The ficha's own measurements | **Assumed correct — confirm.** If her record says something different, that is a second real error and it changes the study |
| Images | `High-resolution artwork, applied to the outer face` | **Provisional wording — confirm** |
| Processes | The ficha's five yes/no answers | **Assumed correct — confirm** |
| Quantity | `3000 units` per reference | Correct under the three-record model (§2) |
| Material & coating | **`not recorded`** | **This is a claim about her record, not about the ficha.** It asserts that the printer proposed `Cartón blanco 0.56 · Mate` and it was accepted without being written down. Plausible for a first order and it is the seeded instance of the third state — but confirm it, and if it is wrong, move the state to whichever field her record genuinely lacks. It is one line in the seed |
| Version history dates | Carried from the A/B fixture — v1 12 Jan, v2 20 Jan approved 29 Jan, v3 4 Feb | Synthetic. Kept so the research tasks keep the same right answer for P3 |

### Figma

**The node referenced for the record-screen pass does not exist.** File `TmCnlS4N8TB1WYR10Mtysc` has one page containing: the placemat, the job-details frame, the five-approaches frame, the approach sections, and the curation frame. There is no `BUILD` section and no `40:126` — the old build plan's Figma node IDs (`40:*`, `89:*`, `90:*`) are no longer resolvable in this file.

Two consequences:

1. **Do not cite Figma node IDs in this build.** This document is the design source for the remix. Where it does not specify something, ask Maria.
2. A light Figma pass on the record screen means **creating new frames**, not pulling an existing node. That is Maria's call on whether it is worth the week-one hours; the build does not depend on it.

### Known gaps in the flow map

The FigJam flow map (`3mSmw4Kpc2Qq5yzAyaW1l2`, node `11:119`) describes Luisa's world correctly but has three gaps this build fills. They are recorded here because the map, not the build, is where they originated:

1. **No send step.** The connector runs `NEW VERSION CREATED with comments` → `PROOF RECEIVED` directly. The correction teleports to the manufacturer. The export (§10.3) is what fills this.
2. **No record-creation step.** `Create design` → `Send design`; nothing produces the record, and then `Does it match records?` assumes records the flow never created. This is why the quantity was never captured. The record screen (§8) and the record edit (§11.2) fill it.
3. **`APPROVED` is terminal**, but the ficha requires a message saying APROBANDO. Approval also has to be transmitted (§10.5).

Confirm the map reflects the three-screen remix before it goes into the findings report.

### Carried forward as observation targets, not features

- **Do participants correct toward the record or toward their own memory?** (`ROB-21`) Log it every session. The record screen is the design response; whether it works is measured, not assumed.
- **Does the mid-review edit banner hold?** (§11.2) Watch whether anyone approves a run containing an item judged against a superseded value.
- **Does the per-record friction bite?** One shared print-text correction means three flags in three records. Expected. Observed. Not designed away.

---

## 19. Sources of truth

- **Linear** — workspace `Robledo-Maria-design`, project `Lua Craft Capstone Project`. `ROB-12` is the parent decision; `ROB-13` through `ROB-27` are the scoped items, each carrying its evidence.
- **Signed proposal** — `FINAL_Manufacturer_Handoff_and_Approval_V1.5.md`, client-signed 8/10/26. Requirements 4, 5, 6, 9, 11 and 14 are directly relevant. Where the build and the proposal disagree, the proposal is usually right — the removed "what the printer sent" text card was a build drift away from requirement 9, not a proposal change.
- **The artifact** — `FICHA TÉCNICA OP 3338 · TARJETAS`, Cajas y Empaques de Colombia. Unmodified.
- **Old build plan** — `claude/BUILD_PLAN_A-B_Proof_Approval.md` (§4, §5, §6, §9 carry over) and `claude/BUILD_CHANGES_2026-08-18.md` for what changed after it.
- **Capture sheets** — INTERVIEW 1 (Luisa, 8/18/26, iPad, started on A) and INTERVIEW 2 (Josefina Ewe, 8/19, computer, started on B).
- **Flow map** — FigJam `3mSmw4Kpc2Qq5yzAyaW1l2`, node `11:119`.
- **Ground truth for the study** — Maria's notes. Deliberately not in this document and not in the code.

---

## 20. Paste this into Claude Code

> Read `BUILD_PLAN_REMIX_v2.md` in full before writing anything. Build exactly what §8–§11 specify and nothing from §14. Order per §16: `lib/record.ts` and `app/globals.css`, then the shell, then **Screen 2 — the check screen — working end to end before anything else exists.** Copy: use only the strings marked [carried] in §12; everywhere else follow the rules in §12 and ask me for the wording rather than inventing it. There is no `proof` field, no `differs` boolean, and nothing in the UI may claim to know what the manufacturer sent — if you find yourself needing one, stop and ask. `/a` and `/b` are frozen; do not touch them. When a screen is done, run it at 320 and 393 and show me a screenshot before moving on. Then walk §15 yourself and tell me which boxes fail. If anything in the plan is ambiguous, ask instead of deciding.

---

*Written 27 August 2026 against `ROB-23`. Supersedes `claude/BUILD_PLAN_A-B_Proof_Approval.md`, which stays in the repo as the artifact the A/B research ran against.*
