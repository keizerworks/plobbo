"use client";

import type { DOMAttributes } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { find } from "lodash";
import { ChevronsUpDown, Plus, Settings } from "lucide-react";

import type { Organization } from "~/db/organization";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "~/components/dashboard/sidebar/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { env } from "~/env";
import { emitter } from "~/events/emitter";
import { setActiveOrgId, useActiveOrgStore } from "~/store/active-org";
import { api } from "~/trpc/react";

type ActiveOrgInteface = Organization.Model;

export function OrgSwitcher() {
    const router = useRouter();

    const { data: orgs } = api.organization.list.useQuery();

    const { isMobile } = useSidebar();
    const { id } = useActiveOrgStore();

    const [open, setOpen] = useState(false);
    const [activeOrg, setActiveOrg] = useState<ActiveOrgInteface | null>(null);

    useEffect(() => {
        if (typeof orgs !== "undefined" && orgs.length === 0) {
            router.replace("/no-organizations");
        }
    }, [orgs, router]);

    useEffect(() => {
        if (id === null && orgs?.[0]) {
            setActiveOrg(orgs[0]);
            setActiveOrgId(orgs[0].id);
        }

        if (id && orgs?.length && orgs.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const org = find(orgs, (value) => value.id === id) ?? orgs[0]!;
            setActiveOrg(org);
            setActiveOrgId(org.id);
        }
    }, [orgs, id]);

    const handleCreateOrg = () => {
        emitter.emit("create:org", true);
    };

    const handleUpdateOrg: DOMAttributes<HTMLButtonElement>["onClick"] = (
        e,
    ) => {
        e.stopPropagation();
        setOpen(false);
        emitter.emit("update:org", true);
    };

    if (!orgs?.length || !activeOrg) {
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
                                    src={
                                        env.NEXT_PUBLIC_S3_DOMAIN +
                                        "/" +
                                        activeOrg.logo
                                    }
                                    alt={activeOrg.slug}
                                />

                                <AvatarFallback className="rounded-lg uppercase">
                                    {activeOrg.name[0]}
                                    {activeOrg.name[1]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeOrg.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeOrg.slug}
                                </span>
                            </div>

                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-full min-w-72 max-w-80 flex-1 rounded-lg"
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
                                    src={
                                        env.NEXT_PUBLIC_S3_DOMAIN +
                                        "/" +
                                        activeOrg.logo
                                    }
                                    alt={activeOrg.slug}
                                />

                                <AvatarFallback className="rounded-lg uppercase">
                                    {activeOrg.name[0]}
                                    {activeOrg.name[1]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="mr-auto grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeOrg.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeOrg.slug}
                                </span>
                            </div>

                            <Button
                                onClick={handleUpdateOrg}
                                size="icon"
                                variant="outline"
                            >
                                <Settings className="size-4" />
                            </Button>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className="w-full text-xs text-muted-foreground">
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
                                            src={
                                                env.NEXT_PUBLIC_S3_DOMAIN +
                                                "/" +
                                                org.logo
                                            }
                                            alt={org.slug}
                                        />

                                        <AvatarFallback className="rounded-lg uppercase">
                                            {org.name[0]}
                                            {org.name[1]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {org.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {org.slug}
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                            ))}

                        {orgs.length > 1 ? <DropdownMenuSeparator /> : null}

                        <DropdownMenuItem
                            onClick={handleCreateOrg}
                            className="gap-2 p-2"
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                Add Org
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
