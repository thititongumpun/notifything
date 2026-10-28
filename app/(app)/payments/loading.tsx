import { Skeleton } from "@/components/ui/Skeleton";

function PlanCardSkeleton() {
  return (
    <div className="@container overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      {/* Plan header */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)] sm:py-[var(--space-xs)]">
        <Skeleton className="h-5 w-56 max-w-full" />
        <Skeleton className="mt-[var(--space-2xs)] h-4 w-48 max-w-full" />
      </div>
      {/* Progress */}
      <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] sm:px-[var(--space-sm)]">
        <Skeleton className="mb-[var(--space-3xs)] h-3 w-40" />
        <Skeleton className="h-2 w-full rounded-[var(--radius-pill)]" />
      </div>
      {/* Passbook rows */}
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-[var(--space-2xs)] border-b border-dotted border-[var(--color-leaf-edge)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0 sm:px-[var(--space-sm)]">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
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
          <PlanCardSkeleton />
        </div>
      ))}
    </div>
  );
}
