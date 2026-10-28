# Calendar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin every Notifything page into the light "Thai wall calendar + passbook rows" world, and add job editing (name, cron, enabled) through `PATCH /jobs/:id`.

**Architecture:** First come pure, self-checked helpers in `lib/`: Bangkok/BE dates, cron next-run and run-days, plan next-installment, and PATCH body validation. Then the visual foundation (tokens, fonts, `DateLeaf`), then one task per surface. Data fetching and caching stay exactly as they are: reads go through `lib/api.ts`, and writes go through same-origin proxies plus `revalidateTag("jobs","max")`.

**Tech Stack:** Next.js 16 app router, React 19, Tailwind v4 (CSS-first `@theme inline`), HeroUI v3 beta, lucide-react, `next/font/google`, `npx tsx` self-check scripts (no test framework).

**Spec:** `docs/superpowers/specs/2026-10-29-calendar-redesign-design.md`. Read it, especially "Visual world", "Information architecture & pages", "Behaviour details" and "Decisions settled after the builder check". Visual reference: `.superpowers/demos/directions.html`, panel A (shell/dashboard) and panel B (passbook rows).

## Global Constraints

- Light theme only. Palette, weekday colours `--day-0`…`--day-6`, fonts (Kanit display, Anuphan UI, JetBrains Mono for cron/IDs/amounts) are taken exactly as the spec's "Visual world" lists them.
- Weekday colours appear ONLY on dates (leaf band, mini-leaf strip, calendar due-day dots). They never appear on buttons, headings, nav or status.
- Primary button = ink fill + white text, radius 8px. Cards 12px radius. Leaves/inputs 6–8px. No gradients, glow or backdrop-blur.
- UI copy is Thai. Cron strings, IDs and amounts stay literal. Every cron shown goes through `components/ui/CronSchedule.tsx` (literal + `describeCron`).
- All dates are rendered in `Asia/Bangkok` with Buddhist-era years via `lib/format.ts` helpers. No `en-US` date formatting is left after Task 9.
- Body text ≥14px, meta ≥12px, nothing functional <12px. Touch targets ≥44px. One `h1` per page. Colour is never the only carrier of meaning (the weekday name or initial always accompanies it).
- No horizontal scroll at 320/375/414/768/1024/1440. `minmax(0,1fr)` tracks, `overflow-wrap:anywhere` on long names. Safe-area insets on top bar and tab bar. The existing `prefers-reduced-motion` rule in `tokens.css` is kept.
- Do not change `lib/api.ts` caching, the not-found handling in `app/(app)/jobs/[id]/page.tsx` (200 + empty body ⇒ `notFound()`), or the POST payloads of `/api/payments` and `/api/jobs/addjob`.
- Checks for every task: `npx tsc --noEmit` and `npm run lint` are clean (no new warnings), plus the task's own `npx tsx` self-checks. UI tasks also run `npm run build`.
- Each implementer commits their own task. No pushes.

## Review Focus

1. **Long Thai names or plan descriptions at 320px:** they wrap inside leaves, rows and cards. Nothing overflows or truncates the amount. → Task 9 verification step (320px screenshot with a 60-char name).
2. **Edit form edge input:** a whitespace-only name, an unchanged form, `{}` or unknown keys. Save is disabled in the UI, and the proxy answers 400 with a Thai message. → Task 5 `lib/jobPatch.test.ts` cases.
3. **A cron `describeCron` can't read (e.g. `0 12 L * *`):** lists show a neutral leaf with "—", the calendar omits it and says so, and nothing throws. → Task 1 tests (`nextRun`/`runDaysInMonth` → `null`) + Task 7 rendering.
4. **Day boundary in Bangkok:** a run at 00:05 Bangkok counts as that Bangkok day, not the UTC day. → Task 1 `bkkParts`/`daysUntil` tests.
5. **A plan with no records, a plan fully paid, or a plan whose month after the 31st is February:** next installment is month 1 at `startDate`, `null`, and clamped to Feb 28 respectively. → Task 2 tests.

---

### Task 1: Bangkok date helpers + cron next run / run days

**Files:**
- Modify: `lib/format.ts` (add helpers; keep `fmt`; old `fmtDate`/`formatDate` stay until Task 9 removes them)
- Create: `lib/format.test.ts`
- Modify: `lib/cron.ts` (add exports, reuse the existing `field()` parsing; do not change `describeCron` output)
- Modify: `lib/cron.test.ts` (append cases)

