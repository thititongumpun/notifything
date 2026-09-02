# Autopilot: notifything whole-app redesign (hallmark, fonts + charts + consolidation)
**Executing:** done — all tasks complete, review clean

- [x] T1. Amend design.md: Inter+Noto Thai+JetBrains Mono, Data visualization + Card action rows specs  (complex)
- [x] T2. Font swap implementation: layout.tsx, tokens.css, globals.css @theme fix
- [x] T3. Shared helpers: lib/format.ts + lib/api.ts
- [x] T4. AddPaymentModal: prefill prop + 320px grid fixes
- [x] T5. Create components/payments/PlanCard.tsx (consolidated, card action footer)  (complex, retried once after agent stall)
- [x] T6. Dashboard redesign + charts  (complex) — agent stalled pre-report; pass conditions verified by orchestrator
- [x] T7. Payments page: dynamic discovery + per-job error resilience
- [x] T8. Jobs pages redesign; delete components/jobs/PaymentPlanCard.tsx
- [x] T9. Shell + sign-in polish (pageTitles, tokens, neutral-950 out)
- [x] T10. mark-paid: SKIPPED — backend DNS NXDOMAIN from this machine, PATCH unverifiable, no dead button shipped
- [x] T11. .hallmark/log.json + slop close-out
- [x] T12. Review — round 1: 4 findings (font scope no-op HIGH, cron corruption MED, a11y focus, chart gap), all fixed; round 2: clean, verified against built CSS + prerendered HTML

Outcome: build/lint/tsc all exit 0. Ready to commit.
