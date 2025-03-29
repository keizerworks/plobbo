import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { SidebarInset } from "~/components/sidebar/sidebar";

export const Route = createFileRoute("/_private/_configure")({
  pendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
  component: ConfigureLayout,
});

function ConfigureLayout() {
  return (
    <div className="flex h-full">
      <AppSidebar variant="inset" />
      <SidebarInset className="flex-1 overflow-hidden">
        <Outlet />
      </SidebarInset>
    </div>
  );
}
