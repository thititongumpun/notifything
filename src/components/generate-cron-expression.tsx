"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import cronstrue from "cronstrue";

// Type definitions
type ScheduleType = "daily" | "weekly" | "monthly" | "yearly";

interface DayOfWeek {
  value: number;
  Label: string;
}

interface Month {
  value: number;
  Label: string;
}

interface ScheduleTypeSelectorProps {
  value: ScheduleType;
  onChange: (value: ScheduleType) => void;
}

interface TimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DayOfWeekSelectorProps {
  value: number;
  onChange: (value: string) => void;
  days: DayOfWeek[];
}

interface DayOfMonthSelectorProps {
  value: number;
  onChange: (value: string) => void;
  days: number[];
}

interface MonthSelectorProps {
  value: number;
  onChange: (value: string) => void;
  months: Month[];
}

interface CronDisplayProps {
  expression: string;
}

// Memoized child components
const ScheduleTypeSelector = React.memo<ScheduleTypeSelectorProps>(
  ({ value, onChange }) => (
    <div className="mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Schedule Type
      </Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as ScheduleType)}
      >
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
          <SelectValue placeholder="Select a schedule type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Schedule Type</SelectLabel>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
);

const TimeInput = React.memo<TimeInputProps>(({ value, onChange }) => (
  <div className="mb-4">
    <Label className="block text-sm font-medium text-gray-700 mb-2">Time</Label>
    <Input
      type="time"
      className="w-full p-2 border border-gray-300 rounded-md"
      value={value}
      onChange={onChange}
    />
  </div>
));

const DayOfWeekSelector = React.memo<DayOfWeekSelectorProps>(
  ({ value, onChange, days }) => (
    <div className="mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Day of Week
      </Label>
      <Select value={value.toString()} onValueChange={onChange}>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
          <SelectValue placeholder="Select day of week" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Day of week</SelectLabel>
            {days.map((day) => (
              <SelectItem key={day.value} value={day.value.toString()}>
                {day.Label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
);

const DayOfMonthSelector = React.memo<DayOfMonthSelectorProps>(
  ({ value, onChange, days }) => (
    <div className="mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Day of Month
      </Label>
      <Select value={value.toString()} onValueChange={onChange}>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
          <SelectValue placeholder="Select day of month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Day of month</SelectLabel>
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
);

const MonthSelector = React.memo<MonthSelectorProps>(
  ({ value, onChange, months }) => (
    <div className="mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Month
      </Label>
      <Select value={value.toString()} onValueChange={onChange}>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Month</SelectLabel>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value.toString()}>
                {m.Label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
);

const CronDisplay = React.memo<CronDisplayProps>(({ expression }) => {
  const humanReadable = useMemo(() => {
    try {
      return cronstrue.toString(expression, {
        verbose: true,
        use24HourTimeFormat: true,
      });
    } catch (error) {
      return "Invalid cron expression";
    }
  }, [expression]);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-md space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Generated Cron Expression:
        </h3>
        <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
          {expression}
        </pre>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <span>Human readable description by</span>
          <span className="font-bold">cRonstrue</span>
        </h3>
        <div
          className="text-sm bg-gray-800 text-white p-3 rounded"
          aria-label="Human readable description of cron expression"
        >
          {humanReadable}
        </div>
      </div>
    </div>
  );
});
const GenerateCronExpression: React.FC = () => {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
  const [time, setTime] = useState<string>("12:00");
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);

  // Memoize event handlers
  const handleScheduleTypeChange = useCallback((value: ScheduleType) => {
    setScheduleType(value);
  }, []);

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(e.target.value);
    },
    []
  );

  const handleDayOfMonthChange = useCallback((value: string) => {
    setDayOfMonth(Number(value));
  }, []);

  const handleMonthChange = useCallback((value: string) => {
    setMonth(Number(value));
  }, []);

  const handleDayOfWeekChange = useCallback((value: string) => {
    setDayOfWeek(Number(value));
  }, []);

  // Memoize data arrays
  const daysOfMonth = useMemo<number[]>(
    () => Array.from({ length: 31 }, (_, i) => i + 1),
    []
  );

  const months = useMemo<Month[]>(
    () => [
      { value: 1, Label: "January" },
      { value: 2, Label: "February" },
      { value: 3, Label: "March" },
      { value: 4, Label: "April" },
      { value: 5, Label: "May" },
      { value: 6, Label: "June" },
      { value: 7, Label: "July" },
      { value: 8, Label: "August" },
      { value: 9, Label: "September" },
      { value: 10, Label: "October" },
      { value: 11, Label: "November" },
      { value: 12, Label: "December" },
    ],
    []
  );

  const daysOfWeek = useMemo<DayOfWeek[]>(
    () => [
      { value: 0, Label: "Sunday" },
      { value: 1, Label: "Monday" },
      { value: 2, Label: "Tuesday" },
      { value: 3, Label: "Wednesday" },
      { value: 4, Label: "Thursday" },
      { value: 5, Label: "Friday" },
      { value: 6, Label: "Saturday" },
    ],
    []
  );

  // Memoize cron expression calculation
  const cronExpression = useMemo<string>(() => {
    const [hours, minutes] = time.split(":").map(Number);
    let cron = "";

    switch (scheduleType) {
      case "daily":
        cron = `${minutes} ${hours} * * *`;
        break;
      case "weekly":
        cron = `${minutes} ${hours} * * ${dayOfWeek}`;
        break;
      case "monthly":
        cron = `${minutes} ${hours} ${dayOfMonth} * *`;
        break;
      case "yearly":
        cron = `${minutes} ${hours} ${dayOfMonth} ${month} *`;
        break;
      default:
        cron = "* * * * *";
    }

    return cron;
  }, [scheduleType, time, dayOfMonth, month, dayOfWeek]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <ScheduleTypeSelector
        value={scheduleType}
        onChange={handleScheduleTypeChange}
      />

      <TimeInput value={time} onChange={handleTimeChange} />

      {scheduleType === "weekly" && (
        <DayOfWeekSelector
          value={dayOfWeek}
          onChange={handleDayOfWeekChange}
          days={daysOfWeek}
        />
      )}

      {(scheduleType === "monthly" || scheduleType === "yearly") && (
        <DayOfMonthSelector
          value={dayOfMonth}
          onChange={handleDayOfMonthChange}
          days={daysOfMonth}
        />
      )}

      {scheduleType === "yearly" && (
        <MonthSelector
          value={month}
          onChange={handleMonthChange}
          months={months}
        />
      )}

      <CronDisplay expression={cronExpression} />
    </div>
  );
};

export default React.memo(GenerateCronExpression);
