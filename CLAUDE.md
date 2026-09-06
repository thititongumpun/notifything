# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Notifything** is a Next.js 16 app for managing scheduled cron jobs, payment plans, and push notification subscriptions.

### Backend API

The base URL is configured via `NEXT_PUBLIC_API_URL` in `.env.local` (defaults to `https://notifything.tuidui.help`). Key endpoints used:
- `GET /jobs` — list all jobs
- `GET /jobs/:id` — job detail with payment plans and subscriptions
- `POST /jobs/addjob` — create a job
- `POST /payments` — record a payment

The API returns **200 with an empty body** for unknown job ids — treat an unparseable/missing body as not-found (see `app/(app)/jobs/[id]/page.tsx`).

### Data fetching & caching

- **Reads** go through `lib/api.ts` (`getJobs`, `getJobDetail`) with `next: { revalidate: 60, tags: ["jobs"] }` — pages are served from cache and revalidated in the background.
- **Writes** never call the backend directly from the browser. They POST to same-origin route handlers (`app/api/payments/route.ts`, `app/api/jobs/addjob/route.ts`) that forward to the backend and call `revalidateTag("jobs", "max")`, so `router.refresh()` immediately shows fresh data. Any new mutation endpoint should follow this proxy + revalidate pattern.

### App Structure

- `app/(app)/` route group holds the authenticated pages (`dashboard`, `jobs`, `payments`); its `layout.tsx` renders `AppShell` so the sidebar/topbar stay mounted across navigations
- Every route has a `loading.tsx` skeleton (instant paint while data streams in); `app/(app)/error.tsx` is the error fallback
- **Server components** handle data fetching (async functions in `app/**/page.tsx`)
- **Client components** (`"use client"`) handle interactivity (forms, modals, tables with pagination)
- Root `/` redirects to `/dashboard`; Clerk middleware in `proxy.ts` protects everything except `/sign-in`

### Key Pages

- `/dashboard` — stat strip, payment progress (per-plan charts), jobs table
- `/jobs/new` — add job form with cron presets
- `/jobs/[id]` — job detail: subscriptions + payment plans
- `/payments` — all jobs with payment plans, plan cards with running balance

### Payment plan visualization

The installment amount is fixed, so an "amount per month" chart is a flat line. `components/charts/BalanceChart.tsx` renders a remaining-balance burn-down instead (pure inline SVG, no chart library): solid accent line = recorded installments, dashed = projected to the final installment, marker at the current month. `components/charts/PlanProgress.tsx` is the continuous progress bar + "how long to 100%" numbers. `components/payments/PlanCard.tsx` shows a running "Balance After" column instead of the flat per-row amount, and computes Paid/Remaining from actual record amounts.

### Design system

- `tokens.css` (CSS custom properties) + `design.md` — all components use `var(--color-*)`, `var(--space-*)`, `var(--text-*)` tokens; match this style in new UI
- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js`); container queries (`@min-[44rem]`) for card-level breakpoints
- Dark-only palette (oklch), min 44px touch targets, `prefers-reduced-motion` respected
- Fonts: Inter + Noto Sans Thai + JetBrains Mono via `next/font`
- Currency formatting in `lib/format.ts` (Thai locale, `฿`)

### Auth

`hooks/useClerkAuth.ts` wraps Clerk's `useUser`. Sign-in at `/sign-in`; middleware in `proxy.ts`.

### Types

All shared TypeScript interfaces are in `lib/types.ts`: `Job`, `JobDetail`, `PaymentPlan`, `PaymentRecord`, `JobSubscription`.