**Interfaces:**
- Produces (`lib/format.ts`):
  - `bkkParts(d: Date): { year: number; month: number /*1-12*/; day: number; weekday: number /*0=Sun*/; hour: number; minute: number }` (Gregorian year, Asia/Bangkok)
  - `THAI_WEEKDAYS: readonly string[]` = `["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"]`; `THAI_WEEKDAY_INITIALS` = `["อา","จ","อ","พ","พฤ","ศ","ส"]`
  - `fmtThaiDate(v: string | Date | null): string` → `"5 พ.ย. 2569"`, `"—"` for null
  - `fmtThaiDateTime(v: string | Date | null): string` → `"5 พ.ย. 2569 12:00"`, `"—"` for null
  - `fmtThaiMonthYear(v: string | Date): string` → `"พฤศจิกายน 2569"`
  - `fmtPassbookDate(v: string | Date): string` → `"05/11/69"` (dd/mm/BE-yy)
  - `daysUntil(target: Date, now: Date): number`: difference in Bangkok calendar days (negative when past)
  - `relativeDayLabel(n: number): string` → `0:"วันนี้"`, `1:"พรุ่งนี้"`, `n>1:"อีก n วัน"`, `n<0:"เลยกำหนด |n| วัน"`
- Produces (`lib/cron.ts`):
  - `nextRun(expr: string, from: Date): Date | null`: first fire time strictly after `from`, crons interpreted in Asia/Bangkok (UTC+7, no DST). Invariant: returns `null` exactly when `describeCron(expr) === CRON_FALLBACK`.
  - `runDaysInMonth(expr: string, year: number, month: number /*1-12*/): number[] | null`: sorted Bangkok days of that month with ≥1 run; `null` under the same invariant.

- [ ] **Step 1: Write `lib/format.test.ts`** (same style as `lib/cron.test.ts`: `node:assert/strict`, header comment `// Run: npx tsx lib/format.test.ts`):

```ts
assert.equal(fmtThaiDate("2026-11-05T05:00:00Z"), "5 พ.ย. 2569");
assert.equal(fmtThaiDate(null), "—");
assert.equal(fmtThaiDateTime("2026-11-05T05:00:00Z"), "5 พ.ย. 2569 12:00");
assert.equal(fmtThaiMonthYear("2026-11-05T05:00:00Z"), "พฤศจิกายน 2569");
assert.equal(fmtPassbookDate("2026-11-05T05:00:00Z"), "05/11/69");
assert.deepEqual(bkkParts(new Date("2026-10-31T17:30:00Z")), { year: 2026, month: 11, day: 1, weekday: 0, hour: 0, minute: 30 });
assert.equal(daysUntil(new Date("2026-11-05T05:00:00Z"), new Date("2026-10-29T07:00:00Z")), 7);
assert.equal(daysUntil(new Date("2026-10-29T16:59:00Z"), new Date("2026-10-29T01:00:00Z")), 0);
assert.equal(daysUntil(new Date("2026-10-29T17:01:00Z"), new Date("2026-10-29T16:59:00Z")), 1);
assert.equal(daysUntil(new Date("2026-10-27T05:00:00Z"), new Date("2026-10-29T07:00:00Z")), -2);
assert.equal(relativeDayLabel(0), "วันนี้");
assert.equal(relativeDayLabel(1), "พรุ่งนี้");
assert.equal(relativeDayLabel(7), "อีก 7 วัน");
assert.equal(relativeDayLabel(-2), "เลยกำหนด 2 วัน");
assert.equal(THAI_WEEKDAYS[4], "พฤหัสบดี");
```

- [ ] **Step 2: Append to `lib/cron.test.ts`:**

