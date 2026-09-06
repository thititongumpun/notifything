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

The base URL is configured via `NEXT_PUBLIC_API_URL` in `.env.local` (defaults to `https://notifything.tuidui.help`). There is no local API layer — pages and components call `fetch()` directly. Key endpoints used:
- `GET /jobs` — list all jobs
- `GET /jobs/:id` — job detail with payment plans and subscriptions
- `POST /jobs/addjob` — create a job
- `POST /payments` — record a payment

### Data fetching & caching

- **Reads**: server components fetch GETs with `next: { revalidate: 60, tags: ["jobs"] }` — pages are served from cache and revalidated in the background.
- **Writes**: the browser never calls the backend directly for mutations. It POSTs to same-origin route handlers (`app/api/payments/route.ts`, `app/api/jobs/addjob/route.ts`) that forward to the backend and call `revalidateTag("jobs")`, so `router.refresh()` immediately shows fresh data. Any new mutation endpoint should follow this proxy + revalidate pattern.

### App Structure

- `app/(app)/` route group holds the authenticated pages (`dashboard`, `jobs`, `payments`); its `layout.tsx` renders `AppShell` so the sidebar/topbar stay mounted across navigations
- **Server components** handle data fetching (async functions in `app/**/page.tsx`)
- **Client components** (`"use client"`) handle interactivity (forms, modals, tables with pagination)
- Every route has a `loading.tsx` skeleton (instant paint while data streams in); `app/(app)/error.tsx` is the error fallback
- Root `/` redirects to `/dashboard`

### Key Pages

- `/dashboard` — job stats and job table
- `/jobs/new` — add job form with cron presets
- `/jobs/[id]` — job detail: subscriptions + payment plans
- `/payments` — payment view for 2 hardcoded job IDs (car payment, house payment)

### Payment plan visualization

The installment amount is fixed, so an "amount per month" chart is a flat line. `components/jobs/BalanceChart.tsx` instead renders a remaining-balance burn-down (pure inline SVG, no chart library): solid line = recorded payments, dashed = projected to the final installment. `PaymentPlanCard`'s table shows a running "Balance After" column instead of the flat per-row amount.

### Styling

- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js`)
- HeroUI v3 beta (`@heroui/react`, `@heroui/styles`) — import `@heroui/styles` in `globals.css`
- Always dark mode (`<html className="dark">` in layout)
- Currency formatting uses Thai locale (`th-TH`, `฿`)

### Auth

`hooks/useClerkAuth.ts` is a stub returning a hardcoded mock user. No real auth is wired up.

### Types

All shared TypeScript interfaces are in `lib/types.ts`: `Job`, `JobDetail`, `PaymentPlan`, `PaymentRecord`, `JobSubscription`.
