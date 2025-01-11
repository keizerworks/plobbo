"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "components/dashboard/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { env } from "env";
import { emitter } from "events/emitter";
import { ChevronsUpDown, Plus } from "lucide-react";
import { api } from "trpc/react";

export function OrgSwitcher() {
  const router = useRouter();

  const { data: orgs } = api.organization.list.useQuery();
  const { isMobile } = useSidebar();
  const [activeOrg, setActiveOrg] = useState(orgs?.[0]);

  useEffect(() => {
    if (typeof orgs !== "undefined" && orgs.length === 0) {
      router.replace("/no-organizations");
    }
  }, [orgs, router]);

  useEffect(() => {
    setActiveOrg(orgs?.[0]);
  }, [orgs]);

  const handleCreateOrg = () => {
    emitter.emit("createOrganization", true);
  };

  if (!orgs?.length || !activeOrg) {
    return null;
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  height={16}
                  width={16}
                  src={env.NEXT_PUBLIC_MINIO_URL + activeOrg.logo}
                  alt={activeOrg.name}
                />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeOrg.name}</span>
                <span className="truncate text-xs">{activeOrg.slug}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>

            {orgs.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setActiveOrg(org)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Image
                    height={16}
                    width={16}
                    src={env.NEXT_PUBLIC_MINIO_URL + org.logo}
                    alt={org.name}
                  />
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleCreateOrg} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add Org</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