```ts
const at = (s: string) => new Date(s);
const iso = (d: Date | null) => d?.toISOString() ?? null;
assert.equal(iso(nextRun("0 12 5 * *", at("2026-10-29T07:00:00Z"))), "2026-11-05T05:00:00.000Z");
assert.equal(iso(nextRun("0 12 5 * *", at("2026-11-05T05:00:00Z"))), "2026-12-05T05:00:00.000Z"); // strictly after
assert.equal(iso(nextRun("0 12 31 * *", at("2026-11-01T00:00:00Z"))), "2026-12-31T05:00:00.000Z"); // Nov has 30 days
assert.equal(iso(nextRun("0 9 * * 1-5", at("2026-10-30T03:00:00Z"))), "2026-11-02T02:00:00.000Z"); // Fri 10:00 → Mon 09:00
assert.equal(iso(nextRun("*/15 * * * *", at("2026-10-29T07:07:00Z"))), "2026-10-29T07:15:00.000Z");
assert.equal(iso(nextRun("0 0 1 1,7 *", at("2026-10-29T00:00:00Z"))), "2026-12-31T17:00:00.000Z");
assert.equal(iso(nextRun("@monthly", at("2026-10-29T00:00:00Z"))), "2026-10-31T17:00:00.000Z");
assert.equal(nextRun("0 12 L * *", at("2026-10-29T00:00:00Z")), null);
assert.deepEqual(runDaysInMonth("0 12 5 * *", 2026, 11), [5]);
assert.deepEqual(runDaysInMonth("0 9 * * 1-5", 2026, 11), [2,3,4,5,6,9,10,11,12,13,16,17,18,19,20,23,24,25,26,27,30]);
assert.deepEqual(runDaysInMonth("0 12 31 * *", 2026, 11), []);
assert.deepEqual(runDaysInMonth("*/5 * * * *", 2026, 2), Array.from({ length: 28 }, (_, i) => i + 1));
assert.deepEqual(runDaysInMonth("0 0 1 1,7 *", 2026, 11), []);
assert.equal(runDaysInMonth("0 12 L * *", 2026, 11), null);
// invariant over every expression already in this file's describeCron cases:
// (nextRun(e, now) === null) === (describeCron(e) === CRON_FALLBACK)
```

Implement the invariant line as a loop over the describe cases the file already defines (refactor them into an array if needed). Do not change any existing expectation.

- [ ] **Step 3: Run both; expect failures** (`npx tsx lib/format.test.ts`, `npx tsx lib/cron.test.ts` → missing exports).
- [ ] **Step 4: Implement.**
  - Format helpers: use `Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", ... })` (Buddhist calendar by default) for the Thai strings, and `formatToParts` with `"en-US"` + `calendar: "gregory"` + Asia/Bangkok for `bkkParts`.
  - `nextRun`: when `describeCron` falls back, return `null`. Otherwise reuse the parsed fields and walk forward minute-by-minute only within matching days. Do it by checking day candidates (≤ 366×5 days) and, on a matching day, the matching hour/minute ≥ the start, all in Bangkok wall time converted with a fixed +7h offset.
  - `runDaysInMonth`: build on the same day-matching predicate.
- [ ] **Step 5: Run both self-checks + `npx tsc --noEmit`; expect PASS / no output.**
- [ ] **Step 6: Commit:** `git add lib/format.ts lib/format.test.ts lib/cron.ts lib/cron.test.ts && git commit -m "feat(lib): Bangkok BE date helpers, cron nextRun/runDaysInMonth"`

### Task 2: Plan math helper

**Files:**
- Create: `lib/plan.ts`, `lib/plan.test.ts`
- Modify: `components/charts/PlanProgress.tsx` (use `planTotals`; markup unchanged in this task)

**Interfaces:**
- Consumes: `bkkParts` from Task 1 (for month arithmetic in Bangkok).
- Produces (`lib/plan.ts`):
  - `type NextInstallment = { paymentMonth: number; dueDate: string /*ISO*/; amount: number; existingRecordId: string | null }`
  - `nextInstallment(plan: PaymentPlan): NextInstallment | null`: rules exactly as the spec's "Plan next installment" bullet. Month addition happens on the Bangkok calendar date, clamps the day to the target month's length, and keeps the Bangkok time of day.
  - `planTotals(plan: PaymentPlan): { paidCount: number; totalMonths: number; paidSum: number; totalSum: number; remainingSum: number; monthsLeft: number; pct: number }`: the same numbers `PlanProgress` computes today (move its math here verbatim; `pct` rounds as it does today).
  - `type Urgent = { job: JobDetail; plan: PaymentPlan; next: NextInstallment }`
  - `mostUrgent(details: JobDetail[]): Urgent | null`: across every plan of every job, the installment with the earliest `dueDate`. Overdue ones are therefore naturally first. Ties go to array order.

