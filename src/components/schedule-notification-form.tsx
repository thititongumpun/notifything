"use client";

import type React from "react";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { create } from "@/actions/action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateCronExpression from "./generate-cron-expression";

type ScheduleNotificationFormProps = {
  onSuccess: () => void;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Schedule must be at least 2 characters.",
  }),
  cron: z.string().min(5, {
    message: "Cron expression must be at least 5 characters.",
  }),
});

export function ScheduleNotificationForm({
  onSuccess,
}: ScheduleNotificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cron: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await create(values);

        if (result.success) {
          toast.success("Schedule created", {
            description: `Schedule "${values.name}" has been created successfully.`,
          });
          onSuccess();
        } else {
          toast.error("Failed to create schedule", {
            description: result.error || "An unknown error occurred",
          });
        }
      } catch (error) {
        toast.error("Error", {
          description: "Failed to create schedule. Please try again.",
        });
        console.error(error);
      }
    });
  }

  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="generate">Generate Cron</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule name</FormLabel>
                  <FormControl>
                    <Input placeholder="Daily Backup" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your schedule job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cron"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cron expression</FormLabel>
                  <FormControl>
                    <Input placeholder="* * * * *" {...field} />
                  </FormControl>
                  <FormDescription>Cron expression value</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Schedule"}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="generate">
        <GenerateCronExpression />
      </TabsContent>
    </Tabs>
  );
}
