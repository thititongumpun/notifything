export default function RootLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-[var(--space-2xs)] bg-[var(--color-paper)]"
      role="status"
      aria-label="Loading"
    >
      <div className="font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
        Notifything
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
