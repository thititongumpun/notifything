"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function TimePicker() {
  const [time, setTime] = React.useState<string>("12:00");

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? time : "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-[120px]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
