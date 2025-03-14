import { useMemo, useState } from "react";
import { createLazyFileRoute, useLoaderData } from "@tanstack/react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/plate-ui/alert-dialog";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";
import { useActiveOrgStore } from "~/store/active-org";

export const Route = createLazyFileRoute(
  "/_configure/configure/_settings/settings/subscription/",
)({ component: RouteComponent });

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const activeOrg = useActiveOrgStore.use.data();

  const subscription = useLoaderData({
    from: "/_configure/configure/_settings/settings/subscription/",
  });

  const renewalDate = useMemo(() => {
    if (!subscription) return undefined;
    const startDate = new Date(subscription.startedAt);
    const today = new Date();
    let nextRenewal = new Date(startDate);

    while (nextRenewal <= today) {
      const currentMonth = nextRenewal.getMonth();
      nextRenewal.setMonth(nextRenewal.getMonth() + 1);

      // Handle month end edge cases
      if (nextRenewal.getMonth() !== (currentMonth + 1) % 12) {
        nextRenewal.setDate(0); // Set to last day of previous month
      }
    }

    return nextRenewal.toLocaleDateString();
  }, [subscription]);

  if (!subscription) {
    return <div>No active subscription</div>;
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b p-4 px-0">
        <CardTitle className="inline-flex items-center gap-x-3">
          Subscription Details{" "}
          <div className="flex items-center">
            <span className="mr-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
              {subscription.status}
            </span>
          </div>
        </CardTitle>

        <CardDescription>
          Manage your organization's subscription
        </CardDescription>
      </CardHeader>
      {/* Header */}

      <CardContent className="grid grid-cols-1 gap-6 p-4 px-0 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Plan Details
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Plan</span>
              <span className="text-sm font-medium">
                {subscription.product.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Billing Cycle</span>
              <span className="text-sm font-medium capitalize">
                {subscription.recurringInterval}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-medium">
                {formatCurrency(subscription.amount, subscription.currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Dates & Usage
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Start Date</span>
              <span className="text-sm font-medium">{subscription.status}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Next Renewal</span>
              <span className="text-sm font-medium">{renewalDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-0 pt-4">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive" })}
          >
            Cancel Subscription
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription? This will end
                your access to Enterprise Pro features at the end of your
                current billing period on {renewalDate}.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Keep My Subscription</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                Yes, Cancel Subscription
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
