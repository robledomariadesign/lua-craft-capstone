# BUILD PLAN — Lua Craft · Proof Approval A/B

**Handoff for Claude Code.** One Next.js app, three routes: `/` (home), `/a` (Version A), `/b` (Version B).

| | |
|---|---|
| Project | Lua Craft Studio · Manufacturer Handoff and Approval |
| Client | Luisa Diaz · Student: Maria Ayelen Robledo |
| Critical job | **Approve the proof** — *she judges what came back and commits a specific design to a specific run. Done when what gets produced is what she last agreed to.* |
| Core screen | Proof-vs-record approval |
| Design source | Figma `TmCnlS4N8TB1WYR10Mtysc`, section **BUILD** (`40:126`) |
| Stack | Next.js (App Router) · TypeScript · Tailwind · deployed on Vercel |
| Purpose | Moderated think-aloud sessions with 3–5 participants, on a phone |

---

## 0. Read this first (the guardrail)

This build exists to answer one research question: **when a proof comes back, does Luisa check it faster and more completely when everything is on one screen (A), or when she is walked through one item at a time (B)?**

Everything below serves that. Three rules that override any instinct to improve things:

1. **A and B must differ only in interaction.** Same record, same proof values, same wording, same colors, same terminal outcomes. If A gets a nicer empty state than B, the test measures the empty state.
2. **The copy in this document is the design.** It came out of Figma. Do not rewrite, shorten, "clarify," or fix the Spanish. `Hecho a mano en Colombia` is correct.
3. **Nothing is real.** No backend, no upload, no send. Every action writes to local state only. See §9.

---

## 1. The two approaches

### Version A — Side-by-Side Compare
*One screen. The proof sits above the full record. All five spec items visible at once, checkable in any order. Approve is present but locked until every item has a mark.*

**Assumption:** Luisa already knows what to look for, so the bottleneck is not knowing *what* to check — it's holding the proof and the record in her head at the same time. Put both in one field of view and she'll catch the mismatch on her own, faster than any wizard could walk her there.

**Five dimensions:** what leads = the record as a whole · pattern = list + inline compare · first action = scan · how much at once = everything · order of work = hers.

### Version B — Guided One-at-a-Time
*Six screens. One spec item per screen, record above proof, Flag or Match, then a summary of all five.*

**Assumption:** the misprint happened because a detail got skimmed, not because Luisa lacked the information. Force a deliberate yes/no on each item and the skim becomes impossible — she trades speed for a check she can't accidentally skip.

**Five dimensions:** what leads = one item · pattern = wizard · first action = judge · how much at once = one thing · order of work = fixed, 1→5→summary.

**What the pair teaches:** whether completeness comes from visibility or from enforcement.

---

## 2. P1 tasks the build must make testable

These are the three P1s from the critical job card. **Every one of them has to be completable on both `/a` and `/b`** — that is the bar for "done," and it is why §7.5–§7.7 exist even though Figma doesn't draw them.

| # | P1 task (from the placemat) | Testable when… |
|---|---|---|
| **P1** | *You received product specifications from the manufacturer.* | All five items can be judged against the proof and marked Match or Flagged, on both versions; a flag captures why; the participant can see how many are done and what's left |
| **P2** | *Make sure they print the corrected version when they say they are ready to print.* | Correcting a flagged item retires v3 and creates v4; v4 reads as current everywhere; v3 is visibly **RETIRED** and cannot be sent or approved; the participant can say out loud which version the printer must use |
| **P3** | *Find what you approved for the packaging, and when.* | An approval history is reachable from the core screen on both versions and answers *which version, by whom, on what date* without leaving the record |

Draft research tasks — goal, not directions, no interface words:

1. *"The printer sent back the proof for the Luna Necklace card this morning. Go through it and tell me whether what they made is what you asked for."* → **P1**
2. *"The printer just messaged that they're starting the run tomorrow. Make sure what they print is the corrected card and not the old one."* → **P2**
3. *"Your bookkeeper is asking about the packaging. Find out which version you signed off on, and when."* → **P3**

Task 3 has a findable, specific right answer in the seed data (**v2, approved Jan 29**) and doesn't depend on what the participant did in tasks 1 and 2 — so it behaves the same whether they start on A or on B.

---

## 3. The seed record — one source of truth

Both versions import this. **Do not duplicate it per version.**

`lib/record.ts`

```ts
export type ItemKey = 'printText' | 'dimensions' | 'paper' | 'ink' | 'finish'

export interface SpecItem {
  key: ItemKey
  label: string          // Version A row label, uppercase
  title: string          // Version B step title, sentence case
  record: string         // what her record says
  recordHint: string     // Version B: caption under the record value
  proof: string          // what the printer's proof shows
  proofHint: string      // Version B: caption under the proof value
  question: string       // Version B: the line under both cards
  differs: boolean       // ground truth, for your analysis only — never shown in the UI
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
    differs: true,   // capitalization: "Lua Craft Studio" vs "lua craft studio"
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
```

