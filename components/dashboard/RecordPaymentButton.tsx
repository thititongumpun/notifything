"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddPaymentModal } from "@/app/(app)/payments/components/AddPaymentModal";
import { btnPrimary } from "@/components/ui/styles";
import type { PaymentPlan } from "@/lib/types";
import type { NextInstallment } from "@/lib/plan";

export function RecordPaymentButton({ plan, next }: { plan: PaymentPlan; next: NextInstallment }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const prefill = next.existingRecordId ? plan.payments.find((p) => p.id === next.existingRecordId) : undefined;

  return (
    <>
      <button type="button" className={btnPrimary} onClick={() => setOpen(true)}>
        บันทึกการชำระ
      </button>
      {open ? (
        <AddPaymentModal
          plan={plan}
          prefill={prefill}
          next={prefill ? undefined : next}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      ) : null}
    </>
  );
}