- [ ] **Step 1: Write `lib/plan.test.ts`** with a fixture builder `mkPlan({ total:"750000", monthly:"14828", months:48, start:"2025-01-05T05:00:00Z", paid: n })`. Its records are `paymentMonth` 1..n, `dueDate` = start + (k−1) months, all `isPaid: true`, `amount` = monthly. Assertions:

```ts
const car = mkPlan({ paid: 22 });
assert.deepEqual(nextInstallment(car), { paymentMonth: 23, dueDate: "2026-11-05T05:00:00.000Z", amount: 14828, existingRecordId: null });
assert.deepEqual(planTotals(car), { paidCount: 22, totalMonths: 48, paidSum: 326216, totalSum: 750000, remainingSum: 423784, monthsLeft: 26, pct: 46 });
assert.equal(nextInstallment(mkPlan({ paid: 48 })), null);
assert.deepEqual(nextInstallment(mkPlan({ paid: 0 })), { paymentMonth: 1, dueDate: "2025-01-05T05:00:00.000Z", amount: 14828, existingRecordId: null });
const jan31 = mkPlan({ start: "2026-01-31T05:00:00Z", paid: 1 });
assert.equal(nextInstallment(jan31)!.dueDate, "2026-02-28T05:00:00.000Z");
const withUnpaid = mkPlan({ paid: 22 }); withUnpaid.payments.push({ ...withUnpaid.payments[21], id: "u23", paymentMonth: 23, isPaid: false, dueDate: "2026-11-05T05:00:00Z", amount: "15000" });
assert.deepEqual(nextInstallment(withUnpaid), { paymentMonth: 23, dueDate: "2026-11-05T05:00:00.000Z", amount: 15000, existingRecordId: "u23" });
// mostUrgent picks the earliest due across jobs/plans
```

Add a `mostUrgent` case with two jobs (due 2026-11-05 and 2026-11-27) → the 11-05 one. Add another case with no plans → `null`.

- [ ] **Step 2: Run `npx tsx lib/plan.test.ts`; expect failure.**
- [ ] **Step 3: Implement `lib/plan.ts`; switch `PlanProgress` to `planTotals`.** Before editing, read `PlanProgress.tsx` to copy its exact totals logic. If its current `pct` or `totalSum` math differs from the fixture expectations above, keep the component's behaviour and fix the test values to match. Note the deviation in your report.
- [ ] **Step 4: Run self-check + `npx tsc --noEmit`; expect PASS.**
- [ ] **Step 5: Commit:** `git commit -m "feat(lib): plan nextInstallment/planTotals/mostUrgent"`

### Task 3: Visual foundation

**Files:**
- Modify: `tokens.css`, `app/globals.css`, `app/layout.tsx`, `app/manifest.ts`, `components/ui/styles.ts`, `components/ui/StatusChip.tsx`, `components/ui/CronSchedule.tsx` (restyle only), `components/ui/Skeleton.tsx`
- Create: `components/calendar/DateLeaf.tsx`

**Interfaces:**
- Consumes: `bkkParts`, `THAI_WEEKDAYS`, `fmtThaiMonthYear` (Task 1).
- Produces:
  - CSS tokens: keep the names `--color-paper`, `--color-paper-2` (card/leaf surface), `--color-paper-3` (hover/input), `--color-ink`, `--color-ink-2`, `--color-rule`, `--color-track`, `--color-focus`, `--color-danger`; add `--color-leaf-edge`, `--color-sunday`, `--day-0`…`--day-6`, `--day-ink-0`…`--day-ink-6` (text colour on each band). `--color-accent` is set to the ink value and `--color-accent-ink` to white, so existing usages read as "primary = ink".
  - Font CSS variables `--font-display` (Kanit), `--font-body` (Anuphan), `--font-mono` (JetBrains Mono) wired through `@theme inline`.
  - `btnPrimary`, `btnSecondary`, `backLink`, `dangerCallout` keep their names (restyled). Add `card` (surface + rule border + 12px radius) and `input` class strings.
  - `<DateLeaf date={Date | null} size="lg" | "sm" />`: `null` renders a neutral leaf (no band colour, "—"). `lg` = band with two punched holes + Thai weekday name + Kanit numeral ~76px + `fmtThaiMonthYear` line + stacked-sheet shadow. `sm` = 5px band strip + numeral, about 34×28px. Root carries `aria-label` like `"วันพฤหัสบดีที่ 5 พฤศจิกายน 2569"`, and the inner visuals are `aria-hidden`.
