"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import type { JobDetail, PaymentPlan } from "@/lib/types";
import { PaymentPlanCard } from "@/components/jobs/PaymentPlanCard";
import { AddPaymentModal } from "./AddPaymentModal";

export function PaymentsClient({ jobs }: { jobs: JobDetail[] }) {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<PaymentPlan | null>(null);

  function handleSuccess() {
    setActivePlan(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {jobs.map((job) => (
          <div key={job.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{job.name}</h2>
              {job.paymentPlans.map((plan) => (
                <Button
                  key={plan.id}
                  size="sm"
                  className="gap-1.5"
                  onPress={() => setActivePlan(plan)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Payment
                </Button>
              ))}
            </div>
            {job.paymentPlans.map((plan) => (
              <PaymentPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ))}
      </div>

      {activePlan ? (
        <AddPaymentModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onSuccess={handleSuccess}
        />
      ) : null}
    </>
  );
}
