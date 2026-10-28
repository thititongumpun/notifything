/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import type { PaymentPlan } from "@/lib/types";
import { bkkParts, fmt } from "@/lib/format";

// Plot-only coordinate space; the SVG stretches to the box (preserveAspectRatio
// none) and all text is HTML, so labels stay >=12px at any width.
const INNER_W = 640;
const INNER_H = 140;
const pctX = (px: number) => `${((px / INNER_W) * 100).toFixed(2)}%`;
const pctY = (px: number) => `${((px / INNER_H) * 100).toFixed(2)}%`;

function fmtCompact(v: number) {
  if (v >= 1000) return `฿${Math.round(v / 1000)}K`;
  return `฿${Math.round(v)}`;
}

/** Remaining-balance burn-down over the life of the plan. The installment
 *  amount is fixed, so a per-month amount chart is a flat line and carries
 *  no information; the running balance drops every month and shows exactly
 *  where the payer stands. Solid ink = recorded installments, dashed
 *  ink-2 = projected to the final installment. Pure inline SVG, no chart
 *  library. Screen readers get the summary in aria-label. */
export function BalanceChart({ plan }: { plan: PaymentPlan }) {
  const { payments, totalAmount, monthlyAmount, totalMonths, startDate } = plan;
  if (totalMonths <= 0 || Number(totalAmount) <= 0) return null;

  const total = Number(totalAmount);
  const monthly = Number(monthlyAmount);
  const sorted = [...payments].sort((a, b) => a.paymentMonth - b.paymentMonth);
  const frontier = sorted.length > 0 ? sorted[sorted.length - 1].paymentMonth : 0;

  // Cumulative amount recorded through month m (0 for m <= 0), carrying the
  // last known total across months with no record.
  const monthAmount = new Map<number, number>();
  for (const p of sorted) {
    monthAmount.set(
      p.paymentMonth,
      (monthAmount.get(p.paymentMonth) ?? 0) + (Number(p.amount) || 0),
    );
  }
  const paidThrough: number[] = [0];
  for (let m = 1; m <= frontier; m++) {
    paidThrough[m] = paidThrough[m - 1] + (monthAmount.get(m) ?? 0);
  }
  const recordedTotal = paidThrough[frontier] ?? 0;

  const balanceAt = (m: number) => {
    const paid =
      m <= frontier ? paidThrough[m] : recordedTotal + (m - frontier) * monthly;
    return Math.max(total - paid, 0);
  };

  const x = (m: number) => (m / totalMonths) * INNER_W;
  const y = (v: number) => (1 - v / total) * INNER_H;

  const paidPts: string[] = [];
  for (let m = 0; m <= Math.min(frontier, totalMonths); m++) {
    paidPts.push(`${x(m).toFixed(1)},${y(balanceAt(m)).toFixed(1)}`);
  }
  const projPts: string[] = [];
  for (let m = frontier; m <= totalMonths; m++) {
    projPts.push(`${x(m).toFixed(1)},${y(balanceAt(m)).toFixed(1)}`);
  }

  // X ticks: January of each year covered by the schedule (Buddhist era),
  // thinned so long plans (e.g. 360 months) don't produce overlapping labels.
  const byMonth = new Map(sorted.map((p) => [p.paymentMonth, p]));
  const startP = bkkParts(new Date(startDate));
  const monthDate = (m: number) => {
    const rec = byMonth.get(m);
    if (rec?.dueDate) {
      const p = bkkParts(new Date(rec.dueDate));
      return { year: p.year, month: p.month - 1 };
    }
    const idx = startP.year * 12 + (startP.month - 1) + (m - 1);
    return { year: Math.floor(idx / 12), month: idx % 12 };
  };
  const janTicks: { x: number; label: string }[] = [];
  const seenYears = new Set<number>();
  for (let m = 1; m <= totalMonths; m++) {
    const d = monthDate(m);
    if (d.month === 0 && !seenYears.has(d.year)) {
      seenYears.add(d.year);
      janTicks.push({ x: x(m), label: String(d.year + 543) });
    }
  }
  const step = Math.max(1, Math.ceil(janTicks.length / 7));
  const ticks = janTicks.filter((_, i) => i % step === 0);

  const currentBalance = balanceAt(frontier);
  const gridValues = [total, total / 2, 0];
  const paidArea =
    paidPts.length > 1
      ? `M 0,${y(0)} L ${paidPts.join(" L ")} L ${x(Math.min(frontier, totalMonths)).toFixed(1)},${y(0)} Z`
      : null;

  return (
    <figure className="min-w-0">
      <div className="flex items-baseline justify-between gap-[var(--space-3xs)] min-w-0">
        <figcaption className="text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
          คงเหลือ
        </figcaption>
        <div className="flex shrink-0 items-center gap-[var(--space-2xs)] text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-3 rounded bg-[var(--color-ink)]"
              aria-hidden
            />
            ชำระแล้ว
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-3 border-t border-dashed border-[var(--color-ink-2)]"
              aria-hidden
            />
            ประมาณการ
          </span>
        </div>
      </div>
      <div className="mt-[var(--space-3xs)] grid grid-cols-[auto_minmax(0,1fr)]">
        {/* ponytail: fixed 7ch gutter fits up to "฿9999K"; widen if totals pass ฿10M */}
        <div className="relative h-[140px] w-[7ch] pr-2 font-mono tabular-nums text-[length:var(--text-xs)] text-[var(--color-ink-2)]" aria-hidden>
          {gridValues.map((v) => (
            <span
              key={v}
              className="absolute right-2 -translate-y-1/2 leading-none"
              style={{ top: pctY(y(v)) }}
            >
              {fmtCompact(v)}
            </span>
          ))}
        </div>
        <div
          className="relative h-[140px]"
          role="img"
          aria-label={`คงเหลือ ฿${fmt(currentBalance)} จาก ฿${fmt(total)} หลังงวดที่ ${frontier} จาก ${totalMonths}`}
        >
          <svg
            viewBox={`0 0 ${INNER_W} ${INNER_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
          >
            {gridValues.map((v) => (
              <line
                key={v}
                x1={0}
                x2={INNER_W}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--color-rule)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {projPts.length > 1 && (
              <polyline
                points={projPts.join(" ")}
                fill="none"
                stroke="var(--color-ink-2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {paidArea && (
              <path d={paidArea} fill="var(--color-track)" fillOpacity={0.7} />
            )}
            {paidPts.length > 1 && (
              <polyline
                points={paidPts.join(" ")}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          <span
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ink)] ring-2 ring-[var(--color-paper-2)]"
            style={{ left: pctX(x(frontier)), top: pctY(y(currentBalance)) }}
            title={`งวดที่ ${frontier} — คงเหลือ ฿${fmt(currentBalance)}`}
          />
        </div>
        <div className="relative col-start-2 mt-1 h-4 font-mono tabular-nums text-[length:var(--text-xs)] leading-none text-[var(--color-ink-2)]" aria-hidden>
          {ticks.map((t) => {
            const p = (t.x / INNER_W) * 100;
            return (
              <span
                key={t.label}
                className={`absolute top-0 ${p < 8 ? "translate-x-0" : p > 92 ? "-translate-x-full" : "-translate-x-1/2"}`}
                style={{ left: `${p.toFixed(2)}%` }}
              >
                {t.label}
              </span>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