- [ ] **Step 1:** Rewrite `tokens.css` values per the spec palette. In `globals.css`, set `color-scheme: light` and remove dark-only rules. In `layout.tsx`: switch fonts to `Kanit` (500/600/700, thai+latin), `Anuphan` (400/500/600, thai+latin) and `JetBrains_Mono`; `lang="th"`; drop the `dark` class; `themeColor` = the paper colour as hex; Clerk `appearance.variables` light (`colorBackground` white, `colorText` ink hex, `colorPrimary` ink hex). In `manifest.ts`, set `background_color`/`theme_color` to the paper hex.
- [ ] **Step 2:** Implement `DateLeaf` and restyle `styles.ts`, `StatusChip` (Thai labels supplied by callers; dot uses ink/track, never weekday colours), `CronSchedule`, `Skeleton`.
- [ ] **Step 3:** Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Run `grep -rn "dark\b" app/layout.tsx app/globals.css` and expect no theme-class hits.
- [ ] **Step 4: Commit:** `git commit -m "feat(ui): light calendar tokens, Thai fonts, DateLeaf"`

### Task 4: Shell, sign-in, app-level loading/error

**Files:**
- Modify: `components/layout/AppShell.tsx`, `Sidebar.tsx`, `TopBar.tsx`, `MobileNav.tsx`, `app/loading.tsx`, `app/(app)/loading.tsx`, `app/(app)/error.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`

**Interfaces:**
- Consumes: Task 3 tokens/`DateLeaf`, `fmtThaiDate`/`THAI_WEEKDAY_INITIALS` (Task 1).
- Produces: nav items `[{href:"/dashboard",label:"หน้าหลัก"},{href:"/payments",label:"การชำระ"},{href:"/jobs/new",label:"เพิ่มงาน"}]` shared by Sidebar and MobileNav (one exported const in `components/layout/nav.ts`).
- [ ] **Step 1:** Mobile top bar: Kanit wordmark "Notifything", today's date as `พ. 29 ต.ค. 2569` (weekday initial + `fmtThaiDate`, rendered client-side to avoid a stale cached date), avatar menu with Thai items (name/email, "ออกจากระบบ"; remove "Settings"). Bottom tab bar has 3 items with ≥44px targets and `env(safe-area-inset-bottom)`. From md, show the left rail with the wordmark + the same 3 items and an ink active state (no weekday colour). Content max-width ~1100px. Page titles in Thai: `/dashboard` "หน้าหลัก", `/payments` "การชำระ", `/jobs/new` "เพิ่มงาน", `/jobs/*` "รายละเอียดงาน".
- [ ] **Step 2:** `error.tsx`: Thai heading "เกิดข้อผิดพลาด", the message, and a "ลองอีกครั้ง" button (`reset`). Loading files use the new skeleton look. Sign-in: light ground, wordmark, an `lg` `DateLeaf` of today above the Clerk form.
- [ ] **Step 3:** Verify tsc/lint/build pass.
- [ ] **Step 4: Commit:** `git commit -m "feat(ui): calendar shell, Thai nav, sign-in, error/loading"`

### Task 5: Job editing (PATCH proxy + editor) and job detail page

**Files:**
- Create: `lib/jobPatch.ts`, `lib/jobPatch.test.ts`, `app/api/jobs/[id]/route.ts`, `components/jobs/JobEditor.tsx`, `components/jobs/presets.ts`
- Modify: `app/(app)/jobs/[id]/page.tsx`, `app/(app)/jobs/[id]/loading.tsx`, `components/jobs/AddJobForm.tsx` (import presets from the new module only; no restyle here)

