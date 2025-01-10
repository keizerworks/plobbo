import Link from "next/link";
import { buttonVariants } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { PlusCircle } from "lucide-react";

export default function NoOrganizationsPage() {
  return (
    <Card className="m-auto rounded-lg border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle>No Organizations</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          You're not a member of any organizations yet
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        <Link
          href="create/organization"
          className={cn(buttonVariants(), "gap-x-2")}
        >
          <PlusCircle className="size-4" />
          Create Organization
        </Link>
      </CardContent>

      <div className="relative">
        <Separator className="my-8" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">or</span>
        </div>
      </div>

      <CardDescription className="text-center">
        ask your admin to add you to an organization
      </CardDescription>
    </Card>
  );
}
