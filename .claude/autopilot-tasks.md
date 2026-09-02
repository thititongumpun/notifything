# Autopilot: fix all app responsive (full audit, all viewports, all pages)
**Executing:** done — 6 tasks, 2 fix rounds, 5 findings all resolved. Not committed.

Root cause: commit 883e8f9 used `overflow-hidden` (clips) not `overflow-x-auto` (scrolls),
and fired container/breakpoints ~120px below the tables' min-content width.
Plus `viewportFit` missing from layout viewport export => all `env(safe-area-inset-*)` = 0.

- [x] 1. viewportFit:"cover" — enable safe-area insets   [haiku]  (simple)
- [x] 2. TopBar/AppShell consume top+bottom insets       [sonnet]
- [x] 3. JobsTable: md->lg + real scroll container       [haiku]  (simple)
- [x] 4. PlanCard: 30rem->44rem + overflow-x-auto        [haiku]  (simple)
- [x] 5. Payments grid: two-up at xl, not md             [haiku]  (simple)
- [x] 6. Overflow proof, 5 routes x 6 widths             [opus]   (complex)
- [x] 7. Review                                          [opus]

## Review round 1 — 3 findings (all pre-existing, none in tasks 1-5)
- [x] F1. sr-only on <table> doesn't collapse -> 798px page overflow (PlanProgress.tsx:95)
- [x] F2. same + MonthlyBars tick labels overflow at 240 bars (MonthlyBars.tsx:102,89)
- [x] F3. Dashboard "Paid to date" wraps mid-number at 320px (app/dashboard/page.tsx)

## Review round 2 — 2 findings, both fixed
- [x] F4. MonthlyBars tick labels clipped mid-glyph at every width (own round-1 overflow-hidden was wrong model)
- [x] F5. "Paid to date" over-stepped to text-xs (12px) across all phones; -> text-sm

Final: overflow proof 24/24 route x width, negative control passed, build exit 0.
Unverified: /sign-in (client-only Clerk render), safe-area insets (headless reports 0),
AddPaymentModal + pagination past page 1 (script-stripped harness), real API data (mock used).