**Interfaces:**
- Consumes: `nextRun` (Task 1), `DateLeaf`, `CronSchedule`, `styles` (Task 3), `fmtThaiDateTime` (Task 1), `PlanCard` (existing; Task 6 restyles it).
- Produces:
  - `parseJobPatch(body: unknown): { ok: true; value: { name?: string; cron?: string; enabled?: boolean } } | { ok: false; error: string }`. `name` is trimmed, 1–100 chars. `cron` is trimmed and is either 5 whitespace-separated fields or one of `@hourly @daily @midnight @weekly @monthly @yearly @annually`. `enabled` is boolean. It rejects non-objects, unknown keys, wrong types and an empty object with a Thai `error`.
  - `CRON_PRESETS` moved to `components/jobs/presets.ts` (same values as `AddJobForm` today).
  - `PATCH /api/jobs/[id]` route: `parseJobPatch` → 400 `{ error }` on failure; else forward `PATCH ${NEXT_PUBLIC_API_URL}/jobs/${encodeURIComponent(id)}` with the validated JSON; `revalidateTag("jobs","max")` when ok; pass through status/body/content-type like `app/api/payments/route.ts`.
- [ ] **Step 1: Write `lib/jobPatch.test.ts`:**

```ts
assert.deepEqual(parseJobPatch({ name: "  ค่างวดรถ  " }), { ok: true, value: { name: "ค่างวดรถ" } });
assert.deepEqual(parseJobPatch({ cron: "0 12 5 * *", enabled: false }), { ok: true, value: { cron: "0 12 5 * *", enabled: false } });
assert.deepEqual(parseJobPatch({ cron: "@monthly" }), { ok: true, value: { cron: "@monthly" } });
for (const bad of [null, "x", [], {}, { name: "   " }, { name: "a".repeat(101) }, { cron: "0 12 5 *" }, { cron: "@often" }, { enabled: "true" }, { name: "x", id: "1" }])
  assert.equal(parseJobPatch(bad).ok, false, JSON.stringify(bad));
```

- [ ] **Step 2: Run; expect failure. Step 3: implement `lib/jobPatch.ts` + route; run; expect PASS.**
- [ ] **Step 4: `JobEditor` (client):** props `{ job: Job }`.
  - Read mode shows name (h1), status, `CronSchedule`, and a "แก้ไข" button.
  - Edit mode shows a name input, a cron input (mono) with preset chips (preset label = `describeCron(value)`) and a live `CronSchedule` preview, plus "บันทึก" / "ยกเลิก". Only changed fields are sent. Save is disabled while pending, when nothing changed, or when the name is blank. On success it calls `router.refresh()` and returns to read mode. On failure it keeps the inputs and shows `dangerCallout` "บันทึกไม่สำเร็จ: <message>".
  - The enabled switch (`<button role="switch" aria-checked>`, ≥44px, label "เปิดใช้งาน") saves immediately and optimistically, reverting with the error shown on failure.
- [ ] **Step 5: Job detail page:** back link "กลับ"; header = `lg` `DateLeaf` of `nextRun(job.cron, new Date())` + `JobEditor`. Facts dl in Thai (รหัสงาน mono, ทำงานล่าสุด, สร้างเมื่อ via `fmtThaiDateTime`). Push subscription section in Thai (การแจ้งเตือน: สถานะ เปิด/ปิด, รหัส, วันที่สมัคร, อัปเดตล่าสุด, endpoint). Payment plans section "แผนการชำระ" with existing `PlanCard`s. `loading.tsx` mirrors this.
- [ ] **Step 6: Verify:** self-check, tsc, lint, build. Then `npm run dev`, sign in is required, so instead POST the proxy unauthenticated with `curl -s -o /dev/null -w "%{http_code}" -X PATCH localhost:3000/api/jobs/x -d '{}'` and expect a Clerk-protected non-200 (401/404 redirect), proving the route is behind middleware.
- [ ] **Step 7: Commit:** `git commit -m "feat(jobs): edit name/cron/enabled via PATCH proxy; calendar job detail"`

### Task 6: Payments in the passbook world

**Files:**
- Modify: `components/payments/PlanCard.tsx`, `components/charts/PlanProgress.tsx`, `components/charts/BalanceChart.tsx`, `app/(app)/payments/components/PaymentsClient.tsx`, `app/(app)/payments/components/AddPaymentModal.tsx`, `app/(app)/payments/loading.tsx`

