import type { PaymentRecord } from "@/lib/types";

const W = 640;
const H = 210;
const PAD = { top: 16, right: 14, bottom: 26, left: 48 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

const COLOR_PAID = "#818cf8"; // indigo-400
const COLOR_PROJ = "#525252"; // neutral-600

function fmtCompact(v: number) {
  if (v >= 1000) return `฿${Math.round(v / 1000)}K`;
  return `฿${Math.round(v)}`;
}

interface BalanceChartProps {
  payments: PaymentRecord[];
  totalAmount: number;
  monthlyAmount: number;
  totalMonths: number;
  startDate: string;
}

/**
 * Remaining-balance burn-down over the life of the plan.
 * A flat "amount per month" chart carries no information for a fixed
 * installment plan, so we chart the running balance instead: it drops
 * every month and shows exactly where the payer stands.
 */
export function BalanceChart({
  payments,
  totalAmount,
  monthlyAmount,
  totalMonths,
  startDate,
}: BalanceChartProps) {
  if (totalMonths <= 0 || totalAmount <= 0) return null;

  const sorted = [...payments].sort((a, b) => a.paymentMonth - b.paymentMonth);
  const frontier = sorted.length > 0 ? sorted[sorted.length - 1].paymentMonth : 0;

  // Cumulative amount actually recorded through month m (0 for m <= 0).
  const cumThrough = new Map<number, number>();
  let acc = 0;
  for (const p of sorted) {
    acc += Number(p.amount) || 0;
    cumThrough.set(p.paymentMonth, acc);
  }
  const recordedTotal = acc;

  const balanceAt = (m: number) => {
    let paid: number;
    if (m <= frontier) {
      paid = 0;
      for (const p of sorted) {
        if (p.paymentMonth <= m) paid += Number(p.amount) || 0;
      }
    } else {
      paid = recordedTotal + (m - frontier) * monthlyAmount;
    }
    return Math.max(totalAmount - paid, 0);
  };

  const x = (m: number) => PAD.left + (m / totalMonths) * INNER_W;
  const y = (v: number) => PAD.top + (1 - v / totalAmount) * INNER_H;

  const paidPts: string[] = [];
  for (let m = 0; m <= Math.min(frontier, totalMonths); m++) {
    paidPts.push(`${x(m).toFixed(1)},${y(balanceAt(m)).toFixed(1)}`);
  }
  const projPts: string[] = [];
  for (let m = frontier; m <= totalMonths; m++) {
    projPts.push(`${x(m).toFixed(1)},${y(balanceAt(m)).toFixed(1)}`);
  }

  // X ticks: January of each year covered by the schedule, thinned so
  // long plans (e.g. 360 months) don't produce overlapping labels.
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
  const gridValues = [totalAmount, totalAmount / 2, 0];
  const paidArea =
    paidPts.length > 1
      ? `M ${PAD.left},${y(0)} L ${paidPts.join(" L ")} L ${x(Math.min(frontier, totalMonths)).toFixed(1)},${y(0)} Z`
      : null;

  return (
    <div className="px-5 py-4 border-b border-neutral-800">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
          Remaining Balance
        </p>
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded bg-indigo-400" />
            Paid
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 border-t border-dashed border-neutral-500" />
            Projected
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Remaining balance: ฿${Math.round(currentBalance).toLocaleString("en-US")} of ฿${totalAmount.toLocaleString("en-US")} after month ${frontier} of ${totalMonths}`}
      >
        <defs>
          <linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLOR_PAID} stopOpacity="0.28" />
            <stop offset="100%" stopColor={COLOR_PAID} stopOpacity="0.02" />
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
              stroke="#262626"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 3.5}
              textAnchor="end"
              fontSize="10"
              fill="#737373"
            >
              {fmtCompact(v)}
            </text>
          </g>
        ))}

        {/* X ticks */}
        {ticks.map((t) => (
          <g key={t.label}>
            <line x1={t.x} x2={t.x} y1={y(0)} y2={y(0) + 4} stroke="#404040" strokeWidth="1" />
            <text x={t.x} y={H - 8} textAnchor="middle" fontSize="10" fill="#737373">
              {t.label}
            </text>
          </g>
        ))}

        {/* Projected path */}
        {projPts.length > 1 && (
          <polyline
            points={projPts.join(" ")}
            fill="none"
            stroke={COLOR_PROJ}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Paid path + area */}
        {paidArea && <path d={paidArea} fill="url(#balance-fill)" />}
        {paidPts.length > 1 && (
          <polyline points={paidPts.join(" ")} fill="none" stroke={COLOR_PAID} strokeWidth="2" />
        )}

        {/* Current position marker */}
        <circle cx={x(frontier)} cy={y(currentBalance)} r="7" fill={COLOR_PAID} opacity="0.2">
          <title>{`Month ${frontier} — ฿${Math.round(currentBalance).toLocaleString("en-US")} remaining`}</title>
        </circle>
        <circle cx={x(frontier)} cy={y(currentBalance)} r="3.5" fill={COLOR_PAID}>
          <title>{`Month ${frontier} — ฿${Math.round(currentBalance).toLocaleString("en-US")} remaining`}</title>
        </circle>
      </svg>
    </div>
  );
}
