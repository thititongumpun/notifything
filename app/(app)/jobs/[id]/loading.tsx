import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-sm)] max-w-3xl mx-auto w-full">
      {/* Back link */}
      <Skeleton className="h-5 w-36" />

      {/* Job info */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-20 rounded-[var(--radius-pill)]" />
        </div>
        <div className="grid grid-cols-1 gap-[var(--space-2xs)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:grid-cols-2 sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-[var(--space-3xs)] h-4 w-36" />
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="grid grid-cols-1 gap-[var(--space-2xs)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:grid-cols-2 sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-[var(--space-3xs)] h-4 w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Payment plans */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="mt-[var(--space-3xs)] h-3 w-40" />
        </div>
        <div className="px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="mt-[var(--space-3xs)] h-2 w-full rounded-[var(--radius-pill)]" />
          <Skeleton className="mt-[var(--space-2xs)] h-36 w-full" />
        </div>
      </div>
    </div>
  );
}
