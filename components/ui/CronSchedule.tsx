import { describeCron } from "@/lib/cron";

export function CronSchedule({ cron, className }: { cron: string; className?: string }) {
  return (
    <span className={`min-w-0${className ? ` ${className}` : ""}`}>
      <code className="block font-mono tabular-nums text-[length:var(--text-sm)] text-[var(--color-ink)]">
        {cron.trim()}
      </code>
      <span
        lang="th"
        className="block font-body text-[length:var(--text-sm)] leading-[var(--leading-table)] text-[var(--color-ink-2)] [text-wrap:pretty] min-w-0 [overflow-wrap:anywhere]"
      >
        {describeCron(cron)}
      </span>
    </span>
  );
}
