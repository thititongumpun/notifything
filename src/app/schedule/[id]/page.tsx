import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackButton from "@/components/back-button";
import { Cronjob, PaymentPlan } from "@/types/Cronjob";
("@/app/types/Cronjob");
import cronstrue from "cronstrue";
import { Progress } from "@/components/ui/progress";
import SubscribeButton from "@/components/subscribe-button";

export default async function PaymentPlanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
  const job: Cronjob = await res.json();

  if (!job) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
        <BackButton className="mb-4 sm:mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
        </BackButton>
        <div className="flex items-center justify-center h-[50vh]">
          <p>Schedule not found</p>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: string): string => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // Helper function to render payment plan details
  const renderPaymentPlan = (plan: PaymentPlan) => {
    // Calculate payment progress
    const paidCount = plan.payments.filter((payment) => payment.isPaid).length;
    const progressPercentage = (paidCount / plan.totalMonths) * 100;

    // Calculate total amount for the payments
    const totalAmount = plan.payments
      .reduce((total, payment) => total + parseFloat(payment.amount), 0)
      .toString();

    return (
      <Card key={plan.id} className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl break-words">
                {plan.description}
              </CardTitle>
              <CardDescription className="mt-1">
                {formatCurrency(plan.monthlyAmount)} per month for{" "}
                {plan.totalMonths} months
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="pb-0 sm:pb-2">
                <CardDescription>Total Amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold truncate">
                  {formatCurrency(plan.totalAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-0 sm:pb-2">
                <CardDescription>Monthly Payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold truncate">
                  {formatCurrency(plan.monthlyAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-0 sm:pb-2">
                <CardDescription>Progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold">
                  {paidCount} / {plan.totalMonths} months
                </div>
                <Progress value={progressPercentage} />
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Payment Period</span>
              </div>
              <p className="text-sm sm:text-base break-words">
                {formatDate(plan.startDate)} to {formatDate(plan.endDate)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Bell className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Payment Schedule</span>
              </div>
              <p className="text-sm sm:text-base break-words">
                {cronstrue.toString(job.cron, {
                  use24HourTimeFormat: true,
                  verbose: true,
                })}
              </p>
            </div>
          </div>

          {/* Payments Table */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="payments">
              <AccordionTrigger className="text-lg font-medium">
                Payment History ({plan.payments.length} payments)
              </AccordionTrigger>
              <AccordionContent>
                <div className="rounded-md border overflow-x-auto mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Month</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Payment Date
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Notes
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...plan.payments]
                        .sort((a, b) => a.paymentMonth - b.paymentMonth)
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.paymentMonth}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground hidden sm:inline" />
                                <span className="truncate">
                                  {formatDate(payment.dueDate)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="truncate">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {payment.isPaid ? (
                                <Badge className="bg-green-500 whitespace-nowrap">
                                  Paid
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-red-500 border-red-500 whitespace-nowrap"
                                >
                                  Unpaid
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {payment.paidDate ? (
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-muted-foreground hidden lg:inline" />
                                  <span className="truncate">
                                    {formatDate(payment.paidDate)}
                                  </span>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center">
                                <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span className="truncate max-w-xs">
                                  {payment.notes || "-"}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableCell colSpan={2} className="font-bold">
                          Total
                        </TableCell>
                        <TableCell className="font-bold">
                          <div className="flex items-center">
                            <span className="truncate">
                              {formatCurrency(totalAmount)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell colSpan={3}></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>

                {/* For small screens - show this info in cards instead of a table */}
                <div className="sm:hidden space-y-4 mt-4">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Mobile Payment Details
                  </h4>
                  {[...plan.payments]
                    .sort((a, b) => a.paymentMonth - b.paymentMonth)
                    .map((payment) => (
                      <Card key={payment.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">
                              Month {payment.paymentMonth}
                            </div>
                            {payment.isPaid ? (
                              <Badge className="bg-green-500">Paid</Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-red-500 border-red-500"
                              >
                                Unpaid
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="py-0 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Due Date:
                            </span>
                            <span>{formatDate(payment.dueDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Amount:
                            </span>
                            <span>{formatCurrency(payment.amount)}</span>
                          </div>
                          {payment.paidDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Paid On:
                              </span>
                              <span>{formatDate(payment.paidDate)}</span>
                            </div>
                          )}
                          {payment.notes && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Notes:
                              </span>
                              <span className="text-right">
                                {payment.notes}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                  {/* Add total amount card for mobile view */}
                  <Card className="border-t-2 border-primary">
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Total Amount</div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Sum Total:
                        </span>
                        <span className="font-bold">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button className="w-full sm:w-auto">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Edit Plan
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
      <BackButton className="mb-4 sm:mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
      </BackButton>

      <div className="grid gap-4 sm:gap-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-xl sm:text-2xl break-words">
                  {job.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  Schedule Details
                </CardDescription>
              </div>
              <div className="flex-shrink-0">
                {job.enabled ? (
                  <Badge className="bg-green-500">Enabled</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Disabled
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notification Schedule</span>
                </div>
                <p className="text-lg font-medium break-words">{job.cron}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Human-readable Schedule</span>
                </div>
                <p className="text-lg font-medium break-words">
                  {cronstrue.toString(job.cron, {
                    use24HourTimeFormat: true,
                    verbose: true,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="mr-2">
              <Bell className="mr-2 h-4 w-4" />
              Test Notification
            </Button>
            <Button variant="outline">Edit Schedule</Button>
            <SubscribeButton jobId={job.id} subscriptions={job.subscriptions} />
          </CardFooter>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Payment Plans ({job.paymentPlans.length})
          </h2>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Plan
          </Button>
        </div>

        {job.paymentPlans.map(renderPaymentPlan)}
      </div>
    </div>
  );
}
