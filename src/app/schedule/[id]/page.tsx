import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription, // No longer directly used
  // CardHeader, // No longer directly used
  // CardTitle, // No longer directly used
  // CardFooter, // No longer directly used
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"; // No longer directly used
import BackButton from "@/components/back-button";
import { Cronjob } from "@/types/Cronjob";
// import cronstrue from "cronstrue"; // No longer directly used
import SubscribeButton from "@/components/subscribe-button";
import ScheduleDetailsCard from "@/components/ScheduleDetailsCard";
import PaymentPlanCard from "@/components/PaymentPlanCard";

export default async function PaymentPlanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
  
  if (!res.ok) {
    console.error(`Failed to fetch job details: ${res.status} ${res.statusText}`);
    // Return null or handle error appropriately to show the "not found" state
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
        <BackButton className="mb-4 sm:mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
        </BackButton>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Schedule not found or an error occurred while fetching details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const job: Cronjob = await res.json();

  if (!job || !job.id) { // Added !job.id to check for empty job object
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
        <BackButton className="mb-4 sm:mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
        </BackButton>
        <Card> {/* Added Card for consistent styling of not found message */}
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Schedule not found or an error occurred while fetching details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
      <BackButton className="mb-4 sm:mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
      </BackButton>

      <div className="grid gap-4 sm:gap-6">
        <ScheduleDetailsCard job={job} />

        <SubscribeButton jobId={job.id} subscriptions={job.subscriptions} />

        <div className="flex items-center justify-between mt-2 mb-4"> {/* Added mt-2 for spacing */}
          <h2 className="text-xl sm:text-2xl font-bold">
            Payment Plans ({job.paymentPlans.length})
          </h2>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Plan
          </Button>
        </div>

        {job.paymentPlans && job.paymentPlans.length > 0 ? (
          job.paymentPlans.map((plan) => (
            <PaymentPlanCard
              key={plan.id}
              plan={plan}
              cronExpression={job.cron}
            />
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No payment plans have been set up for this schedule yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
