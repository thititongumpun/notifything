export interface Job {
  id: string;
  name: string;
  cron: string;
  enabled: boolean;
  lastRunAt: string | null;
  createdAt: string;
}

export interface JobSubscription {
  id: string;
  jobId: string;
  userId: string;
  subscription: string; // JSON string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  paymentPlanId: string;
  dueDate: string;
  amount: string;
  isPaid: boolean;
  paidDate: string | null;
  paymentMonth: number;
  notes: string;
  receiptNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPlan {
  id: string;
  cronJobId: string;
  description: string;
  totalAmount: string;
  monthlyAmount: string;
  totalMonths: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  payments: PaymentRecord[];
}

export interface JobDetail extends Job {
  paymentPlans: PaymentPlan[];
  subscriptions: JobSubscription | null;
}
