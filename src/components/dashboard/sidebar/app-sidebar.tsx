"use client";

import * as React from "react";

import { NavUser } from "~/components/dashboard/sidebar/nav-user";
import { OrgSwitcher } from "~/components/dashboard/sidebar/org-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarSeparator,
} from "~/components/dashboard/sidebar/sidebar";
import { useActiveOrgStore } from "~/store/active-org";

import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const activeOrgId = useActiveOrgStore.use.id();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrgSwitcher />
            </SidebarHeader>

            {activeOrgId ? <SidebarSeparator /> : null}
            <SidebarContent>{activeOrgId ? <NavMain /> : null}</SidebarContent>

            <SidebarSeparator />
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
