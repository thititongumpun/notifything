import CreateScheduleButton from "@/components/create-schedule-button";
import { SchedulesTable } from "@/components/schedule-table";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@clerk/nextjs/server";

async function fetchSchedules() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
  const data = await res.json();
  return data;
}

export default async function Home() {
  const schedules = await fetchSchedules();
  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Schedule & Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Manage your schedules and notification preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              <span>{schedules.length} Notifications</span>
            </Badge>
            <CreateScheduleButton />
          </div>
        </div>
        <SchedulesTable schedules={schedules} />
      </div>
    </>
  );
}
