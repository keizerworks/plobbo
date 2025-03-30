import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ConfigureSidebarNav } from "~/components/configure/sidenav";

export const Route = createFileRoute("/_private/_configure/configure/_settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col space-y-8 overflow-hidden lg:grid lg:grid-cols-5 lg:space-y-0 lg:gap-x-6">
      <aside className="pt-4 lg:mb-auto">
        <ConfigureSidebarNav />
      </aside>

      <div className="h-full lg:col-span-4">
        <Outlet />
      </div>
    </div>
  );
}
