/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JobDetail, PaymentPlan } from "@/lib/types";
import { PlanCard } from "@/components/payments/PlanCard";
import { AddPaymentModal } from "./AddPaymentModal";

/** One job from discovery: either its detail (may have 0 plans) or the fetch error. */
export interface JobEntry {
  id: string;
  name: string;
  detail: JobDetail | null;
  error: string | null;
}

type PaymentRecord = PaymentPlan["payments"][number];

const errorCardClass =
  "rounded-[var(--radius-input)] border px-[var(--space-2xs)] py-[var(--space-2xs)] text-[length:var(--text-xs)] leading-[var(--leading-body)]";

const errorCardStyle = {
  borderColor: "color-mix(in oklab, var(--color-danger) 30%, transparent)",
  backgroundColor: "color-mix(in oklab, var(--color-danger) 10%, transparent)",
  color: "var(--color-danger)",
} as const;

export function PaymentsClient({
  entries,
  listError,
}: {
  entries: JobEntry[];
  listError: string | null;
}) {
  const router = useRouter();
  const [active, setActive] = useState<{ plan: PaymentPlan; prefill?: PaymentRecord } | null>(null);

  function handleSuccess() {
    setActive(null);
    router.refresh();
  }

  const withPlans = entries.filter((e) => (e.detail?.paymentPlans.length ?? 0) > 0);
  const errored = entries.filter((e) => e.error);
  const isEmpty = !listError && withPlans.length === 0 && errored.length === 0;

  return (
    <>
      <div className="flex flex-col gap-[var(--space-md)]">
        {listError ? (
          <p className={errorCardClass} style={errorCardStyle}>
            Couldn&apos;t load jobs: {listError}
          </p>
        ) : null}

        {withPlans.map((entry) => (
          <div key={entry.id} className="flex min-w-0 flex-col gap-[var(--space-xs)]">
            <h2
              className="min-w-0 text-[length:var(--text-lg)] leading-[var(--leading-tight)] font-semibold text-[var(--color-ink)]"
              style={{ letterSpacing: "-0.02em", overflowWrap: "anywhere" }}
            >
              {entry.name}
            </h2>
            <div className="grid grid-cols-1 gap-[var(--space-xs)] xl:[grid-template-columns:repeat(2,minmax(0,1fr))]">
              {entry.detail?.paymentPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onAddPayment={() => setActive({ plan })}
                  onRecordPayment={(record) => setActive({ plan, prefill: record })}
                />
              ))}
            </div>
          </div>
        ))}

        {errored.map((entry) => (
          <p key={entry.id} className={errorCardClass} style={errorCardStyle}>
            Couldn&apos;t load payment plans for {entry.name}
            {entry.error ? ` — ${entry.error}` : ""}
          </p>
        ))}

        {isEmpty ? (
          <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-[var(--space-sm)] py-[var(--space-md)] text-center">
            <p className="text-[length:var(--text-sm)] leading-[var(--leading-body)] font-medium text-[var(--color-ink)]">
              No payment plans yet
            </p>
            <p className="mt-[var(--space-3xs)] text-[length:var(--text-xs)] leading-[var(--leading-body)] text-[var(--color-ink-2)]">
              Jobs are created from the jobs pages — add a payment plan there and it will show up here.
            </p>
          </div>
        ) : null}
      </div>

      {active ? (
        <AddPaymentModal
          plan={active.plan}
          prefill={active.prefill}
          onClose={() => setActive(null)}
          onSuccess={handleSuccess}
        />
      ) : null}
    </>
  );
}
