import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Separator } from "components/ui/separator";
import { api } from "trpc/server";

import { CreateOrganizationTrigger } from "./create/trigger";

export default async function NoOrganization() {
  const count = await api.organization.count();

  if (count && count > 0) {
    redirect("/dashboard");
  }

  return (
    <Card className="m-auto rounded-lg border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle>No Organizations</CardTitle>
        <CardDescription className="text-sm text-gray-500">
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
}
