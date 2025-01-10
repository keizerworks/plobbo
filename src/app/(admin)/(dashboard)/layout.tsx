import type { ReactNode } from "react";
import { AppSidebar } from "components/dashboard/app-sidebar";
import DashboardHeader from "components/dashboard/header";
import { SidebarInset, SidebarProvider } from "components/dashboard/sidebar";
import { Separator } from "components/ui/separator";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="floating" />
      <SidebarInset className="m-2 h-[calc(100svh_-_1rem)] min-h-[calc(100svh_-_1rem)] overflow-hidden rounded-lg border shadow-lg">
        <DashboardHeader />
        <Separator className="mx-auto w-[calc(100%_-_2rem)]" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
