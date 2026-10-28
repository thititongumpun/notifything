export default function RootLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-[var(--space-2xs)] bg-[var(--color-paper)]"
      role="status"
      aria-label="กำลังโหลด"
    >
      <div className="font-display text-[length:var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
        Notifything
      </div>
      <span className="sr-only">กำลังโหลด…</span>
    </div>
  );
}
