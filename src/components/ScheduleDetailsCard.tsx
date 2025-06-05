import { Bell, Clock } from "lucide-react";
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
import { Cronjob } from "@/types/Cronjob";
import cronstrue from "cronstrue";

interface ScheduleDetailsCardProps {
  job: Cronjob;
}

export default function ScheduleDetailsCard({ job }: ScheduleDetailsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl break-words">
              {job.name}
            </CardTitle>
            <CardDescription className="mt-1">
              Schedule Details
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            {job.enabled ? (
              <Badge className="bg-green-500">Enabled</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Disabled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notification Schedule</span>
            </div>
            <p className="text-lg font-medium break-words">{job.cron}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Human-readable Schedule</span>
            </div>
            <p className="text-lg font-medium break-words">
              {cronstrue.toString(job.cron, {
                use24HourTimeFormat: true,
                verbose: true,
              })}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mr-2">
          <Bell className="mr-2 h-4 w-4" />
          Test Notification
        </Button>
        <Button variant="outline">Edit Schedule</Button>
      </CardFooter>
    </Card>
  );
}
