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
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
    </div>
  );
}
