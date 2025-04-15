import { createFileRoute } from "@tanstack/react-router";

import { CreateOrganizationTrigger } from "~/components/organization/create/trigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/no-organization")({
  component: () => {
    return (
      <Card className="m-auto rounded-lg border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-semibold tracking-tighter">
            No Organizations
          </CardTitle>
          <CardDescription className="text-sm text-gray-700">
            You&apos;re not a member of any organizations yet
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center">
          <CreateOrganizationTrigger />

          <div className="relative mt-6 w-full">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">or</span>
            </div>
          </div>
        </CardContent>

        <CardDescription className="text-center">
          ask your admin to add you to an organization
        </CardDescription>
      </Card>
    );
  },
  errorComponent: () => {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Error</h1>
          <p className="mt-4 text-gray-600">
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    );
  },
});
