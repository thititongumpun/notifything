# Design — Notifything

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal — utilitarian dark app for tracking scheduled jobs and payments.

## Macrostructure family
- App pages: **Workbench** — persistent side rail (desktop) + bottom tab bar
  (mobile), content column max-width 1200px, stat strip, dense tables/cards.
- Pages within the family vary only in component archetypes (stat cards vs
  form panels vs detail stacks). No marketing pages exist yet.

## Theme (custom, always-dark)
```css
--color-paper:      oklch(17% 0.012 260);  /* app background */
--color-paper-2:    oklch(21% 0.014 260);  /* raised surfaces: cards, rail */
--color-paper-3:    oklch(25% 0.015 260);  /* hover surfaces, inputs */
--color-ink:        oklch(96% 0.005 260);  /* primary text */
--color-ink-2:      oklch(70% 0.012 260);  /* secondary text */
--color-rule:       oklch(30% 0.015 260);  /* hairlines, borders */
--color-accent:     oklch(68% 0.17 275);   /* indigo — actions, active nav */
--color-accent-ink: oklch(15% 0.03 275);   /* text on accent fill */
--color-focus:      oklch(75% 0.15 275);
```
Accent placement: ≤ 5% of viewport — primary CTA, active nav marker, focus
rings, one data-highlight per stat card. Never accent body text.

## Typography
- Display: Geist, weight 600, roman (no italics on headings).
- Body: Geist, weight 400.
- Mono: Geist Mono, weight 400 — cron expressions, IDs, amounts.
- Display tracking: -0.02em. Page title = 1.25rem (app chrome, not landing hero).
- Scale: --text-xs 0.75 / --text-sm 0.875 / --text-md 1.125 / --text-lg 1.375.

## Spacing
4-point named scale in `tokens.css` (`--space-3xs` … `--space-3xl`).
Pages reference `var(--space-*)`, never raw values.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.
- Durations: `--dur-short: 180ms` for hovers/presses; nothing longer.
- Reveal pattern: none. App pages don't scroll-reveal.
- Reduced-motion: opacity-only, ≤150ms.

## Microinteractions stance
- Silent success — no celebratory toasts on save.
- Optimistic update + Undo where applicable; confirm dialogs only for delete.
- Hover: surface lift to --color-paper-3, 180ms. Active: translateY(1px).
- Focus: instant 2px --color-focus ring, never animated.

## CTA voice
- Primary: accent fill, radius 10px, Geist 500, verb-first copy ("Add job").
- Secondary: 1px rule border, paper-2 fill, ink text.
- Destructive: oklch(62% 0.19 25) red, outline style only.

## PWA / responsive floor (non-negotiable)
- Verified at 320 / 375 / 414 / 768 / 1024 / 1440.
- Mobile (<768px): bottom tab bar replaces the drawer; `env(safe-area-inset-bottom)`
  padding on the tab bar; top bar stays ≤56px; touch targets ≥44px.
- No horizontal scroll; `overflow-x: clip` on html and body.
- Grid tracks with cards/images use `minmax(0, 1fr)`.
- Display headers: `overflow-wrap: anywhere; min-width: 0`.
- Tables collapse to stacked cards on mobile (no horizontal scroll).
- Manifest theme_color/background_color match --color-paper.

## Per-page allowances
- App pages: no enrichment — function carries the page. Tier-A at most: a
  hairline-keyed stat strip or a thin progress bar in payment cards.

## What pages MUST share
- The wordmark (bell glyph + "Notifything", Geist 600).
- Accent colour and its placement discipline.
- Geist / Geist Mono pairing.
- CTA voice (radius 10px, verb-first).
- Surface hierarchy: paper → paper-2 (cards) → paper-3 (hover/input).

## Exports

### tokens.css
See `tokens.css` at project root — imported by `app/globals.css`.
