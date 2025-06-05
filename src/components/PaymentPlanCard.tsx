import {
  Bell,
  Calendar,
  Clock,
  CreditCard,
  MessageCircle,
  // Plus, // Not used here
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
import { Progress } from "@/components/ui/progress";
import { PaymentPlan } from "@/types/Cronjob"; // Assuming Payment type is also in Cronjob or a separate import
import cronstrue from "cronstrue";
import AddPaymentForm from "@/components/AddPaymentForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper Functions
const formatCurrency = (amount: string): string => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface PaymentPlanCardProps {
  plan: PaymentPlan;
  cronExpression: string;
  // jobId: string; // If needed for actions like "Edit Plan"
}

export default function PaymentPlanCard({ plan, cronExpression }: PaymentPlanCardProps) {
  // Calculate payment progress
  const paidCount = plan.payments.filter((payment) => payment.isPaid).length;
  const progressPercentage = plan.totalMonths > 0 ? (paidCount / plan.totalMonths) * 100 : 0;

  // Calculate total amount for the payments made so far
  const totalPaidAmount = plan.payments
    .filter(p => p.isPaid)
    .reduce((total, payment) => total + parseFloat(payment.amount), 0)
    .toString();

  // Total expected amount from all payments (could also be plan.totalAmount if it represents sum of all payment.amount)
  const sumOfAllPaymentAmounts = plan.payments
    .reduce((total, payment) => total + parseFloat(payment.amount), 0)
    .toString();


  return (
    <Card className="mb-6"> {/* Key removed from here, should be applied by parent */}
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
          {/* Could add a status badge for the plan itself if needed */}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-0 sm:pb-2">
              <CardDescription>Total Plan Amount</CardDescription>
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
              <Progress value={progressPercentage} className="mt-1" />
            </CardContent>
          </Card>
        </div>

        {/* Payment Details Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
              <span>Payment Schedule (from Job)</span>
            </div>
            <p className="text-sm sm:text-base break-words">
              {cronstrue.toString(cronExpression, {
                use24HourTimeFormat: true,
                verbose: true,
              })}
            </p>
          </div>
        </div>

        {/* Payments Table */}
        <Accordion type="single" collapsible className="w-full pt-2">
          <AccordionItem value="payments">
            <AccordionTrigger className="text-lg font-medium">
              Payment History ({plan.payments.length} payments recorded)
            </AccordionTrigger>
            <AccordionContent>
              {plan.payments.length > 0 ? (
                <>
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
                            Receipt/Notes
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
                                    {payment.receiptNumber || payment.notes || "-"}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                          <TableCell colSpan={2} className="font-bold text-right">
                            Total (All Payments)
                          </TableCell>
                          <TableCell className="font-bold">
                            <div className="flex items-center">
                              <span className="truncate">
                                {formatCurrency(sumOfAllPaymentAmounts)}
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
                        <Card key={payment.id + "-mobile"}>
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
                          <CardContent className="py-3 space-y-2 text-sm">
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
                            {(payment.receiptNumber || payment.notes) && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Ref/Notes:
                                </span>
                                <span className="text-right truncate">
                                  {payment.receiptNumber || payment.notes}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    <Card className="border-t-2 border-primary mt-4">
                      <CardHeader className="py-3">
                        <div className="font-medium">Total (All Payments)</div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <div className="flex justify-between items-center font-bold">
                          <span>Sum Total:</span>
                          <span>
                            {formatCurrency(sumOfAllPaymentAmounts)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No payments recorded for this plan yet.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Payment for: {plan.description}</DialogTitle>
            </DialogHeader>
            <AddPaymentForm
              paymentPlanId={plan.id}
              nextPaymentMonth={plan.payments.length + 1}
            />
          </DialogContent>
        </Dialog>
        <Button variant="outline" className="w-full sm:w-auto">
          Edit Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
