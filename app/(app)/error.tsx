"use client";

import { btnPrimary } from "@/components/ui/styles";

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
          เกิดข้อผิดพลาด
        </p>
        <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
          โหลดหน้านี้ไม่สำเร็จ
        </p>
      </div>
      <button
        onClick={reset}
        className={btnPrimary}
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}
