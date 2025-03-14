"use client";

import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import find from "lodash.find";
import { ChevronsUpDown, Plus } from "lucide-react";

import { organizationsQueryOption } from "~/actions/organization/query-options";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { emitter } from "~/events/emitter";
import {
  setActiveOrg,
  setActiveOrgId,
  useActiveOrgIdStore,
  useActiveOrgStore,
} from "~/store/active-org";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./sidebar";

export function OrgSwitcher() {
  const { data: orgs } = useSuspenseQuery(organizationsQueryOption);

  const { isMobile } = useSidebar();
  const id = useActiveOrgIdStore.use.id();
  const activeOrg = useActiveOrgStore.use.data();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (id === null && orgs[0]) {
      setActiveOrg(orgs[0]);
      setActiveOrgId(orgs[0].id);
    }

    if (id && orgs.length && orgs.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const org = find(orgs, (value) => value.id === id) ?? orgs[0]!;
      setActiveOrg(org);
      setActiveOrgId(org.id);
    }

    emitter.emit("update:org:refetchquerydata");
  }, [orgs, id]);

  const handleCreateOrg = () => {
    emitter.emit("create:org", true);
  };

  if (!orgs.length || !activeOrg) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-[8px]">
                <AvatarImage
                  className="object-cover"
                  src={activeOrg.logo}
                  alt={activeOrg.slug}
                />

                <AvatarFallback className="rounded-lg uppercase">
                  {activeOrg.name[0]}
                  {activeOrg.name[1]}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeOrg.name}</span>
                <span className="truncate text-xs">{activeOrg.slug}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-full max-w-80 min-w-72 flex-1 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={() => {
                setActiveOrgId(activeOrg.id);
                setActiveOrg(activeOrg);
              }}
              className="gap-2 p-2"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  className="object-cover"
                  src={activeOrg.logo}
                  alt={activeOrg.slug}
                />

                <AvatarFallback className="rounded-lg uppercase">
                  {activeOrg.name[0]}
                  {activeOrg.name[1]}
                </AvatarFallback>
              </Avatar>

              <div className="mr-auto grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeOrg.name}</span>
                <span className="truncate text-xs">{activeOrg.slug}</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-muted-foreground w-full text-xs">
              Organizations
            </DropdownMenuLabel>

            {orgs
              .filter((org) => org.id !== activeOrg.id)
              .map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => {
                    setActiveOrgId(org.id);
                    setActiveOrg(org);
                  }}
                  className="gap-2 p-2"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      className="object-cover"
                      src={org.logo}
                      alt={org.slug}
                    />

                    <AvatarFallback className="rounded-lg uppercase">
                      {org.name[0]}
                      {org.name[1]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{org.name}</span>
                    <span className="truncate text-xs">{org.slug}</span>
                  </div>
                </DropdownMenuItem>
              ))}

            {orgs.length > 1 ? <DropdownMenuSeparator /> : null}

            <DropdownMenuItem onClick={handleCreateOrg} className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add Org</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