**Interfaces:**
- Consumes: `planTotals`, `nextInstallment`, `NextInstallment` (Task 2); `fmtPassbookDate`, `fmtThaiMonthYear` (Task 1); Task 3 styles.
- Produces:
  - `AddPaymentModal` gains an optional prop `next?: NextInstallment`. When it is given and `existingRecordId` is null, prefill งวด = `next.paymentMonth`, due date = `next.dueDate`, amount = `next.amount`. The existing `prefill` record path and the POST body are unchanged.
  - `PlanCard` props unchanged.
- [ ] **Step 1:** `PlanCard`:
  - Header: description (Kanit), monthly ฿ (mono), คงเหลือ ฿.
  - `PlanProgress` restyled in Thai: `ชำระแล้ว 22/48 งวด · 46%`, `คงเหลือ ฿423,784 จาก ฿750,000`, `อีก 26 งวด`, `จบ พฤศจิกายน 2572` (from `plan.endDate`).
  - `BalanceChart` keeps its burn-down semantics in the light palette: paid = ink, projected dashed ink-2, track colour as the token. Its sr-only table is kept.
  - **Passbook table:** columns วันที่ · รายการ · จ่าย · คงเหลือ; mono `fmtPassbookDate`; "งวด n"; dotted separators. The last row is the next installment in danger colour with "ครบกำหนด" and "—" balance (omitted when `nextInstallment` is null, in which case show "ชำระครบแล้ว").
  - Action row button "บันทึกการชำระ".
- [ ] **Step 2:** `PaymentsClient`: page h1 "การชำระ", Thai empty state ("ยังไม่มีแผนการชำระ"), per-job error cards in Thai; pass `next={nextInstallment(plan) ?? undefined}` to the modal. `AddPaymentModal`: Thai labels (งวดที่, วันครบกำหนด, จำนวนเงิน, ชำระแล้ว, วันที่ชำระ, เลขที่ใบเสร็จ, หมายเหตุ, บันทึก, ยกเลิก), light styling, same validation and payload.
- [ ] **Step 3:** Verify tsc/lint/build.
- [ ] **Step 4: Commit:** `git commit -m "feat(payments): passbook rows, Thai plan progress, prefilled next installment"`

