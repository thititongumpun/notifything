import { Skeleton } from "@/components/ui/Skeleton";

function PlanCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      {/* Plan header */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="mt-[var(--space-3xs)] h-3 w-40" />
      </div>
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-[var(--space-2xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] @min-[28rem]:grid-cols-4 sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-14" />
            <Skeleton className="mt-[var(--space-3xs)] h-4 w-20" />
          </div>
        ))}
      </div>
      {/* Progress */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
        <Skeleton className="mb-[var(--space-3xs)] h-3 w-40" />
        <Skeleton className="h-2 w-full rounded-[var(--radius-pill)]" />
      </div>
      {/* Rows */}
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-[var(--space-sm)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0 sm:px-[var(--space-sm)]">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaymentsLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      {Array.from({ length: 2 }).map((_, g) => (
        <div key={g} className="flex min-w-0 flex-col gap-[var(--space-xs)]">
          <Skeleton className="h-7 w-40" />
          <div className="grid grid-cols-1 gap-[var(--space-xs)] xl:[grid-template-columns:repeat(2,minmax(0,1fr))]">
            <PlanCardSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}
