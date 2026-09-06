"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-[var(--space-xs)] text-center">
      <div>
        <p className="text-[length:var(--text-sm)] font-medium leading-[var(--leading-body)] text-[var(--color-danger)]">
          Something went wrong
        </p>
        <p className="mt-[var(--space-3xs)] text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
          {error.message || "Failed to load data."}
        </p>
      </div>
      <button
        onClick={reset}
        className="min-h-[44px] rounded-[10px] bg-[var(--color-accent)] px-[var(--space-sm)] text-[length:var(--text-sm)] font-medium leading-none text-[var(--color-accent-ink)] transition-[transform,background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:brightness-110 active:translate-y-px"
      >
        Try Again
      </button>
    </div>
  );
}
