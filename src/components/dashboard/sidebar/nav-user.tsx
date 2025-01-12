"use client";

import { notFound } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "components/dashboard/sidebar/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Skeleton } from "components/ui/skeleton";
import { Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { api } from "trpc/react";

export function NavUser() {
  const { data: user, isPending, error } = api.auth.profile.useQuery();
  const { isMobile } = useSidebar();

  if (isPending) {
    return (
      <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm">
        <Skeleton className="size-8 rounded-lg" />
        <div className="grid flex-1 leading-tight">
          <Skeleton className="my-[3px] h-[14px] w-2/3" />
          <Skeleton className="my-0.5 h-3 w-full" />
        </div>
        <Skeleton className="ml-auto h-6 w-4" />
      </div>
    );
  }

  if (error) {
    return notFound();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={user.profile_picture ?? undefined}
                  alt={user.name}
                />

                <AvatarFallback className="rounded-lg uppercase">
                  {user.name[0]}
                  {user.name[1]}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={user.profile_picture ?? undefined}
                    alt={user.name}
                  />

                  <AvatarFallback className="rounded-lg uppercase">
                    {user.name[0]}
                    {user.name[1]}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
