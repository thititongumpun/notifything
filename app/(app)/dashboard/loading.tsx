import { Skeleton } from "@/components/ui/Skeleton";

const card = "rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      <div className="grid grid-cols-1 gap-[var(--space-md)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className={`${card} p-[var(--space-sm)]`}>
          <Skeleton className="h-4 w-40" />
          <div className="mt-[var(--space-xs)] flex gap-[var(--space-sm)]">
            <Skeleton className="h-[150px] w-[118px] shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
          <Skeleton className="mt-[var(--space-sm)] h-2.5 w-full rounded-[var(--radius-pill)]" />
          <Skeleton className="mt-[var(--space-sm)] h-11 w-40" />
        </div>
        <div className={`${card} p-[var(--space-sm)]`}>
          <Skeleton className="h-5 w-36" />
          <div className="mt-[var(--space-xs)] grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-11" />)}
          </div>
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <div className={`${card} overflow-hidden`}>
        <div className="border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)]">
          <Skeleton className="h-6 w-32" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-[var(--space-xs)] border-b border-[var(--color-rule)] px-[var(--space-xs)] py-[var(--space-2xs)] last:border-b-0">
            <Skeleton className="h-[27px] w-[34px] shrink-0" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
