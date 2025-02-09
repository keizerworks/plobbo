"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { BlogStatusEnum } from "db/blog/blog.sql";
import type { DataTableRowAction } from "interface/data-table";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { DataTableColumnHeader } from "components/data-table/header";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { cn, formatDate } from "lib/utils";
import { CheckCircle2, Ellipsis, Timer } from "lucide-react";

import type { BlogList } from "./list";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<BlogList> | null>
  >;
}

export function getStatusIcon(
  status: (typeof BlogStatusEnum.enumValues)[number],
): LucideIcon {
  const statusIcons: Record<typeof status, LucideIcon> = {
    PUBLISHED: CheckCircle2,
    DRAFT: Timer,
  };

  return statusIcons[status];
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<BlogList>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex size-8">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="m-auto"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex size-8">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="m-auto"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },

    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="slug" />
      ),
      cell: ({ row }) => {
        return (
          <span className="max-w-[31.25rem] truncate font-medium">
            {row.getValue("slug")}
          </span>
        );
      },
    },

    {
      accessorKey: "blog_metadata",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ cell }) => {
        return (
          <span className="max-w-[31.25rem] truncate font-medium">
            {(cell.getValue() as BlogList["metadata"]).title}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status: (typeof BlogStatusEnum.enumValues)[number] =
          row.getValue("status");
        const Icon = getStatusIcon(status);

        return (
          <div className="flex w-[6.25rem] items-center">
            <Badge
              variant="secondary"
              className={cn(
                "text-foreground",
                status === "DRAFT" ? "bg-yellow-500/20" : "bg-green-500/20",
              )}
            >
              <Icon className="mr-1 size-3.5" aria-hidden="true" />
              <span className="text-xs font-medium capitalize">
                {status.toLowerCase()}
              </span>
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },

    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
      cell: ({ cell }) => (
        <Link href="#" className="hover:underline">
          {(cell.getValue() as BlogList["author"]).displayName}
        </Link>
      ),
    },

    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href={"/blogs/" + row.id}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "delete" })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
