import { Link } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { buttonVariants } from "../plate-ui/button";

export function SidebarSubscribeForm() {
  return (
    <Card className="shadow-none">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm">Upgrade to Pro</CardTitle>
        <CardDescription className="text-xs">
          Get access to premium features and enhanced capabilities for
          $10/month.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2.5 p-3">
        <Link
          to="/subscribe/pro"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none",
          )}
        >
          Upgrade Now
        </Link>
      </CardContent>
    </Card>
  );
}
