import { useActiveOrgIdStore, useActiveOrgStore } from "~/store/active-org";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { OrgSwitcher } from "./org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./sidebar";
import { SidebarSubscribeForm } from "./subscribe";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeOrgId = useActiveOrgIdStore.use.id();
  const activeOrg = useActiveOrgStore.use.data();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>{activeOrgId ? <NavMain /> : null}</SidebarContent>
      <SidebarFooter>
        {activeOrg && activeOrg.subscription?.status !== "ACTIVE" ? (
          <SidebarSubscribeForm />
        ) : null}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
