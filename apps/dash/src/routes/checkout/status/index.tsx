import { useEffect } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/status/")({
  validateSearch: () => ({}),
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    toast.success("Subscription Activated!", {
      description:
        "Your subscription is now active. You can start enjoying all the premium features.",
      duration: 10000,
    });
  }, []);

  return <Navigate to="/" search={{}} />;
}
