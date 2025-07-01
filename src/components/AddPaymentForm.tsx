"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface AddPaymentFormProps {
  paymentPlanId: string;
  nextPaymentMonth: number;
}

const AddPaymentForm: React.FC<AddPaymentFormProps> = (props) => {
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [paidDate, setPaidDate] = useState<Date | undefined>(new Date());
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!dueDate) {
      console.error("Due date is required");
      // alert('Due date is required'); // Or use a toast notification
      setIsLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      console.error("Amount must be a positive number");
      // alert('Amount must be a positive number'); // Or use a toast notification
      setIsLoading(false);
      return;
    }

    const paymentData = {
      paymentPlanId: props.paymentPlanId,
      dueDate: dueDate.toISOString(),
      amount: parseFloat(amount),
      isPaid: isPaid,
      paidDate: isPaid && paidDate ? paidDate.toISOString() : null,
      paymentMonth: props.nextPaymentMonth,
      receiptNumber: isPaid && receiptNumber ? receiptNumber : null,
    };

    console.log(
      "Submitting Payment Data:",
      JSON.stringify(paymentData, null, 2)
    );

    try {
      const response = await fetch("/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            message: "An unknown error occurred while parsing error response",
          }));
        console.error("Failed to save payment:", response.status, errorData);
        // alert(`Error: ${errorData.message || response.statusText}`); // Or use a toast notification
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Payment saved:", result);
      // alert('Payment saved successfully!'); // Or use a toast notification

      // Optional: Reset form fields or close dialog here
      // setDueDate(undefined);
      // setAmount('');
      // setIsPaid(true);
      // setPaidDate(undefined);
      // setReceiptNumber('');
      // Consider calling a prop function to close dialog if applicable
    } catch (error: any) {
      console.error("Error submitting form:", error);
      // alert(`Submission error: ${error.message}`); // Or use a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="payment_plan_id" value={props.paymentPlanId} />

      <div className="space-y-1">
        <Label htmlFor="payment_month">Payment Month</Label>
        <Input
          id="payment_month"
          type="number"
          value={props.nextPaymentMonth}
          readOnly
          className="mt-1"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="due_date">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mt-1"
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="is_paid"
          checked={isPaid}
          onChange={(e) => setIsPaid(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <Label htmlFor="is_paid" className="font-normal">
          Is Paid?
        </Label>
      </div>

      {isPaid && (
        <div className="space-y-4">
          {" "}
          {/* Wrapped conditional fields in a div to maintain spacing flow */}
          <div className="space-y-1">
            <Label htmlFor="paid_date">Paid Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !paidDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paidDate ? (
                    format(paidDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={paidDate}
                  onSelect={setPaidDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <Label htmlFor="receipt_number">Receipt Number</Label>
            <Input
              id="receipt_number"
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Enter receipt number"
              className="mt-1"
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full mt-2">
        {isLoading ? "Saving..." : "Save Payment"}
      </Button>
    </form>
  );
};

export default AddPaymentForm;
