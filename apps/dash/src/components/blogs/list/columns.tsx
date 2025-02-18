import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Ellipsis, Timer } from "lucide-react";

import { BlogStatusEnum } from "@plobbo/validator/blog/list";

import type { BlogList } from "./index";
import type { DataTableRowAction } from "~/interface/data-table";
import { DataTableColumnHeader } from "~/components/data-table/header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, formatDate } from "~/lib/utils";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<BlogList> | null>
  >;
}

export function getStatusIcon(status: BlogStatusEnum): LucideIcon {
  const statusIcons: Record<BlogStatusEnum, LucideIcon> = {
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <span className="max-w-[31.25rem] truncate font-medium">
            {row.getValue("title")}
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
        const status: BlogStatusEnum = row.getValue("status");
        const Icon = getStatusIcon(status);

        return (
          <div className="flex w-[6.25rem] items-center">
            <Badge
              variant="secondary"
              className={cn(
                "text-foreground",
                status === BlogStatusEnum.DRAFT
                  ? "bg-yellow-500/20"
                  : "bg-green-500/20",
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
      accessorKey: "createdAt",
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
      cell: ({ cell }) => {
        const author = cell.getValue() as BlogList["author"];
        return (
          <Link
            from="/blogs"
            to="/users/$user-id"
            params={{ "user-id": author.id }}
            className="hover:underline"
          >
            {author.displayName}
          </Link>
        );
      },
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
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  to="/blogs/$blog-id"
                  // @ts-expect-error -- idk2
                  search={undefined}
                  params={{ "blog-id": row.id }}
                >
                  Edit
                </Link>
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