### Task 7: Dashboard

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`, `app/(app)/dashboard/loading.tsx`, `components/dashboard/JobsTable.tsx` (becomes the "งานทั้งหมด" list)
- Create: `components/dashboard/NextDueHero.tsx`, `components/dashboard/MonthCalendar.tsx`, `components/dashboard/RecordPaymentButton.tsx` (client: opens `AddPaymentModal` with `next`)

**Interfaces:**
- Consumes: `mostUrgent`, `planTotals`, `nextInstallment` (Task 2); `nextRun`, `runDaysInMonth`, `describeCron` (Task 1); `daysUntil`, `relativeDayLabel`, `bkkParts`, `THAI_WEEKDAY_INITIALS` (Task 1); `DateLeaf`, `CronSchedule`, `StatusChip` (Task 3); `AddPaymentModal` + its `next` prop (Task 6).
- [ ] **Step 1: Data.**
  - Fetch the jobs and details exactly as today (`Promise.allSettled`).
  - `now = new Date()`. `urgent = mostUrgent(details)`.
  - Fallback hero: when there is no `urgent`, the earliest `nextRun` among enabled jobs.
  - `rows`: all jobs sorted by `nextRun` ascending; nulls last; disabled jobs after enabled.
  - Month: `bkkParts(now)` year/month; for each enabled job, `runDaysInMonth`; collect `{day → jobs[]}` and count the null ones.
- [ ] **Step 2: `NextDueHero`.**
  - Eyebrow `ครบกำหนดถัดไป · ${relativeDayLabel(daysUntil(due, now))}` (danger colour when negative).
  - `lg` leaf of the due date. Job name (Kanit), `งวดที่ n / total`, amount mono large, progress bar (ink on track), `คงเหลือ ฿x · จบ <fmtThaiMonthYear(endDate)>`, and `RecordPaymentButton` "บันทึกการชำระ".
  - Fallback variant: leaf + name + `CronSchedule` + link "ดูงาน". Neither: a quiet "ยังไม่มีกำหนดถัดไป".
- [ ] **Step 3: `MonthCalendar`.**
  - Heading = month name (e.g. "พฤศจิกายน 2569"), "N งาน" count (distinct jobs with ≥1 run day).
  - Sun-first 7-col grid with `THAI_WEEKDAY_INITIALS` header. Sunday numerals in `--color-sunday`.
  - Per day: up to 3 dots in `--day-<weekday>`, then "+". The hero's due day is outlined in ink, and today is marked (ink underline or filled circle; must differ from the outline).
  - Line "ไม่แสดง N งาน (รูปแบบกำหนดเอง)" when N>0.
  - Each day cell's `aria-label` lists the job names.
- [ ] **Step 4: Stat line + list.**
  - Stat line: compact three-up (`งานที่เปิดอยู่ a/b`, `ชำระแล้ว ฿x`, `คงเหลือรวม ฿y`).
  - "งานทั้งหมด" list: `sm` leaf of `nextRun` (neutral when null), name link to `/jobs/[id]`, `CronSchedule`, "ปิดอยู่" chip when disabled, `fmtThaiDateTime(nextRun)` on the right from md. Mobile renders rows; desktop renders the same rows or a table, never horizontal scroll.
  - Empty state "ยังไม่มีงาน" + "เพิ่มงาน" button. API error: `dangerCallout` "โหลดข้อมูลไม่สำเร็จ: <message>".
  - Layout ≥1024px: hero and month side by side, list below.
- [ ] **Step 5:** `loading.tsx` mirrors the hero leaf, month grid and rows.
- [ ] **Step 6:** Verify tsc/lint/build.
- [ ] **Step 7: Commit:** `git commit -m "feat(dashboard): next-due leaf, month calendar, Thai job list"`

### Task 8: Add-job form

**Files:**
- Modify: `components/jobs/AddJobForm.tsx`, `app/(app)/jobs/new/page.tsx`

**Interfaces:**
- Consumes: `CRON_PRESETS` (Task 5), `CronSchedule`, `describeCron`, Task 3 styles, `nextRun` + `DateLeaf` (`sm`) for a "รอบถัดไป" preview.
- [ ] **Step 1:** Restyle in the calendar world with Thai copy.
  - Copy: h1 "เพิ่มงาน", sub "สร้างการแจ้งเตือนตามกำหนดเวลา", labels "ชื่องาน", "กำหนดเวลา (cron)", preset chips labelled with `describeCron`, live `CronSchedule` preview + "รอบถัดไป" `sm` leaf + `fmtThaiDateTime`, buttons "ยกเลิก" / "เพิ่มงาน" ("กำลังเพิ่ม…" while pending), error `dangerCallout` "เพิ่มงานไม่สำเร็จ: <message>".
  - Behaviour, POST payload and redirect are unchanged.
- [ ] **Step 2:** Verify tsc/lint/build.
- [ ] **Step 3: Commit:** `git commit -m "feat(jobs): calendar add-job form with Thai copy"`

### Task 9: Cleanup, docs, full verification

**Files:**
- Modify: `lib/format.ts` (remove `fmtDate`/`formatDate` once unused), `design.md` (replace with the new world), `CLAUDE.md` (Design system + Payment plan visualization + Key Pages notes updated to the new world; mention `PATCH /api/jobs/[id]` and the self-check scripts)
- [ ] **Step 1:** `grep -rn "en-US\|fmtDate\|formatDate\|--font-inter\|Noto_Sans_Thai" app components lib` → no hits (except inside tests if intentional). Remove the dead helpers. Also search for leftover English UI copy with `grep -rn ">[A-Z][a-z]" app components`, translate it, and keep the "Notifything" wordmark.
- [ ] **Step 2:** Rewrite `design.md` to document the shipped world: tokens, weekday-colour rule, type roles, DateLeaf, passbook rows, shell, responsive floor. Update `CLAUDE.md`.
- [ ] **Step 3: Full check:** `npx tsx lib/cron.test.ts && npx tsx lib/format.test.ts && npx tsx lib/plan.test.ts && npx tsx lib/jobPatch.test.ts && npx tsc --noEmit && npm run lint && npm run build` all pass.
- [ ] **Step 4: Commit:** `git commit -m "docs: design.md + CLAUDE.md for calendar world; remove en-US formatters"`

(The visual inspection at 320/390/1440 and the finish review happen in the controller after Task 9, per the Impeccable finish step.)
