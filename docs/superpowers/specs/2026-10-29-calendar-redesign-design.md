# Notifything redesign: Thai wall calendar + passbook rows

Date: 2026-10-29 · Branch: `dev` · Product truth: `PRODUCT.md`

## Intent

Replace the whole visual world of the app: every page, the shell, and the
loading/error states. The current dark indigo "workbench" look is retired. The
owner (single user, phone-first PWA, Thai-first) opens the app mostly right
after a push reminder, to see what is due next and to record a payment. The new
world answers that in one glance.

Chosen direction (user approved, 2026-10-29): **A · Thai wall calendar**, with
**B's bank-passbook rows** for payment-plan history. The approved mockup is
`.superpowers/demos/directions.html` (panel A for the shell/dashboard, panel B
for plan rows). It is a reference for feel and hierarchy, not a pixel contract.

## Goals

1. Every page redesigned in one coherent light world: shell, `/dashboard`,
   `/jobs/new`, `/jobs/[id]`, `/payments`, `/sign-in`, all `loading.tsx`
   skeletons, `error.tsx`, `not-found` if present.
2. Keep the Thai cron description (`lib/cron.ts` `describeCron`,
   `components/ui/CronSchedule.tsx`) everywhere a cron appears: jobs list,
   job detail, add-job presets and live hint, and the new edit form.
3. Job editing on `/jobs/[id]` via the backend's `PATCH /jobs/:id`
   (body `{ name?, cron?, enabled? }`, `additionalProperties: false`):
   - rename (requested),
   - change cron with the live Thai description + presets,
   - enabled on/off switch.
   Delete is out of scope.
4. UI copy Thai-first. Cron strings, IDs, amounts stay literal.

## Non-goals

- No new backend endpoints, no change to data-fetching/caching architecture
  (`lib/api.ts` reads with `revalidate: 60, tags: ["jobs"]`; writes through
  same-origin route handlers that call `revalidateTag("jobs", "max")`).
- No delete job, no edit/delete payment records, no push-subscription UI changes
  beyond restyling.
- No new chart library, no new UI framework.

## Anti-goals (failure even if it "works")

- Weekday colours used as decoration. They may appear **only** on things that
  are dates (leaf header band, mini-leaf strip, calendar due-day marks). Never on
  buttons, headings, nav, or status.
