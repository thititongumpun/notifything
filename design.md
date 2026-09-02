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
--color-ink-2:      oklch(78% 0.012 260);  /* secondary text */
--color-rule:       oklch(30% 0.015 260);  /* hairlines, borders */
--color-accent:     oklch(68% 0.17 275);   /* indigo — actions, active nav */
--color-accent-ink: oklch(15% 0.03 275);   /* text on accent fill */
--color-focus:      oklch(75% 0.15 275);
```
Accent placement: ≤ 5% of viewport — primary CTA, active nav marker, focus
rings, one data-highlight per stat card. Never accent body text.

## Typography
- Display: Inter, weight 600, roman (no italics on headings).
- Body: Inter, weight 400.
- Mono: JetBrains Mono, weight 400 — cron expressions, IDs, amounts.
- Fallback chain: `var(--font-inter), var(--font-noto-thai), system-ui` —
  Noto Sans Thai guarantees ฿ and Thai text render consistently; the mono
  chain carries the same Noto fallback for the same reason.
- Font utilities are registered via `@theme inline` in `app/globals.css`
  (Tailwind v4 has no tailwind.config).
- Display tracking: -0.02em. Page title = 1.25rem (app chrome, not landing hero).
- Scale: --text-xs 0.75 / --text-sm 0.875 / --text-md 1.125 / --text-lg 1.375.
- Line-height: body 1.6; table cells 1.5; headings 1.2.
- Table body text: minimum --text-sm (0.875rem). Never --text-xs for table
  cell content — xs is reserved for labels and eyebrows only.

Amended 2026-09-02.

## Data display (tables)
- Row padding: --space-2xs vertical / --space-xs horizontal minimum.
- Header: --text-xs, uppercase, `tracking-wide`, ink-2, bottom rule.
- Row hover: background --color-paper-3, transition --dur-short.
- Hairline dividers: 1px --color-rule between rows; `last:border-b-0`.
- Amounts, dates, and IDs: --font-mono with `font-variant-numeric: tabular-nums`.
- Status: dot-chip — accent dot for enabled/paid, rule dot for off.
- Mobile (<768px): collapse to stacked definition-list cards; never
  horizontal scroll.
- Never combine `font-display` and `font-mono` on the same element.

Amended 2026-08-26.

Amended 2026-09-02 (responsive tables in cards): tables and stat grids inside cards respond to the CARD's own width via Tailwind v4 container queries (`@container` root + `@min-[28rem]`/`@min-[30rem]` variants), not viewport breakpoints — PlanCard renders 2-up from md (234px cards at 768px) where a viewport-gated table would clip. Stacked cards render whenever the card is narrower than the table's min-content; amounts carry `overflow-wrap: anywhere` as the no-clip guard.

## Data visualization (charts)
- Colour semantics: accent = paid, --color-track = due/unpaid. No other hues
  in charts. --color-rule is a hairline stroke only — it must never FILL a
  chart area (it is near-invisible against card surfaces; that is the bug this
  amendment fixes).
- No gradients, no 3D, no glow — flat fills and hairline strokes only.
- Tick labels: --font-mono with `font-variant-numeric: tabular-nums`.
- Gridlines: 1px --color-rule hairlines, horizontal only.
- Height: 120–160px — charts are instruments, not heroes.
- Accessibility: every chart ships an sr-only data table carrying the same
  values (screen readers get the numbers, not the bars).
- Mobile (<768px): bars compress, labels thin out (drop non-essential ticks);
  never horizontal scroll.
- Implementation: div-bar rows (flex + token colours) preferred over chart
  libraries.
- Progress displays must answer "how far to 100%": percentage, paid-of-total
  months, remaining amount, and projected finish (last unpaid due date) —
  a bar alone doesn't say how long is left.

Amended 2026-09-02 (progress legibility: visible --color-track for unpaid,
progress charts must state months/amount remaining + finish).

Amended 2026-09-02 (tick thinning): bar-chart tick/value labels thin to at most 6 labelled columns by count (`tickStep = ceil(n/6)`); label-row gaps must match bar-row gaps (`gap-px` below sm) so ticks point at their bars.

## Card action rows
- Anchored by a 1px border-top rule in --color-rule.
- Per card: secondary actions plus a single primary verb.
- Touch targets ≥44px in both dimensions.

Amended 2026-09-02.

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
- Primary: accent fill, radius 10px, Inter 500, verb-first copy ("Add job").
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
- The wordmark (bell glyph + "Notifything", Inter 600).
- Accent colour and its placement discipline.
- Inter 400/600 + JetBrains Mono pairing (fallback chain per Typography).
- CTA voice (radius 10px, verb-first).
- Surface hierarchy: paper → paper-2 (cards) → paper-3 (hover/input).

Amended 2026-09-02.

## Exports

### tokens.css
See `tokens.css` at project root — imported by `app/globals.css`.
