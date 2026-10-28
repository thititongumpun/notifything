# Design — Notifything

Locked design system, derived from the shipped code. Light only, Thai-first: a
Thai wall calendar plus bank-passbook rows. Extend this file when the system grows.

## Tokens (`tokens.css`, imported by `app/globals.css`)
- Surfaces: `--color-paper` (bg, warm off-white) / `-paper-2` (cards, white) / `-paper-3` (inputs, hover).
- Text: `--color-ink` (primary, also the accent), `--color-ink-2` (secondary, 7:1 on paper).
- Lines: `--color-rule` (hairlines), `--color-leaf-edge` (date-leaf border), `--color-track` (unpaid / empty).
- Accent = ink. Primary button: ink fill, white text (`--color-accent-ink`), radius 8px. Hover lightens to ink-2.
- `--color-danger` / `--color-sunday` (red) for overdue and Sunday header only. `--color-focus` = ink, 2px outline, offset 2px.
- Spacing `--space-3xs…3xl` (4-pt named); text `--text-xs 12 / sm 14 / md 18 / title 20 / lg 22 / xl 28 px`; leading body 1.6, table 1.5, tight 1.2.
- Radii: card 12, input 8, leaf 6, pill 999. Motion: `--ease-out`, `--dur-short` 180ms; reduced-motion = colour/opacity only, 150ms.
- No gradients, glow, backdrop-blur, or italics.

## Weekday colours
`--day-0…--day-6` (Sun..Sat: red, yellow, pink, green, orange, blue, purple) with paired `--day-ink-N` text colour.
**Rule: weekday colours appear only on date marks** (DateLeaf band, mini-leaf strip, calendar due-day dots). Never on buttons, headings, nav or status. Colour never stands alone: the weekday name/initial always accompanies it.

## Type roles (`app/layout.tsx`, `next/font`, registered in `@theme inline`)
- Display `--font-display`: Kanit 500/600/700 - h1-h3, leaf numerals, wordmark. Tracking -0.02em, `text-wrap: balance`.
- Body `--font-body`: Anuphan 400/500/600 - all UI text. Thai + Latin subsets.
- Mono `--font-mono`: JetBrains Mono - cron literals, IDs, amounts, endpoints; `tabular-nums`.
- Body >=14px, meta >=12px, nothing functional below 12px. One `h1` per page. Never mix display and mono on one element.

## Language and dates
- All UI copy is Thai. Kept literal: "Notifything", cron strings, IDs, amounts (`฿` + `fmt()`).
- All dates go through `lib/format.ts`: `Asia/Bangkok`, Buddhist-era years. `fmtThaiDate` ("5 พ.ย. 2569"), `fmtThaiDateTime`, `fmtThaiMonthYear`, `fmtPassbookDate` (dd/mm/BE-yy), `relativeDayLabel` (วันนี้ / พรุ่งนี้ / อีก N วัน / เลยกำหนด N วัน). Day maths uses `bkkParts` / `daysUntil` so 00:05 Bangkok is that Bangkok day. No `en-US` display formatting.
- Honest fallback: a cron `describeCron` cannot read shows "รูปแบบ cron กำหนดเอง", its leaf is neutral with "—", the calendar omits it and says how many were omitted; `nextRun`/`runDaysInMonth` return `null`; nothing throws. Never guess a date.
- Every cron shown goes through `components/ui/CronSchedule.tsx` (literal in mono + Thai description). No timezone label (none configured).

## Components
- **DateLeaf** (`calendar/DateLeaf.tsx`): `lg` 118px tear-off leaf (weekday-colour band with two punch dots, Thai weekday, 76px day numeral, month-year in BE); `sm` 34px strip leaf for lists. `role="img"` with a full Thai aria-label; null date = neutral track band and "—".
- **Passbook rows** (`payments/PlanCard.tsx`): date (`fmtPassbookDate`) / item / amount / running "Balance After" ledger; plan header shows installment size and remaining; unpaid rows are marked "ครบกำหนด". Responds to card width via container queries (`@container`, `@min-[44rem]`), stacking below; amounts use `overflow-wrap:anywhere`. `charts/PlanProgress` + `charts/BalanceChart` give Thai "how long to 100%" and the remaining-balance burn-down (inline SVG, solid = recorded, dashed = projected); chart labels are HTML text, and each chart has an sr-only table.
- **MonthCalendar** (`dashboard/MonthCalendar.tsx`): Sun-first month grid, Sunday header in `--color-sunday`, due days get weekday-colour dots, today underlined/outlined; `+` marks overflow; footnote counts unreadable crons.
- **NextDueHero** (`dashboard/NextDueHero.tsx`): the single next installment, 2px ink border, large leaf, job link, installment n / total, cron, and a record-payment button; falls back to the next cron run when no plan is due. Overdue text uses `--color-danger`.
- **JobEditor** (`jobs/JobEditor.tsx`): edit name / cron (presets in `presets.ts`) / enabled on job detail, via `PATCH /api/jobs/[id]` proxy. Save disabled when unchanged or name is blank; errors in `dangerCallout`.
- **Shell** (`layout/`): `AppShell` = desktop `Sidebar` + `TopBar` (Thai page title, today's date) + mobile `MobileNav` tab bar (หน้าหลัก / การชำระ / เพิ่มงาน). Content max 1100px. Top bar and tab bar use `env(safe-area-inset-*)`.
- **Shared styles** (`ui/styles.ts`): `btnPrimary`, `btnSecondary`, `backLink`, `dangerCallout`, `card`, `input`; `StatusChip` is the only status mark (dot + Thai text).

## Interaction
- Silent success, no toasts. Hover = colour only; active = translateY(1px); focus ring instant.
- Touch targets >=44px. Card actions sit under a 1px rule.
- Skeletons (`loading.tsx`) match page geometry.

## Responsive floor (non-negotiable)
- Verified at 320 / 375 / 414 / 768 / 1024 / 1440 with no horizontal scroll (`overflow-x: clip` on html/body).
- Grid tracks use `minmax(0, 1fr)`; long names get `overflow-wrap:anywhere; min-width:0` and wrap inside leaves, rows and cards without truncating amounts.
- <768px: bottom tab bar replaces the sidebar; tables become stacked rows. Manifest `theme_color` / `background_color` = `#fbfaf7` (paper).
