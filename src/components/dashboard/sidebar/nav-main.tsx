"use client";

import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible } from "components/ui/collapsible";
import { Newspaper, Users } from "lucide-react";

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
  isActive?: boolean;
}

export function NavMain() {
  const pathname = usePathname();

  const navItems: NavItemInterface[] = useMemo(
    () =>
      [
        {
          title: "Blogs",
          url: "/dashboard/blogs",
          icon: Newspaper,
          isActive: pathname.startsWith("/dashboard/blogs"),
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
          isActive: pathname.startsWith("/dashboard/users"),
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
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
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
