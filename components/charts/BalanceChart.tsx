/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
import type { PaymentPlan } from "@/lib/types";
import { fmt } from "@/lib/format";

const W = 640;
const H = 200;
const PAD = { top: 14, right: 10, bottom: 24, left: 46 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

function fmtCompact(v: number) {
  if (v >= 1000) return `฿${Math.round(v / 1000)}K`;
  return `฿${Math.round(v)}`;
}

/** Remaining-balance burn-down over the life of the plan. The installment
 *  amount is fixed, so a per-month amount chart is a flat line and carries
 *  no information; the running balance drops every month and shows exactly
 *  where the payer stands. Solid accent = recorded installments, dashed
 *  track = projected to the final installment. Pure inline SVG, no chart
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

  const x = (m: number) => PAD.left + (m / totalMonths) * INNER_W;
  const y = (v: number) => PAD.top + (1 - v / total) * INNER_H;

  const paidPts: string[] = [];
  for (let m = 0; m <= Math.min(frontier, totalMonths); m++) {
    paidPts.push(`${x(m).toFixed(1)},${y(balanceAt(m)).toFixed(1)}`);
  }
  const projPts: string[] = [];
  for (let m = frontier; m <= totalMonths; m++) {
    projPts.push(`${x(m).toFixed(1)},${y(balanceAt(m)).toFixed(1)}`);
  }

  // X ticks: January of each year covered by the schedule, thinned so long
  // plans (e.g. 360 months) don't produce overlapping labels.
  const byMonth = new Map(sorted.map((p) => [p.paymentMonth, p]));
  const monthDate = (m: number) => {
    const rec = byMonth.get(m);
    if (rec?.dueDate) return new Date(rec.dueDate);
    const start = new Date(startDate);
    return new Date(start.getFullYear(), start.getMonth() + (m - 1), 1);
  };
  const janTicks: { x: number; label: string }[] = [];
  const seenYears = new Set<number>();
  for (let m = 1; m <= totalMonths; m++) {
    const d = monthDate(m);
    if (d.getMonth() === 0 && !seenYears.has(d.getFullYear())) {
      seenYears.add(d.getFullYear());
      janTicks.push({ x: x(m), label: String(d.getFullYear()) });
    }
  }
  const step = Math.max(1, Math.ceil(janTicks.length / 7));
  const ticks = janTicks.filter((_, i) => i % step === 0);

  const currentBalance = balanceAt(frontier);
  const gridValues = [total, total / 2, 0];
  const paidArea =
    paidPts.length > 1
      ? `M ${PAD.left},${y(0)} L ${paidPts.join(" L ")} L ${x(Math.min(frontier, totalMonths)).toFixed(1)},${y(0)} Z`
      : null;

  return (
    <figure className="min-w-0">
      <div className="flex items-baseline justify-between gap-[var(--space-3xs)] min-w-0">
        <figcaption className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-ink-2)]">
          Remaining balance
        </figcaption>
        <div className="flex shrink-0 items-center gap-[var(--space-2xs)] font-mono text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-3 rounded bg-[var(--color-accent)]"
              aria-hidden
            />
            Paid
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-3 border-t border-dashed border-[var(--color-ink-2)]"
              aria-hidden
            />
            Projected
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-[var(--space-3xs)] w-full"
        role="img"
        aria-label={`Remaining balance: ฿${fmt(currentBalance)} of ฿${fmt(total)} after month ${frontier} of ${totalMonths}`}
      >
        <defs>
          <linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Gridlines + Y labels */}
        {gridValues.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-rule)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 3.5}
              textAnchor="end"
              fontSize="10"
              fill="var(--color-ink-2)"
            >
              {fmtCompact(v)}
            </text>
          </g>
        ))}

        {/* X ticks */}
        {ticks.map((t) => (
          <g key={t.label}>
            <line
              x1={t.x}
              x2={t.x}
              y1={y(0)}
              y2={y(0) + 4}
              stroke="var(--color-track)"
              strokeWidth="1"
            />
            <text
              x={t.x}
              y={H - 7}
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-ink-2)"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Projected path */}
        {projPts.length > 1 && (
          <polyline
            points={projPts.join(" ")}
            fill="none"
            stroke="var(--color-track)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Paid path + area */}
        {paidArea && <path d={paidArea} fill="url(#balance-fill)" />}
        {paidPts.length > 1 && (
          <polyline
            points={paidPts.join(" ")}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
        )}

        {/* Current position marker */}
        <circle cx={x(frontier)} cy={y(currentBalance)} r="7" fill="var(--color-accent)" opacity="0.2">
          <title>{`Month ${frontier} — ฿${fmt(currentBalance)} remaining`}</title>
        </circle>
        <circle cx={x(frontier)} cy={y(currentBalance)} r="3.5" fill="var(--color-accent)">
          <title>{`Month ${frontier} — ฿${fmt(currentBalance)} remaining`}</title>
        </circle>
      </svg>
    </figure>
  );
}
