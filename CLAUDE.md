# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

Cron description self-check: `npx tsx lib/cron.test.ts` (exits non-zero on mismatch).

## Architecture

**Notifything** is a Next.js 16 app for managing scheduled cron jobs, payment plans, and push notification subscriptions.

### Backend API

The base URL is configured via `NEXT_PUBLIC_API_URL` in `.env.local` (defaults to `https://notifything.tuidui.help`). Key endpoints used:
- `GET /jobs` — list all jobs
- `GET /jobs/:id` — job detail with payment plans and subscriptions
- `POST /jobs/addjob` — create a job
- `POST /payments` — record a payment
- `PATCH /jobs/:id` — edit name/cron/enabled

The API returns **200 with an empty body** for unknown job ids — treat an unparseable/missing body as not-found (see `app/(app)/jobs/[id]/page.tsx`).

### Data fetching & caching

- **Reads** go through `lib/api.ts` (`getJobs`, `getJobDetail`) with `next: { revalidate: 60, tags: ["jobs"] }` — pages are served from cache and revalidated in the background.
- **Writes** never call the backend directly from the browser. They POST to same-origin route handlers (`app/api/payments/route.ts`, `app/api/jobs/addjob/route.ts`, `app/api/jobs/[id]/route.ts` for `PATCH`, validated by `lib/jobPatch.ts`) that forward to the backend and call `revalidateTag("jobs", "max")`, so `router.refresh()` immediately shows fresh data. Any new mutation endpoint should follow this proxy + revalidate pattern.

### App Structure

- `app/(app)/` route group holds the authenticated pages (`dashboard`, `jobs`, `payments`); its `layout.tsx` renders `AppShell` so the sidebar/topbar stay mounted across navigations
- Every route has a `loading.tsx` skeleton (instant paint while data streams in); `app/(app)/error.tsx` is the error fallback
- **Server components** handle data fetching (async functions in `app/**/page.tsx`)
- **Client components** (`"use client"`) handle interactivity (forms, modals, tables with pagination)
- Root `/` redirects to `/dashboard`; Clerk middleware in `proxy.ts` protects everything except `/sign-in`

### Key Pages

- `/dashboard` — next-due hero (`NextDueHero`), month calendar (`MonthCalendar`), Thai jobs list with date leaves
- `/jobs/new` — calendar-style add job form with cron presets
- `/jobs/[id]` — job detail: `JobEditor` (name/cron/enabled), subscriptions, payment plans
- `/payments` — all jobs with payment plans, passbook-row plan cards

### Payment plan visualization

`components/payments/PlanCard.tsx` renders passbook rows (date, item, amount, running "Balance After") and computes Paid/Remaining from actual record amounts. `components/charts/PlanProgress.tsx` is the continuous progress bar with Thai "how long to 100%" numbers; `components/charts/BalanceChart.tsx` is a remaining-balance burn-down in pure inline SVG (solid = recorded, dashed = projected, marker at the current month). `lib/plan.ts` holds the next-installment/totals logic.

### Design system

- `tokens.css` (CSS custom properties) + `design.md` — all components use `var(--color-*)`, `var(--space-*)`, `var(--text-*)` tokens; match this style in new UI
- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js`); container queries (`@min-[44rem]`) for card-level breakpoints
- Light-only palette (oklch, ink accent). Weekday colours `--day-0…6` appear only on date marks (`DateLeaf`, calendar dots)
- Thai-first UI copy; min 44px touch targets, `prefers-reduced-motion` respected
- Fonts: Kanit (display) + Anuphan (UI) + JetBrains Mono (cron/IDs/amounts) via `next/font`
- Dates/currency in `lib/format.ts` (Asia/Bangkok, Buddhist-era years, `฿`); cron text via `lib/cron.ts` / `CronSchedule`

### Self-checks

No test runner; `lib/*.test.ts` are assert scripts run with `npx tsx lib/<name>.test.ts` (`cron`, `format`, `plan`, `jobPatch`).

### Auth

`hooks/useClerkAuth.ts` wraps Clerk's `useUser`. Sign-in at `/sign-in`; middleware in `proxy.ts`.

### Types

All shared TypeScript interfaces are in `lib/types.ts`: `Job`, `JobDetail`, `PaymentPlan`, `PaymentRecord`, `JobSubscription`.
