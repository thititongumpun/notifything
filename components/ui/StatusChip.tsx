export function StatusChip({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-rule)] px-2 py-1 text-[length:var(--text-xs)] font-medium leading-none text-[var(--color-ink-2)]">
      <span
        className={`w-1.5 h-1.5 rounded-full ${on ? "bg-[var(--color-accent)]" : "bg-[var(--color-track)]"}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