**Version history** — same file, same import. This is what P3 is answered from, and what P2's correction appends to.

```ts
export interface VersionEntry {
  version: number
  created: string
  status: 'retired' | 'current' | 'draft'
  approvedBy?: string
  approvedOn?: string
  note: string          // why it was retired, or where it stands
}

export const HISTORY: VersionEntry[] = [
  { version: 1, created: 'Jan 12', status: 'retired',
    note: 'Retired Jan 20 — corrected: print text wording' },
  { version: 2, created: 'Jan 20', status: 'retired',
    approvedBy: 'Luisa', approvedOn: 'Jan 29',
    note: 'Retired Feb 4 — corrected: paper 250 → 300 gsm matte' },
  { version: 3, created: 'Feb 4', status: 'current',
    note: 'Sent Feb 5 · proof received today · awaiting your check' },
]
```

Note that **v2 is the only approved version and it was later retired.** That's not a bug in the fixture — it is exactly Luisa's real situation, where a sign-off got overtaken by a correction that only ever lived in chat. It also gives P3 a precise answer and makes P2 meaningful: "current" and "approved" are not the same version.

Use the real characters: `·` (U+00B7), `×` (U+00D7), `‹` (U+2039), `✓`, `⚑`, and curly apostrophes where Figma has them. `9.0 × 5.5 cm` uses a multiplication sign, not the letter x.

> **Two planted discrepancies, not one.** `printText` differs by capitalization and `dimensions` differs by 0.5 cm. The Figma summary mock shows only Dimensions flagged — that was a static mock. **In the build, the summary must reflect what the participant actually marked, whatever that is.** Whether they catch the lowercase `lua craft studio` is one of the most interesting things this study can measure; do not hard-code it either way.

---

## 4. Design tokens

Declare once in `app/globals.css` as CSS variables; reference from Tailwind as arbitrary values (`bg-[var(--paper)]`). This works on Tailwind v3 and v4 and keeps A and B provably identical.

```css
:root {
  --paper:        #fcfaf6;  /* app background        */
  --surface:      #ffffff;  /* cards, bars           */
  --tint:         #f4f0e8;  /* proof card fill       */
  --tint-deep:    #ece9e2;  /* photo well, disabled  */
  --line:         #e5e0d6;  /* hairline border       */
  --ink:          #1c1c1f;  /* primary text          */
  --ink-soft:     #736f66;  /* secondary text        */
  --ink-faint:    #9e9c96;  /* disabled text         */
  --ink-micro:    #6b6661;  /* Version A proof line  */
  --chip-bg:      #eceae6;  /* unchecked chip fill   */
  --chip-text:    #5c5954;
  --blue:         #3478f6;  /* links, record accent  */
  --blue-tint:    #e1ebfe;  /* version chip fill     */
  --green:        #27ae60;  /* Match                 */
  --red:          #e53e32;  /* Flag                  */
  --red-tint:     #ffeae7;  /* Flag button, notices  */
}
```

**Type.** `font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif`. On the iPhones you'll test on this resolves to SF Pro, which is what Figma used. Do not load a webfont.

Weights map: Figma `Regular`→400, `Medium`→510→use `font-medium`, `Semibold`→590→use `font-semibold`, `Bold`→700.

**Radii.** Cards 16 · rows/chips-with-corners 12 · buttons 14 · pills 999 · device frame 28.

---

## 5. Shell, viewport, and the thing not to build

The Figma frames are 393 × 852 and include an iOS status bar (`9:41`) and a home indicator. **Those are Figma device chrome, not UI.** Do not render them — a real iPhone draws its own, and a fake `9:41` bar under the real clock will read as a bug to every participant.

`components/PhoneShell.tsx`:

