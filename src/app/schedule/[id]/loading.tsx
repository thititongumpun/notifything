import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackButton from "@/components/back-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
      <BackButton className="mb-4 sm:mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schedules
      </BackButton>

      <div className="grid gap-4 sm:gap-6">
        {/* Schedule Card Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <Skeleton className="h-8 w-64 sm:w-80" />
                <Skeleton className="h-4 w-40 mt-2" />
              </div>
              <div className="flex-shrink-0">
                <Skeleton className="h-6 w-24" />
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
                <Skeleton className="h-7 w-full sm:w-48" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Human-readable Schedule</span>
                </div>
                <Skeleton className="h-7 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-36 mr-2" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>

        {/* Payment Plans Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Payment Plan Skeleton */}
        {[1, 2].map((index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <Skeleton className="h-7 w-64 sm:w-80" />
                  <Skeleton className="h-5 w-48 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Cards Skeletons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((cardIndex) => (
                  <Card key={cardIndex}>
                    <CardHeader className="pb-0 sm:pb-2">
                      <Skeleton className="h-4 w-28" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32" />
                      {cardIndex === 3 && (
                        <Skeleton className="h-2 w-full mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Payment Details Skeletons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Payment Period</span>
                  </div>
                  <Skeleton className="h-5 w-full sm:w-56" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Bell className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Payment Schedule</span>
                  </div>
                  <Skeleton className="h-5 w-full sm:w-64" />
                </div>
              </div>

              {/* Payments Table Skeleton */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payments">
                  <AccordionTrigger className="text-lg font-medium">
                    Payment History
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-md border overflow-x-auto mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Month</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Payment Date
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                              Notes
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3].map((paymentIndex) => (
                            <TableRow key={paymentIndex}>
                              <TableCell className="font-medium">
                                <Skeleton className="h-4 w-4" />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground hidden sm:inline" />
                                  <Skeleton className="h-4 w-24" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground hidden sm:inline" />
                                  <Skeleton className="h-4 w-16" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-6 w-16" />
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="flex items-center">
                                  <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Skeleton className="h-4 w-32" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Payment Details Skeleton */}
                    <div className="sm:hidden space-y-4 mt-4">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Mobile Payment Details
                      </h4>
                      {[1, 2, 3].map((mobileIndex) => (
                        <Card key={mobileIndex}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-5 w-20" />
                              <Skeleton className="h-6 w-16" />
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 space-y-2 text-sm">
                            {[1, 2, 3, 4].map((detail) => (
                              <div
                                key={detail}
                                className="flex justify-between"
                              >
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Skeleton className="h-10 w-full sm:w-36" />
              <Skeleton className="h-10 w-full sm:w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
