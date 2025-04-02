"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ExternalLink, MoreHorizontal, X } from "lucide-react";
import cronstrue from "cronstrue";
import { remove, update } from "@/actions/action";

export type Schedule = {
  id: string;
  name: string;
  cron: string;
  status: string;
  lastRunAt: Date;
  createdAt: Date;
  enabled: boolean;
};

type SchedulesTableProps = {
  schedules: Schedule[];
};

export function SchedulesTable({ schedules }: SchedulesTableProps) {
  const router = useRouter();

  const viewScheduleDetails = (id: string) => {
    router.push(`/schedule/${id}`);
  };

  const toggleScheduleStatus = (schedule: Schedule) => {
    update(schedule.id, schedule);
  };

  const deleteSchedule = (id: string) => {
    remove(id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Notification Frequency</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No schedules found.
              </TableCell>
            </TableRow>
          ) : (
            schedules.map((schedule) => (
              <TableRow
                key={schedule.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  <Link
                    href={`/schedule/${schedule.id}`}
                    className="flex items-center text-primary hover:underline"
                  >
                    {schedule.name}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {cronstrue.toString(schedule.cron, {
                      use24HourTimeFormat: true,
                    })}
                  </Badge>
                </TableCell>
                <TableCell>
                  {schedule.enabled ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Check className="mr-1 h-3 w-3" /> Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <X className="mr-1 h-3 w-3" /> Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => viewScheduleDetails(schedule.id)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleScheduleStatus(schedule)}
                      >
                        {schedule.enabled ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
