/* eslint-disable @typescript-eslint/only-throw-error */
import type { QueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { organizationsQueryOption } from "~/actions/organization/query-options";
import { CreateOrganization } from "~/components/organization/create";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import DashboardHeader from "~/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "~/components/sidebar/sidebar";
import { Separator } from "~/components/ui/separator";
import apiClient from "~/lib/axios";

import { getIsLoggedIn, initializeAuth, login } from "../store/auth";

export const Route = createRootRoute({
  beforeLoad: async ({ location: { pathname } }) => {
    try {
      await initializeAuth();
    } catch (e) {
      console.log(e);
    }

    const loggedIn = getIsLoggedIn();
    if (!loggedIn) return await login();

    const { count } = await apiClient
      .get<{ count: number }>("organizations/count")
      .then((r) => r.data);

    if (count > 0 && pathname.includes("no-organization"))
      throw redirect({ to: "/" });
    if (count === 0 && !pathname.includes("no-organization"))
      throw redirect({ to: "/no-organization" });
  },
  // @ts-expect-error -- idk
  loader: async ({ context: { queryClient } }) => {
    return (queryClient as QueryClient).ensureQueryData(
      organizationsQueryOption,
    );
  },
  pendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="m-2 h-[calc(100svh_-_1rem)] min-h-[calc(100svh_-_1rem)] overflow-hidden rounded-lg border shadow-lg">
          <DashboardHeader />
          <Separator className="mx-auto w-[calc(100%_-_2rem)]" />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <CreateOrganization />
    </>
  );
}
