import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import type { ListBlogSortFilterInterface } from "@plobbo/validator/blog/list";
import { BlogStatusEnum } from "@plobbo/validator/blog/list";

import type { Blog } from "~/interface/blog";
import type {
  DataTableFilterField,
  DataTableRowAction,
} from "~/interface/data-table";
import type { OrganizationMember } from "~/interface/organization";
import {
  getBlogsCountQueryOptions,
  getBlogsQueryOption,
} from "~/actions/blog/query-options";
import { DataTable } from "~/components/data-table";
import { DataTableToolbar } from "~/components/data-table/tool-bar";
import { useDataTable } from "~/hooks/use-data-table";
import { toSentenceCase } from "~/lib/utils";
import { useActiveOrgStore } from "~/store/active-org";

import { DeleteBlogsDialog } from "../delete-blogs-dialog";
import { getColumns, getStatusIcon } from "./columns";
import { BlogsTableToolbarActions } from "./tool-bar-actions";

export interface BlogList extends Blog {
  author: OrganizationMember;
}

export const BlogsTable = () => {
  const organizationId = useActiveOrgStore.use.id();
  const search = useSearch({ from: "/blogs/" });

  const sort = useMemo(() => {
    const temp: ListBlogSortFilterInterface["sort"] = {};
    for (const { id, desc } of search.sort) {
      temp[id as keyof typeof temp] = desc ? "desc" : "asc";
    }
    return temp;
  }, [search.sort]);

  const filter = {
    search: search.title,
    status: search.status[0],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    organizationId: organizationId!,
  };

  const { data: count } = useSuspenseQuery(getBlogsCountQueryOptions(filter));
  const { data: blogs } = useSuspenseQuery(
    getBlogsQueryOption({ filter, sort }),
  );

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<BlogList> | null>(null);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const filterFields: DataTableFilterField<BlogList>[] = [
    {
      id: "title",
      label: "Title",
      placeholder: "Filter titles...",
    },
    {
      id: "status",
      label: "Status",
      options: [BlogStatusEnum.PUBLISHED, BlogStatusEnum.DRAFT].map(
        (status) => ({
          label: toSentenceCase(status),
          value: status,
          icon: getStatusIcon(status),
        }),
      ),
    },
  ];

  const { table } = useDataTable({
    data: blogs as BlogList[],
    columns,
    filterFields,
    pageCount: count / count < 10 ? count : 10,
    rowCount: count < 10 ? count : 10,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

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
