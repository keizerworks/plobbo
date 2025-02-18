import { useActiveOrgStore } from "~/store/active-org";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { OrgSwitcher } from "./org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeOrgId = useActiveOrgStore.use.id();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>{activeOrgId ? <NavMain /> : null}</SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
