import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Cog, LayoutDashboard, Newspaper, Users } from "lucide-react";

import { Collapsible } from "~/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

interface NavItemInterface {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function NavMain() {
  const pathname = useLocation().pathname;

  const navItems: NavItemInterface[] = useMemo(
    () =>
      [
        {
          title: "Journey",
          url: "/journey",
          icon: Newspaper,
          isActive: pathname.startsWith("/journey"),
        },
        {
          title: "Plobbo Ai",
          url: "/plobbo-ai",
          icon: LayoutDashboard,
          isActive: pathname.startsWith("/plobbo-ai"),
        },
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          isActive: pathname === "/",
        },

        {
          title: "Users",
          url: "/users",
          icon: Users,
          isActive: pathname.startsWith("/users"),
        },
        {
          title: "configure",
          url: "/configure",
          icon: Cog,
          isActive: pathname.startsWith("/configure"),
        },
      ] satisfies NavItemInterface[],
    [pathname],
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
                className={`tracking-tight ${item.isActive && "border shadow-xs "} hover:text-black`}
              >
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
