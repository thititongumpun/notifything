import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-[var(--space-2xs)] lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-xs)]"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-[var(--space-3xs)] h-6 w-14" />
          </div>
        ))}
      </div>

      {/* Payment progress */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-5 w-36" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-2.5 w-full rounded-[var(--radius-pill)]" />
            <Skeleton className="h-36 w-full" />
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-24 rounded-[10px]" />
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-[var(--space-sm)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-24 rounded-[var(--radius-pill)]" />
              <Skeleton className="ml-auto h-4 w-28" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
