"use client";

import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { createPayment } from "@/actions/action";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";

interface AddPaymentFormProps {
  paymentPlanId: string;
  nextPaymentMonth: number;
}

const paymentFormSchema = z.object({
  paymentPlanId: z.string(),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1.",
  }),
  isPaid: z.boolean(),
  paidDate: z.date({
    required_error: "Paid date is required.",
  }),
  paymentMonth: z.number(),
  receiptNumber: z.string().optional(),
});

const AddPaymentForm: React.FC<AddPaymentFormProps> = ({
  paymentPlanId,
  nextPaymentMonth,
}: AddPaymentFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentPlanId: paymentPlanId,
      paymentMonth: nextPaymentMonth,
      dueDate: new Date(),
      amount: 0,
      isPaid: true,
      paidDate: new Date(),
      receiptNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    startTransition(async () => {
      console.log(values);
      try {
        const result = await createPayment(values);

        if (result.success) {
          toast.success("Payment created", {
            description: `Schedule "${values.paymentMonth}" has been created successfully.`,
          });
        } else {
          toast.error("Failed to create payment", {
            description: result.error || "An unknown error occurred",
          });
        }
      } catch (error) {
        toast.error("Error", {
          description: "Failed to create payment. Please try again.",
        });
        console.error(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* <input type="hidden" name="payment_plan_id" value={paymentPlanId} /> */}
        <FormField
          control={form.control}
          name="paymentMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Month</FormLabel>
              <FormControl>
                <Input placeholder="Payment Month" {...field} />
              </FormControl>
              <FormDescription>Payment Month</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} type="number" />
              </FormControl>
              <FormDescription>Enter amount</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Paid?</FormLabel>
              <FormControl>
                <Checkbox
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paidDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? (
            <>
              <Spinner /> Saving
            </>
          ) : (
            "Save Payment"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddPaymentForm;
