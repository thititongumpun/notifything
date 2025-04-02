"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ScheduleDialog } from "./schedule-dialog";

export default function CreateScheduleButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 hover:cursor-pointer"
        size={"sm"}
        variant="outline"
      >
        <PlusCircle className="h-4 w-4" />
        Create Schedule
      </Button>
      <ScheduleDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