- A wrong schedule or wrong money: any computed next-run date that can't be
  derived exactly must show nothing rather than a guess (same contract as
  `describeCron`'s `CRON_FALLBACK`).
- Regressing the existing responsive guarantees (no horizontal scroll at
  320–1440, ≥44px touch targets, safe-area insets, reduced motion).

## Visual world (decided)

**Scene:** a phone in daylight, opened from a notification → light theme.

**Palette** (oklch, replace `tokens.css` values; keep token *names* where they
still fit, rename freely if clearer — update every usage):
- paper (app ground) `oklch(98.5% 0.004 95)`; card/leaf surface `#fff`-ish
  `oklch(100% 0 0)`; hover/input surface `oklch(96% 0.004 95)`.
- ink `oklch(20% 0.01 260)`; ink-2 (secondary) `oklch(45% 0.01 260)` — must pass
  4.5:1 on paper; rule `oklch(90% 0.005 260)`; leaf edge `oklch(88% 0.01 260)`.
- Primary action = ink fill with white text (calendar black). There is no
  separate brand accent hue.
- Sunday/holiday red `oklch(55% 0.2 25)` (also used for Sunday numerals in the
  grid). Danger/overdue uses the same red family; danger text must hit 4.5:1.
- **Thai weekday colours** (Sun→Sat), as tokens `--day-0`…`--day-6`:
  อาทิตย์ red `oklch(58% 0.2 25)`, จันทร์ yellow `oklch(85% 0.16 95)`,
  อังคาร pink `oklch(70% 0.15 350)`, พุธ green `oklch(62% 0.15 150)`,
  พฤหัสบดี orange `oklch(72% 0.17 55)`, ศุกร์ blue `oklch(62% 0.15 250)`,
  เสาร์ purple `oklch(52% 0.17 300)`. Text placed on a weekday band uses a dark
  ink of adequate contrast (all bands are mid/light except เสาร์/อาทิตย์ → white
  text on those two; verify contrast).
- Charts: paid = ink, unpaid track = `oklch(91% 0.005 260)`.

**Type** (via `next/font/google`, replacing Inter/Noto Sans Thai):
- Kanit 500/600/700 — display: page titles, leaf numerals, card names.
- Anuphan 400/500/600 — UI/body (Thai + Latin).
- JetBrains Mono 400/600 — cron, IDs, amounts, dates in tables (tabular-nums).
- Body text ≥14px; secondary/meta ≥12px; nothing functional below 12px.

**Signature move — the tear-off leaf** (`components/calendar/DateLeaf.tsx`,
new): a white card with a weekday-coloured header band (two punched "holes"),
the Thai weekday name, a huge Kanit day numeral, and "เดือน พ.ศ." beneath; a
1–2px stacked-sheet shadow suggests the pad. Sizes: `lg` (dashboard hero, job
detail header), `sm` (mini leaf in lists: band strip + numeral only). Dates are
rendered in **Asia/Bangkok** with Buddhist-era years (`th-TH` locale).

**Passbook rows** (plan history, from direction B): a ruled table on a white
page — columns วันที่ (dd/mm/yy BE, mono) · รายการ (งวด n) · จ่าย · คงเหลือ
(running balance after the row) — dotted row separators, the next unpaid
installment as the last row in danger/red with "ครบกำหนด" and no balance.
On narrow cards it stays a table (4 short mono columns fit at 320px); verify.

**Shape & motion:** radius 6–8px on leaves/inputs, 12px on cards, buttons 8px.
Hairline rules, no gradients, no glow, no backdrop blur. Hover = surface shift
180ms; press = translateY(1px); reduced motion keeps the existing global rule.

## Information architecture & pages

**Shell** (`components/layout/*`):
- Mobile (<768px): top bar (wordmark "Notifything" in Kanit + today's date
  "พ. 29 ต.ค. 2569" + avatar menu) and a bottom tab bar with safe-area padding:
  หน้าหลัก (`/dashboard`), การชำระ (`/payments`), เพิ่มงาน (`/jobs/new`).
- ≥768px: left rail with the same three destinations + wordmark; content
  column max ~1100px.
- Keep the HeroUI Dropdown/Avatar sign-out menu (restyled, Thai labels:
  ออกจากระบบ). Remove the dead "Settings" item.
- `<html lang="th">`, light `color-scheme`, `themeColor`, manifest
  `background_color`/`theme_color`, and Clerk `appearance` all switch to the
  light palette.

**`/dashboard`:**
1. Hero "ครบกำหนดถัดไป · อีก N วัน": the earliest upcoming run among enabled
   jobs, as a `lg` DateLeaf + job name + (if the job has a payment plan) งวดที่
   n/total, monthly amount, progress bar, คงเหลือ, projected finish, and a
   primary "บันทึกการชำระ" button that opens the existing add-payment modal for
   that plan. A job without a plan shows name + Thai cron description + a link
   to the job.
2. Month card: current month grid (Sun-first, Thai weekday initials
   อา จ อ พ พฤ ศ ส), each day with ≥1 run of an enabled job gets a dot in its
   weekday colour; the hero's day is outlined; today is marked. Sunday numerals
   red. A count "N รายการ" of runs this month.
3. Stat line: งานที่เปิดอยู่ (enabled count / total), ชำระแล้ว (paid to date),
   คงเหลือรวม (remaining across plans). Compact, not four big cards.
4. "งานทั้งหมด" list ordered by next run: `sm` leaf (or a neutral "—" leaf when
   the next run can't be derived), name, CronSchedule (literal + Thai), status
   when disabled (ปิดอยู่). Each row links to `/jobs/[id]`. Desktop may render
   as a table; mobile as rows — never horizontal scroll.
5. Empty state (no jobs): one line + "เพิ่มงาน" button. API error: danger
   callout in Thai with the raw message.

**`/jobs/[id]`:**
- Header: `lg` leaf for the next run (or neutral when unknown) + job name (h1)
  + status, back link "กลับ".
- **Edit panel** (client component): name input, cron input with presets
  (existing `CRON_PRESETS`, labels in Thai using `describeCron`) and live
  `CronSchedule` preview, enabled switch (a real `<input type="checkbox"
  role="switch">` or button with `aria-pressed`, ≥44px). Default state is
  read-only display with a "แก้ไข" button; editing shows inputs + "บันทึก" /
  "ยกเลิก". Save sends only changed fields to `PATCH /api/jobs/[id]`; on
  success `router.refresh()` and return to read mode; on failure keep inputs and
  show the error. Save disabled while pending or when nothing changed or name is
  blank. The enabled switch may save immediately (optimistic, revert + error on
  failure) — builder's call.
- Facts: Job ID (mono), last run, created (Thai dates).
- Push subscription section (restyled, Thai labels).
- Payment plans: `PlanCard` in the new world with passbook rows + record
  payment.

**`/jobs/new`:** same fields as today (name, cron) in the new world, presets
with Thai descriptions, live `CronSchedule` hint, Thai copy ("เพิ่มงาน",
"ยกเลิก", errors). Behaviour unchanged.

**`/payments`:** every job with plans; each `PlanCard`: plan description,
`PlanProgress` (paid/total months, % , remaining, projected finish),
`BalanceChart` (restyled to the light palette, same burn-down semantics), the
passbook rows, and "บันทึกการชำระ" → `AddPaymentModal` (restyled, Thai labels,
same POST payload). Per-job error cards stay.

**`/sign-in`:** light ground, wordmark + a decorative today-leaf, Clerk form
with light appearance.

**Loading/error:** skeletons mirror each new layout (leaf block, month grid,
rows). `error.tsx` in Thai with retry.

## Behaviour details

- **Next run** (new, `lib/cron.ts` `nextRun(expr, from: Date): Date | null`):
  compute the next fire time in Asia/Bangkok for the shapes `describeCron`
  already understands; return `null` for anything else. Pure function, extend
  `lib/cron.test.ts` with cases (daily, monthly day N incl. months shorter than
  N, weekdays, step minutes, month lists, fallback → null). The backend runs
  crons in Asia/Bangkok (`0 12 5 * *` last ran at 05:00Z).
- **Thai date helpers** in `lib/format.ts`: weekday index in Bangkok, Thai
  weekday name, BE date strings (short "5 พ.ย. 2569", long "พฤศจิกายน 2569",
  table "05/11/69"). Replace the en-US formatters' call sites.
- **Plan next installment** (new pure helper, e.g. `lib/plan.ts`
  `nextInstallment(plan)`; no such rule exists in the code yet): if any record
  is unpaid, the earliest unpaid record (its `paymentMonth`, `dueDate`,
  `amount`). Otherwise, if paid records < `totalMonths`: งวดที่ = max
  `paymentMonth` + 1 (1 when no records), due = last record's `dueDate` + 1
  calendar month (or `startDate` when no records), amount = `monthlyAmount`.
  Otherwise `null` (plan complete). Remaining = total − sum of paid amounts and
  months left = totalMonths − paid count, exactly as `PlanProgress` computes
  today (move that math into the helper and have both use it). Add a tsx
  self-check like `lib/cron.test.ts`.
- **Record-payment prefill**: "บันทึกการชำระ" opens `AddPaymentModal` for
  that plan prefilled with the next installment's งวด, due date and amount
  (fields stay editable).
- **PATCH proxy** `app/api/jobs/[id]/route.ts`: same pattern as the existing
  proxies. Validate at this trust boundary: accept only `name` (string, trimmed,
  1–100 chars), `cron` (string, 5 whitespace-separated fields or an `@macro`),
  `enabled` (boolean); reject unknown keys/empty body with 400 and a Thai
  message; forward to `${API}/jobs/${id}` with `PATCH`; `revalidateTag("jobs",
  "max")` on success; pass status/body through. Clerk middleware already
  protects `/api/*`.
- **Types**: no change needed beyond optional helpers.

## Constraints

- Next.js 16 app router, React 19, Tailwind v4 (CSS-first, `@theme inline`),
  HeroUI v3 beta present, lucide icons.
- No test suite; checks are `npx tsc --noEmit`, `npm run lint`,
  `npx tsx lib/cron.test.ts`, `npm run build`.
- Responsive floor verified at 320 / 375 / 414 / 768 / 1024 / 1440.
- Accessibility: one `h1` per page, sr-only data tables for charts kept, dates
  carry text not just colour (weekday name/initial accompanies every colour).
- `design.md` (old system) is superseded: replace its content to describe the
  new world after the build (the Impeccable documenter step).

## Left to the builder

- Exact component split, file names beyond those named above.
- Desktop arrangement (e.g. hero + month side by side ≥1024px).
- Whether the enabled switch saves immediately or with the form.
- Exact skeleton shapes.

## Decisions settled after the builder check (my calls — flag any you disagree with)

1. **Hero = next payment, not next cron run.** It shows the most urgent
   installment across all plans: an overdue one first (red, "เลยกำหนด N วัน"),
   else the earliest upcoming due date from `nextInstallment`. The leaf shows
   that installment's due date. Only when no plan has an outstanding
   installment does the hero fall back to the earliest `nextRun` among enabled
   jobs (name + Thai cron description + link). With neither, it shows a quiet
   "ยังไม่มีกำหนดถัดไป" state. This matches the approved mockup, where
   ค่างวดรถ (5 Nov) leads even though Netflix gang runs on 3 Nov.
2. **"อีก N วัน"** counts Bangkok calendar days, computed at render on the
   server: 0 → "วันนี้", 1 → "พรุ่งนี้". Staleness up to the 60s cache is fine.
3. **Calendar dots** use a new pure `runDaysInMonth(expr, year, month): number[] | null`
   (Bangkok), which returns the days with ≥1 run. Each day shows one dot per job, up to 3,
   then "+". The count reads "N งาน" (distinct jobs with a run this month).
   Sub-daily or daily jobs mark every day, which is acceptable. Jobs whose cron
   returns `null` are omitted, with a small line "ไม่แสดง N งาน (รูปแบบกำหนดเอง)".
4. **Several plans on one job:** take the plan with the most urgent
   installment (same rule as 1). Complete plans show "ชำระครบแล้ว".
5. **Record payment** keeps `AddPaymentModal`'s existing POST semantics and its
   existing `prefill` path for an existing unpaid record (`onRecordPayment`).
   When the next installment is synthesized, prefill งวด, due date and amount.
6. **Edit form:** a 5-field cron that `describeCron` can't parse may still be
   saved (the preview shows the fallback text). The proxy validates only the
   shape. A backend error is shown raw under a Thai lead-in ("บันทึกไม่สำเร็จ:").
7. **Scope:** the existing `/jobs/[id]` not-found handling (200 + empty body)
   stays as is. Replacing `design.md` (and the CLAUDE.md design notes) with the
   new world is the plan's final task.
