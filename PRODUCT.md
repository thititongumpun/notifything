# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
One owner (personal use). They track their own installment payments (e.g. ค่างวดรถ) and the scheduled push reminders attached to them, mostly from a phone with the app installed as a PWA.

## Product Purpose
Notifything schedules cron jobs that send push notifications, and attaches payment plans to them so the owner always knows what is due, what is paid, and how long until a plan reaches 100%. Success: a glance answers "what is due next, and how much is left".

## Positioning
A private reminder tool where each schedule is also a ledger: the reminder and the installment plan it nags about live on one record.

## Operating Context
- Opened on a phone, often right after a push reminder arrives, to record a payment or check the balance.
- Backend: Elysia API (`NEXT_PUBLIC_API_URL`, Swagger at `/swagger`). Jobs: list, detail, add, `PATCH /jobs/:id` (`name`, `cron`, `enabled`), `DELETE /jobs/:id`. Payments: list, add, `PATCH`/`DELETE /payments/:id`.
- Sign-in via Clerk; single account.

## Capabilities and Constraints
- Jobs: name + 5-field cron schedule, enabled flag, last run, push subscription.
- Every cron is shown with its Thai plain-language description (`lib/cron.ts` `describeCron`, honest fallback when not understood). This must stay wherever a cron appears.
- Payment plans: fixed monthly installment, total, months, start/end; records with due date, amount, paid flag, receipt number, notes.
- Amounts in Thai baht (฿, Thai locale formatting).
- Writes go through same-origin Next.js route handlers that revalidate the `jobs` cache tag.

## Brand Commitments
- Name: Notifything.
- UI copy is Thai-first; cron strings, IDs and amounts stay literal.

## Evidence on Hand
Real data comes only from the API. No testimonials, users, or metrics exist; none may be invented.

## Product Principles
1. Answer "what's due next and how much is left" before anything else.
2. Phone-first: one-handed, thumb-reachable primary actions, fast after a notification tap.
3. Never misstate money or schedules: an honest fallback beats a wrong description.
4. Fewer screens, more certainty: show the plan's state, don't make the owner compute it.

## Accessibility & Inclusion
Touch targets ≥44px, reduced motion respected, Thai text rendered with proper fonts and line height.