- Viewport ≤ 430px: render full-bleed. `background: var(--paper)`. No frame, no radius, no border.
- Viewport > 430px: center a `393px × 852px` box with `border-radius: 28px` and `1px solid var(--line)`, so you can demo on a laptop.
- `app/layout.tsx` metadata: `viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, viewportFit: 'cover' }`.
- Bottom action bars get `padding-bottom: max(6px, env(safe-area-inset-bottom))`.
- Every interactive element ≥ 44 × 44px hit area. No hover-only affordances — there is no hover on a phone.
- All spec and proof values are real selectable text, never images. (Project requirement #4.)

**Responsive check — run it at five widths, on both `/a` and `/b`:** **320**, **375**, **393**, **430**, and one desktop width above 430.

- ≤430px stays full-bleed; >430px shows the centred 393 × 852 frame. Neither behaviour changes.
- **Nothing clipped and no horizontal scroll at 320px.** 320 is the floor because it's the narrowest phone a participant might hand back to you; if the row wraps correctly there, it wraps everywhere.
- Scroll the spec list to the bottom on `/a` and confirm the action bar still clears `env(safe-area-inset-bottom)` — the bar must not ride up over the home bar once the list is long enough to scroll.
- On `/b`, check the same at step 1, which has the tallest record and proof cards.

---

## 6. State

`lib/state.ts` — one hook, two independent stores.

```ts
export type Status = 'unchecked' | 'match' | 'flagged'
export interface Mark { status: Status; reason?: string; markedAt?: string }
export interface Run {
  marks: Record<ItemKey, Mark>
  outcome: 'open' | 'approved' | 'corrected'   // corrected = V4 created
  specVersion: 3 | 4
  events: { t: string; action: string; item?: ItemKey }[]
}
```

- Persist to `localStorage` under **`lua.proof.a.v1`** and **`lua.proof.b.v1`**. Separate keys, no shared store.
  *Why it matters:* every participant runs both versions. If they shared a key, the second version would open pre-filled and the comparison would be worthless.
- Hydrate safely: read `localStorage` inside `useEffect`, not during render, or Next will throw a hydration mismatch.
- `resetRun('a' | 'b' | 'both')` clears back to seed.
- `events` appends `{t: ISO timestamp, action, item}` on every mark, flag, unflag, step change, and outcome. Cheap, no SDK, and it gives you rough time-on-task for the capture sheets. Nice to have — do not let it delay the build.

---

## 7. Screens

Figma node IDs are given so you can re-pull anything. Copy is verbatim.

### 7.1 `/` — Home

Not in Figma; keep it plain so it doesn't prime anyone. Not phone-framed, plain document layout, max-width 34rem, `var(--paper)`.

- H1: **Lua Craft · Proof approval**
- Scenario paragraph, shown to nobody but you and the participant before you hand over the phone:
  > The Luna Necklace card, spec v3, saved Feb 4. The printer sent back the February proof today over WhatsApp. Both versions start from this same record and the same proof.
- Two large tap targets, ≥ 56px tall, side by side on wide screens and stacked on a phone:
  - **Version A · Side-by-side** → `/a` — caption *"The whole record and the proof on one screen. Check in any order."*
  - **Version B · One at a time** → `/b` — caption *"Five items, one screen each, then a summary."*
- Secondary button: **Reset both to seed** → clears both keys, confirms inline with "Reset." for 2s. Do not use `window.confirm` — it stalls on some mobile browsers.
- Small footer line: *"Prototype for research. Nothing here is sent anywhere."*

### 7.2 `/a` — Version A · Side-by-Side Compare  `40:128`

Vertical stack on `var(--paper)`; nav / content / action bar all `var(--surface)`.

**Nav** `40:130` — `px-4 py-2`, three items, space-between:

- `‹ Records` — 17px, `var(--blue)`, links to `/`
- `Luna Necklace Card` — 17px semibold, `var(--ink)`
- Pill `v3` — `bg-[var(--blue-tint)]`, `text-[var(--blue)]`, 13px semibold, `px-2.5 py-1`, radius 999. **This is a button** — it opens the approval history (§7.7). Reads `v4` after a correction. Give it a ≥44px hit area with invisible padding; don't grow the pill.

**Content** `40:135` — `px-4 py-2`, `gap-3`, scrolls.

**Proof card** `40:136` — `bg-[var(--tint)]`, `1px solid var(--line)`, radius 16, clipped:

- *Photo well* `40:137` — `bg-[var(--tint-deep)]`, `py-11`, centered column, `gap-1`:
  - `PRINTER'S PROOF` — 12px semibold, `var(--ink-faint)`, `letter-spacing: 1px`
  - `received today via WhatsApp` — 13px, `var(--ink-soft)`
  - **Swappable image:** render `/public/proof.png` via `next/image` **if the file exists**, otherwise this placeholder. Ship with no file — the placeholder is the default. Dropping a real proof photo at `public/proof.png` must require no code change.
- *Proof bar* `40:140` — `bg-[var(--surface)]`, `px-3 py-2`, space-between, 12px:
  - `Printer render · Feb proof` — medium, `var(--ink-soft)`
  - `Zoom Image` — semibold, `var(--blue)`, **button.** Opens a full-screen overlay of the proof well at 2× with a `Close` control. If there's no image yet, the overlay shows the placeholder enlarged. It must not be dead — a dead link mid-task reads as a broken build and contaminates the session.

**Spec header** `40:143` — space-between, 12px semibold:

- `YOUR RECORD · spec v3 · saved Feb 4` — `var(--ink-soft)`, `letter-spacing: .6px`
- `0 of 5 checked` — `var(--ink)`. Live count.

**Spec list** `40:146` — `gap-2`, one row per item in the order above.

*Row, resting state* (`40:147`) — `bg-[var(--surface)]`, `1px solid var(--line)`, radius 12, `pl-3.5 pr-2.5 py-2.5`, **`items-start`**, space-between:

- Field column, `gap-1`, `flex-1`, `min-w-0`:
  - label — 10px semibold, `var(--ink-soft)`, `letter-spacing: .8px` (`PRINT TEXT`)
  - record value — 14px medium, `var(--ink)`
  - `PROOF SHOWS` — 10px semibold, `var(--ink-micro)`, `letter-spacing: .8px`. Micro-label on its own line.
  - `{proof}` — **14px medium, `var(--ink)` — the same size, weight and colour as the record value directly above it.**
- Status chip — `bg-[var(--chip-bg)]`, `text-[var(--chip-text)]`, 12px semibold, `px-2.5 py-1.5`, radius 999, label `Check`, `flex-shrink-0`, top-aligned with the field column

> **Within-version parity, and why it overrides Figma.** Figma drew the proof value at 10px against a 14px record value. One of the two planted mismatches is a capitalization difference — if A loses on catch rate with the evidence rendered at two-thirds the size of the thing it's compared against, the result is unreadable: layout or legibility? §0 rule 1 wins. Record and proof are typographically identical **within** A (14px), and identical within B (19px). A and B still look nothing like each other, which is the point.

**Wrapping, never truncation.** At 14px, `lua craft studio · Hecho a mano en Colombia` will not fit one line at 393px, and those exact characters are the thing under test.

- Record value and proof value both wrap to as many lines as they need.
- **No** `truncate`, `line-clamp`, `text-ellipsis`, `overflow-hidden`, or `whitespace-nowrap` on either value. No horizontal scroll anywhere in the row.
- Use `overflow-wrap: anywhere` on both values so a long unbroken token can't force a scrollbar at 320px.
- The field column needs `min-w-0` or flexbox will refuse to let it wrap.
- The chip stays on one line and keeps its ≥44px hit area as the row grows.
- Nothing in the row is fixed-height; row height grows with content.

> **Gap in Figma — specify it here.** Figma only shows the resting state; it never says what tapping `Check` does. Build it as an **inline expand**, because A's whole premise is "everything visible, any order," and pushing the decision into a modal would quietly turn A into B.

*Row, expanded* — tapping the chip (or anywhere on the row) reveals a row of two buttons inside the same card, `gap-2.5`, `mt-2.5`, each `flex-1`, `py-2.5`, radius 12:

- `Flag · say why` — `bg-[var(--red-tint)]`, `text-[var(--red)]`, 15px semibold
- `Match` — `bg-[var(--green)]`, white, 15px semibold

Same labels and same colors as B. Only one row expanded at a time.

*Row, marked* — chip becomes `✓ Match` (`text-[var(--green)]`, `bg-transparent`) or `⚑ Flagged` (`text-[var(--red)]`); a flagged row's border goes `1.5px solid var(--red)` and the reason appears under the proof line as 11px `var(--red)`. Tapping a marked chip re-opens the row so a participant can change their mind — that's realistic and it's data.

**Action bar** `40:177` — `px-4 pt-2.5 pb-1.5`, `gap-1.5`, three states:

| Condition | Button | Caption (12px, centered, `var(--ink-soft)`) |
|---|---|---|
| Any item unchecked | `Approve V3 for production` · `bg-[var(--tint-deep)]`, `text-[var(--ink-faint)]`, `disabled`, `aria-disabled` | `{n} items still to check · approve unlocks once every item has your mark` — singular `item` when n is 1 |
| All 5 checked, none flagged | `Approve V3 for production` · `bg-[var(--green)]`, white, enabled | `Approving binds this run to spec v3 · 3,000 units · supplier minimum 200 · lead time starts on approval` |
| All 5 checked, ≥1 flagged | `Correct the record — creates V4` · `bg-[var(--blue)]`, white | plus the red notice block from §7.4 rendered above the button |

Button 17px semibold, `py-3.75`, radius 14, full width.

### 7.3 `/b` — Version B · Guided, steps 1–5  `40:183 · 40:213 · 89:58 · 89:102 · 90:86`

Single route. Step lives in component state, `1…5` then `summary`. Do not create `/b/1`, `/b/2` — one entry point keeps the URL you give participants stable.

The five step screens are **one component** rendered from `ITEMS[i]`. Do not write five files.

**Nav** `40:185` — `px-4 py-2`, space-between:

- `‹ Exit` — 17px, `var(--blue)` → `/`
- `Luna Necklace Card` — 16px semibold, `var(--ink)`, followed by the **same `v3` pill as Version A** (`bg-[var(--blue-tint)]`, `text-[var(--blue)]`, 13px semibold, `px-2.5 py-1`, radius 999), `gap-1.5`. Also a button → approval history (§7.7).
- `1/5` — 15px semibold, `var(--ink-soft)`

> **Deviation from Figma, on purpose.** Figma writes the title as plain text `Luna Necklace Card · v3`. Splitting the `v3` into the identical pill Version A already has is the only way P3 has a comparable entry point on both versions. Without it, history is reachable in A and invisible in B, and task 3 measures the doorway instead of the approach. It costs one styling change and no copy change.

**Progress** `40:189` — `px-4 py-1`, `gap-1.5`, five equal bars, `h-1`, radius 2. Filled `var(--blue)` up to and including the current step; the rest `var(--line)`.

**Content** `40:195` — `px-4 pt-4 pb-2`, `gap-3.5`:

- `ITEM 1 OF 5` — 12px semibold, `var(--ink-soft)`, `letter-spacing: 1px`
- Title — 26px bold, `var(--ink)` (`Print text`)
- **Record card** `40:198` — `bg-[var(--surface)]`, **`1.5px solid var(--blue)`**, radius 16, `p-4`, `gap-1.5`:
  - `YOUR RECORD SAYS · spec v3` — 10px semibold, `var(--blue)`, `letter-spacing: .8px`
  - value — 19px medium, `var(--ink)`, `line-height: 27px`
  - `recordHint` — 12px, `var(--ink-soft)`
- **Proof card** `40:202` — `bg-[var(--tint)]`, `1px solid var(--line)`, radius 16, `p-4`, `gap-1.5`:
  - `THE PRINTER'S PROOF SHOWS` — 10px semibold, `var(--ink-soft)`, `letter-spacing: .8px`
  - value — 19px medium, `var(--ink)`, `line-height: 27px`
  - `proofHint` — 12px, `var(--ink-soft)`
- `question` — 15px, `var(--ink-soft)`, `line-height: 21px`

Record above proof, always. That ordering is the approach — it says the record is the authority and the proof is the claim.

**Actions** `40:207` — `px-4 pt-2.5 pb-1.5`, `gap-2.5`, two `flex-1` buttons, `py-3.75`, radius 14, 17px semibold:

- `Flag · say why` — `bg-[var(--red-tint)]`, `text-[var(--red)]`
- `Match` — `bg-[var(--green)]`, white

`Match` records the mark and advances. `Flag · say why` opens the reason sheet (§7.5); saving it records the mark and advances. Step 5's action advances to the summary.

**Back:** `‹ Exit` leaves to `/`. There is no per-step back button in Figma — leave it out; a participant hunting for one is a finding. The summary can go back (below).

### 7.4 `/b` — Summary · Checks complete  `40:243`

- **Nav** `40:245` — `‹ Back` (`var(--blue)`, 17px) → step 5; `Luna Necklace Card · v3` 16px semibold. **No step counter.**
- **Progress** `40:249` — all five bars `var(--blue)`.
- `ALL ITEMS CHECKED` — 12px semibold, `var(--ink-soft)`, `letter-spacing: 1px`
- Headline — 26px bold, `var(--ink)`, **computed from the marks**:
  - 0 flagged → `Everything matches`
  - 1 flagged → `1 item flagged`
  - n flagged → `{n} items flagged`
- **Results** `40:258` — `gap-2`, one row per item, `bg-[var(--surface)]`, radius 12, `px-3.5 py-3`, space-between:
  - name — 15px medium, `var(--ink)`
  - matched → `✓ Match` — 13px semibold, `var(--green)`, border `1px solid var(--line)`
  - flagged → `⚑ Flagged · {proof value}` — 13px semibold, `var(--red)`, border **`1.5px solid var(--red)`**; the participant's reason renders beneath at 12px `var(--ink-soft)`
- **Notice** `40:274` — only when ≥1 flagged. `bg-[var(--red-tint)]`, radius 12, `px-3.5 py-3`, text 13px `var(--red)`, `line-height: 18px`:
  > V3 cannot be approved with a flagged item. Correcting the record retires V3 and creates V4 — the correction never lives only in chat.
- **Action bar** `40:276` — `px-4 pt-2.5 pb-1.5`, `gap-2`:
  - ≥1 flagged → `Correct the record — creates V4` · `bg-[var(--blue)]`, white, 17px semibold, radius 14, full width
  - 0 flagged → `Approve V3 for production` · `bg-[var(--green)]`, white, same geometry
  - Caption, 13px centered `var(--ink-soft)`, both cases:
    > Nothing is sent from here — you send the sheet yourself on WhatsApp

### 7.5 Flag reason sheet — **shared, not in Figma**

Neither version has one, and the project's key requirement #13 says *"Rejecting an item requires a reason, which is stored with the record."* Without it P1 cannot be tested. Build one component, used identically by A and B.

- Bottom sheet over a `rgba(28,28,31,.4)` scrim. `bg-[var(--surface)]`, top radius 20, `p-4`, `gap-3`. Slide up 180ms; respect `prefers-reduced-motion`.
- Title — 19px semibold, `var(--ink)`: `What's wrong with {title}?`
- Line under it — 13px `var(--ink-soft)`: `The printer's proof shows: {proof}`
- Chip row, wrapping, `gap-2`. Tapping a chip fills the text field; still editable. Chips: `Wrong value`, `Wrong wording or capitalization`, `Wrong size`, `Can't tell from the proof`
- Textarea — required, 3 rows, `1px solid var(--line)`, radius 12, `p-3`, 15px. Placeholder: `Say what the printer got wrong`
- Buttons, `gap-2.5`: `Cancel` (`bg-[var(--chip-bg)]`, `var(--chip-text)`) · `Save flag` (`bg-[var(--red)]`, white, disabled until ≥3 characters)
- On save: `status: 'flagged'`, `reason`, `markedAt`. In B, advance. In A, collapse the row.

### 7.6 Outcome states — **shared, not in Figma**

Both versions must be able to finish, or P2 only half-exists. One component, version-neutral, so neither approach gets a better ending.

**Approved** (0 flagged, approve tapped) — replaces the action bar and locks the marks:

- `✓ V3 APPROVED FOR PRODUCTION` — 12px semibold, `var(--green)`, `letter-spacing: 1px`
- Card, `1px solid var(--line)`, radius 12, `p-3.5`, 14px `var(--ink)`, one line each:
  `Approved by Luisa · today` · `Bound to spec v3` · `3,000 units · supplier minimum 200` · `Lead time starts on approval`
- Caption: `Nothing is sent from here — you send the sheet yourself on WhatsApp`

**Corrected** (≥1 flagged, correct tapped) — **this state is what P2 is tested on, so it has to survive being stared at:**

- `V3 RETIRED · V4 CREATED` — 12px semibold, `var(--blue)`, `letter-spacing: 1px`
- **Current-version card** — `1.5px solid var(--blue)`, radius 12, `p-3.5`:
  - `v4 · current` — 15px semibold, `var(--ink)`
  - each corrected item as `{label} — {reason}`, 14px `var(--ink)`
  - `Send v4 to the printer. This is the version to print.` — 14px medium, `var(--ink)`
- **Retired card** — `1px solid var(--line)`, radius 12, `p-3.5`, `bg-[var(--tint)]`:
  - `v3 · RETIRED` — 15px semibold, `var(--red)`, `letter-spacing: .5px`
  - `Cannot be sent or approved.` — 14px `var(--ink-soft)`
- Version pill in the nav flips to `v4` **on both versions**; A's spec header becomes `YOUR RECORD · spec v4 · saved today`, B's summary nav title keeps the pill at `v4`.
- Append to `HISTORY` in state: `{ version: 4, created: 'today', status: 'current', note: 'Corrected from v3 — {n} item(s)' }` and flip v3's entry to `status: 'retired'`, `note: 'Retired today — corrected: {labels}'`. The history sheet must show this immediately.
- Caption: `Nothing is sent from here — you send the sheet yourself on WhatsApp`
- Below it, a text button `Start over` → resets that version only.

A participant doing task 2 should be able to point at this screen and say "v4, not v3" without you prompting. If they can't, that's the finding.

### 7.7 Approval history — **shared, not in Figma**

P3 (*find what you approved for the packaging, and when*) has no home in either mock. Your project summary already calls for it: *"Each record carries a visible history of which version was approved, by whom, and when."* One component, opened from the `v3` pill on both versions.

- Bottom sheet, same shell as §7.5: scrim `rgba(28,28,31,.4)`, `bg-[var(--surface)]`, top radius 20, `p-4`, `gap-3`, drag-or-tap-scrim to dismiss, `Close` button top-right.
- Title — 19px semibold, `var(--ink)`: `Luna Necklace Card · version history`
- Subtitle — 13px `var(--ink-soft)`: `Packaging record · shared across collections`
- One card per `HISTORY` entry, newest first, `gap-2`, radius 12, `px-3.5 py-3`:

| Entry state | Border | Contents |
|---|---|---|
| current | `1.5px solid var(--blue)` | `v3 · CURRENT` (13px semibold `var(--blue)`, tracking .5) · `Created Feb 4` · note line |
| approved but retired | `1px solid var(--line)` | `v2 · RETIRED` (13px semibold `var(--red)`) · **`✓ Approved by Luisa · Jan 29`** (14px semibold `var(--green)`) · `Created Jan 20` · note line |
| retired, never approved | `1px solid var(--line)`, `bg-[var(--tint)]` | `v1 · RETIRED` (13px semibold `var(--ink-soft)`) · `Created Jan 12` · `Never approved` (13px `var(--ink-soft)`) · note line |

- Dates and notes 13px `var(--ink-soft)`.
- Footer line, 12px `var(--ink-soft)`: `Approval binds to a version number. Only the version shown as current can be sent.`

**Do not add a filter, a search box, a timeline graphic, or pagination.** Three entries, four after a correction.

---

## 8. File layout

```
app/
  layout.tsx            fonts, viewport, metadata
  globals.css           tokens from §4
  page.tsx              home
  a/page.tsx            Version A
  b/page.tsx            Version B (steps + summary)
components/
  PhoneShell.tsx
  ProofWell.tsx         placeholder / public/proof.png / zoom overlay
  SpecRow.tsx           Version A row: resting, expanded, marked
  StepCard.tsx          Version B record + proof card pair
  ProgressBars.tsx
  Sheet.tsx             scrim + bottom sheet shell, used by both sheets
  FlagSheet.tsx
  HistorySheet.tsx      §7.7 — opened from the version pill on both versions
  VersionPill.tsx       the v3 / v4 button, identical in A and B
  OutcomePanel.tsx
  ActionButton.tsx      one button, variants: green | blue | red-tint | disabled
lib/
  record.ts             §3 — items + history, the only place content lives
  state.ts              §6
public/
  (proof.png goes here later — ship empty)
```

---

## 9. Do not build

Every line here is something a coding agent will reach for unprompted. None of it serves the research question, and each one costs you a day you need for interviews.

- No backend, database, API route, Supabase, auth, or user accounts
- No file upload, camera, or drag-and-drop
- No PDF or image generation
- No WhatsApp, email, or share integration
- No analytics SDK, no cookie banner, no consent modal
- No dark mode, no theme switcher
- No animation library (framer-motion), no component library (shadcn, MUI, Radix), no icon package — the four glyphs you need are `‹ ✓ ⚑ ·`
- No fake iOS status bar and no fake home indicator (§5)
- No `README` beyond three lines, no tests, no Storybook, no CI
- No new copy, no reworded copy, no "improved" microcopy, no translations
- No sixth spec item, no extra record fields, no collection or manufacturer screens
- No A/B assignment logic, cookies, or feature flags — the moderator picks the route by hand
- No difference between A and B beyond §7.2 vs §7.3

If something feels missing, it is either in §7.5 / §7.6 or it is out of scope. Ask before adding.

---

## 10. Acceptance checklist

Run this on a real phone before you book a participant.

**Content**

- [ ] Both routes read the same `ITEMS` array; grep confirms the strings appear exactly once in the repo
- [ ] `9.0 × 5.5 cm` uses `×`; `‹ Records`, `‹ Exit`, `‹ Back` use `‹`
- [ ] `Hecho a mano en Colombia` renders with correct accents on iOS Safari and Android Chrome
- [ ] Print text and dimensions values can be selected and copied by long-press

**P1 — you received product specifications from the manufacturer**

- [ ] `/a`: all five rows can be marked in any order; counter goes `0 of 5` → `5 of 5`
- [ ] `/b`: Match advances 1→2→3→4→5→summary; progress bars fill in step
- [ ] Flagging on either version opens the reason sheet; `Save flag` is disabled until 3+ characters
- [ ] The reason shows on the A row and on the B summary, in the participant's words
- [ ] Cancel leaves the item unchecked
- [ ] Marks survive a page refresh
- [ ] `/a` and `/b` state are independent — marking all of A leaves B untouched

**P2 — make sure they print the corrected version**

- [ ] `/a` approve is visibly disabled and not tappable while anything is unchecked
- [ ] With ≥1 flag, neither version offers approve — only `Correct the record — creates V4`
- [ ] After correcting, both versions show `v4 · current` **and** `v3 · RETIRED · Cannot be sent or approved` on the same screen
- [ ] The nav pill reads `v4` and the history sheet shows the new v4 entry with v3 flipped to retired
- [ ] With 0 flags, approving shows the commitment: bound to v3, 3,000 units, minimum 200, lead time starts on approval

**P3 — find what you approved, and when**

- [ ] The `v3` pill is tappable on both `/a` and `/b`, in the nav, with the same look
- [ ] The history sheet answers *which version, by whom, when* in one glance: **v2 · Approved by Luisa · Jan 29**
- [ ] v1 reads `Never approved`; v3 reads `CURRENT`, not approved
- [ ] The sheet is reachable mid-task without losing marks already made

**Parity — the comparison is only valid if these hold**

- [ ] In A, record value and proof value render at the same size, weight and colour
- [ ] The full print-text proof string is visible, unwrapped or wrapped, never truncated, at 320px
- [ ] §7.5, §7.6 and §7.7 are the same components in both routes, with no A-only styling

**Device**

- [ ] Opens on a phone that is not yours, on cellular data, from a cold link
- [ ] Nothing is cut off at 393px wide; nothing needs a horizontal scroll
- [ ] Bottom action bar clears the iPhone home bar
- [ ] No console errors, no hydration warning
- [ ] `Reset both to seed` on `/` returns both routes to `0 of 5`

---

## 11. Ship it

```bash
npx create-next-app@latest lua-proof --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*"
cd lua-proof
# build per this plan
npm run dev            # check /, /a, /b at 393px in device emulation
git init && git add -A && git commit -m "A/B proof approval prototype"
gh repo create lua-proof --public --source=. --push
```

Then in Vercel: **Add New → Project → import `lua-proof` → Deploy.** No env vars, no settings to change. Every later `git push` redeploys.

Before the first session:

1. Open `https://<project>.vercel.app/`, `/a`, `/b` **on someone else's phone**. Post the link in Discord as the assignment asks.
2. Run yourself through all three research tasks on both routes, timed. If a task can't be completed, that's a build bug, not a finding — fix it and push.
3. `Reset both to seed` between every participant.
4. Split the start order: participants 1, 3, 5 begin on A; 2 and 4 begin on B.

---

## 12. Paste this into Claude Code

> Read `BUILD_PLAN.md` in full before writing anything. Build exactly what §7 specifies and nothing from §9. Order: `lib/record.ts` and `app/globals.css` → `PhoneShell`, `Sheet`, `VersionPill`, `ActionButton` → `/a` → `/b` → the three shared pieces `FlagSheet`, `HistorySheet`, `OutcomePanel`, wired identically into both routes. Copy is verbatim from the plan — do not reword it, do not translate it. When you finish a route, run it at 393px and show me a screenshot before moving on. Then walk §10 yourself and tell me which boxes fail. If anything in the plan is ambiguous, ask instead of deciding.

---

## 13. Judgment calls I made — check these before you build

The assignment asks you to read the plan and push back. Here are the places I decided something Figma didn't say, so you know where to look:

1. **Two mismatches are planted, not one.** Print text differs by capitalization; dimensions differ by 0.5 cm. Figma's summary mock showed only Dimensions flagged. I made the summary compute from real marks instead. *If you'd rather the study be cleaner, delete the capitalization mismatch — but it's the exact failure that cost Luisa 9,000 misprinted pieces, so I'd keep it.*
2. **Version A's `Check` chip expands inline** rather than opening a modal. A modal would make A behave like B and blur the comparison.
3. **Both versions get an approve/correct ending.** Figma only drew B's summary. Without a matching ending on A, P2 would only be testable on one version and the comparison would be unfair.
4. **The flag reason sheet is new.** Nothing in Figma captures a reason, but your own requirement #13 demands one, and P1 is untestable without it.
5. **The approval history is new, and Version B's nav changes slightly to reach it.** P3 has no screen in either mock. I added one sheet (§7.7) and turned the `v3` label in B's title into the same pill A already has, so the entry point is comparable on both sides. *This is the one place I altered a Figma element.* If you'd rather not touch B's nav, the alternative is replacing B's `1/5` counter with the pill — the progress bars already communicate the step — but that's a bigger change, so I didn't.
6. **v2 is approved and retired; v3 is current and unapproved.** I seeded it that way so P3 has a specific answer and so P2 isn't trivially "the current one is the approved one." It also happens to be exactly the failure in your problem statement: a sign-off overtaken by a correction that only lived in chat.
7. **No per-step back button in Version B.** Figma doesn't show one. Leaving it out is a deliberate test of whether the wizard feels like a trap — if participants reach for it, that's your finding, not your bug.
8. **`Zoom Image` is wired to a real overlay.** A dead control mid-task reads as a broken prototype and contaminates the debrief.
9. **Version A carries more new surface than B** — an inline expand, an approve/correct ending, and the history sheet. That's the cost of A having been drawn as a single static screen. Watch that Claude Code doesn't quietly make A richer than B; §7.5–§7.7 must be byte-identical components in both.
10. **Version A's proof value is 14px, not Figma's 10px.** Figma sized the evidence smaller than the record it's compared against. Since one planted mismatch is a capitalization difference, a 10px proof line would confound catch rate with legibility — a loss for A would be unreadable. Record and proof are now typographically identical within A, and the value wraps rather than truncates so the exact characters under test are always fully visible. Parity is enforced within each version, not across them.
