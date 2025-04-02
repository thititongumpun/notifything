export type Cronjob = {
  id: string;
  name: string;
  cron: string;
  enabled: boolean;
  lastRunAt: Date | null;
  createdAt: Date;
  paymentPlans: PaymentPlan[];
}

export type PaymentPlan = {
  id: string;
  cronJobId: string;
  description: string;
  totalAmount: string;
  monthlyAmount: string;
  totalMonths: number;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
  payments: Payment[];
}

export type Payment = {
  id: string;
  paymentPlanId: string;
  dueDate: string;
  amount: string;
  isPaid: boolean;
  paidDate: string;
  paymentMonth: number;
  notes: string;
  receiptNumber: null;
  createdAt: Date;
  updatedAt: Date;
}