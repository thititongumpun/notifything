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

The base URL is configured via `NEXT_PUBLIC_API_URL` in `.env.local` (defaults to `https://notifything.thitit.beer`). There is no local API layer — pages and components call `fetch()` directly using `process.env.NEXT_PUBLIC_API_URL`. Key endpoints used:
- `GET /jobs` — list all jobs
- `GET /jobs/:id` — job detail with payment plans and subscriptions
- `POST /jobs/addjob` — create a job

### App Structure

- **Server components** handle data fetching (async functions in `app/**/page.tsx`)
- **Client components** (`"use client"`) handle interactivity (forms, modals, tables with pagination)
- `AppShell` wraps every page with sidebar + topbar layout
- Root `/` redirects to `/dashboard`

### Key Pages
- `/dashboard` — job stats and job table
- `/jobs/new` — add job form with cron presets
- `/jobs/[id]` — job detail: subscriptions + payment plans
- `/payments` — payment view for 2 hardcoded job IDs (car payment, house payment)

### Styling

- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js`)
- HeroUI v3 beta (`@heroui/react`, `@heroui/styles`) — import `@heroui/styles` in `globals.css`
- Always dark mode (`<html className="dark">` in layout)
- Currency formatting uses Thai locale (`th-TH`, `฿`)

### Auth

`hooks/useClerkAuth.ts` is a stub returning a hardcoded mock user. No real auth is wired up.

### Types

All shared TypeScript interfaces are in `lib/types.ts`: `Job`, `JobDetail`, `PaymentPlan`, `PaymentRecord`, `JobSubscription`.
