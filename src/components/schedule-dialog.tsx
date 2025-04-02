"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScheduleNotificationForm } from "./schedule-notification-form";

interface CronJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDialog({ open, onOpenChange }: CronJobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
        </DialogHeader>
        <ScheduleNotificationForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
