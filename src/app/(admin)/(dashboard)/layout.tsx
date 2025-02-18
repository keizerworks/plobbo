import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AppSidebar } from "~/components/dashboard/sidebar/app-sidebar";
import DashboardHeader from "~/components/dashboard/sidebar/header";
import {
    SidebarInset,
    SidebarProvider,
} from "~/components/dashboard/sidebar/sidebar";
import { CreateOrganization } from "~/components/organization/create";
import { UpdateOrganization } from "~/components/organization/update";
import { Separator } from "~/components/ui/separator";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <NuqsAdapter>
            <SidebarProvider>
                <AppSidebar variant="floating" />
                <SidebarInset className="m-2 h-[calc(100svh_-_1rem)] min-h-[calc(100svh_-_1rem)] overflow-hidden rounded-lg border shadow-lg">
                    <DashboardHeader />
                    <Separator className="mx-auto w-[calc(100%_-_2rem)]" />
                    {children}
                </SidebarInset>
            </SidebarProvider>

            <CreateOrganization />
            <UpdateOrganization />
        </NuqsAdapter>
    );
}
