import { Skeleton } from "@/components/ui/Skeleton";

export default function AppLoading() {
  return (
    <div className="flex flex-col gap-[var(--space-md)]" role="status" aria-label="กำลังโหลด">
      <Skeleton className="h-7 w-48" />
      <div className="flex items-center gap-[var(--space-xs)] rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-sm)]">
        <Skeleton className="h-24 w-[88px] shrink-0 rounded-[var(--radius-leaf)]" />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-2xs)]">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-72 w-full rounded-[var(--radius-card)]" />
      <span className="sr-only">กำลังโหลด…</span>
    </div>
  );
}
