"use client";

import type { Blog } from "db/blog";
import type { BlogMetadata } from "db/blog/metadata";
import type { OrganizationMember } from "db/organization/member";
import type {
  DataTableFilterField,
  DataTableRowAction,
} from "interface/data-table";
import type { ListBlogSortFilterInterface } from "validators/blog/list";
import { useMemo, useState } from "react";
import { DataTable } from "components/data-table";
import { DataTableSkeleton } from "components/data-table/skeleton";
import { BlogStatusEnum } from "db/blog/blog.sql";
import { useDataTable } from "hooks/use-data-table";
import { toSentenceCase } from "lib/utils";
import { api } from "trpc/react";

import { DataTableToolbar } from "../data-table/tool-bar";
import { getColumns, getStatusIcon } from "./columns";
import { DeleteBlogsDialog } from "./delete-blogs-dialog";
import { BlogsTableToolbarActions } from "./tool-bar-actions";

export interface BlogList extends Blog.Model {
  author: OrganizationMember.Model;
  metadata: BlogMetadata.Model;
}

export const BlogsTable = ({
  params,
}: {
  params: ListBlogSortFilterInterface;
}) => {
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<BlogList> | null>(null);

  const { data, isPending } = api.blog.list.useQuery(
    { ...params },
    {
      initialData: [],
    },
  );

  const { data: count, isPending: countIsPending } = api.blog.count.useQuery(
    params.filter ?? {},
    { initialData: 0 },
  );

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const filterFields: DataTableFilterField<BlogList>[] = [
    {
      id: "metadata",
      label: "Title",
      placeholder: "Filter titles...",
    },
    {
      id: "status",
      label: "Status",
      options: BlogStatusEnum.enumValues.map((status) => ({
        label: toSentenceCase(status),
        value: status,
        icon: getStatusIcon(status),
      })),
    },
  ];

  const { table } = useDataTable({
    data: data as BlogList[],
    columns,
    filterFields,
    pageCount: count / 10,
    rowCount: 10,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if ((isPending as boolean) || (countIsPending as boolean)) {
    return (
      <DataTableSkeleton
        columnCount={4}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={4}
        cellWidths={["16rem", "24rem", "12rem", "12rem"]}
        shrinkZero
      />
    );
  }

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <BlogsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <DeleteBlogsDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        blogs={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
};
