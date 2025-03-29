import type { QueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { organizationsQueryOption } from "~/actions/organization/query-options";
import { CreateOrganization } from "~/components/organization/create";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import DashboardHeader from "~/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "~/components/sidebar/sidebar";
import { Separator } from "~/components/ui/separator";
import apiClient from "~/lib/axios";
import { getIsLoggedIn, initializeAuth } from "~/store/auth";

interface RouteContext {
  queryClient: QueryClient;
}

export const Route = createFileRoute("/_private")({
  beforeLoad: async ({ location: { pathname }, context }) => {
    try {
      await initializeAuth();
    } catch (e) {
      console.log(e);
    }

    const loggedIn = getIsLoggedIn();
    if (!loggedIn) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: "/auth" });
    }

    // Fetch organizations count
    const { count } = await apiClient
      .get<{ count: number }>("organizations/count")
      .then((r) => r.data);

    if (count > 0 && pathname.includes("no-organization")) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: "/" });
    }
    if (count === 0 && !pathname.includes("no-organization")) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: "/no-organization" });
    }

    // Fetch organizations data
    return (context as RouteContext).queryClient.ensureQueryData(
      organizationsQueryOption,
    );
  },
  pendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
  component: PrivateLayout,
});

function PrivateLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="m-2 flex-1 overflow-hidden rounded-lg border shadow-lg">
          <DashboardHeader />
          <Separator className="mx-auto w-[calc(100%_-_2rem)]" />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <CreateOrganization />
    </>
  );
}
