import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { BlogStatusEnum } from "@plobbo/validator/blog/list";

import type { Blog } from "~/interface/blog";
import type {
  DataTableFilterField,
  DataTableRowAction,
} from "~/interface/data-table";
import type { OrganizationMember } from "~/interface/organization";
import { DataTable } from "~/components/data-table";
import { Input } from "~/components/ui/input";
import { useDataTable } from "~/hooks/use-data-table";
import { toSentenceCase } from "~/lib/utils";

import { DeleteBlogsDialog } from "../delete-blogs-dialog";
import { getColumns, getStatusIcon } from "./columns";

export interface BlogList extends Blog {
  author: OrganizationMember;
}

export const BlogsTable = () => {
  const { blogs, count } = useLoaderData({ from: "/journey/" });
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<BlogList> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    pageCount: count / 10 < 1 ? 1 : Math.ceil(count / 10),
    rowCount: count,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  useEffect(() => {
    const columnFilters = table.getState().columnFilters;

    const titleFilterIndex = columnFilters.findIndex(
      (filter) => filter.id === "title",
    );

    if (searchQuery) {
      if (titleFilterIndex >= 0) {
        const updatedFilters = [...columnFilters];
        updatedFilters[titleFilterIndex] = { id: "title", value: searchQuery };
        table.setColumnFilters(updatedFilters);
      } else {
        table.setColumnFilters([
          ...columnFilters,
          { id: "title", value: searchQuery },
        ]);
      }
    } else if (titleFilterIndex >= 0) {
      const updatedFilters = [...columnFilters];
      updatedFilters.splice(titleFilterIndex, 1);
      table.setColumnFilters(updatedFilters);
    }
  }, [searchQuery, table]);

  return (
    <section className="">
      <header className="border-b">
        <div className="max-w-[1536px] grid grid-cols-2 mx-auto w-full py-4 px-8 ">
          <div className="relative">
            <Input
              placeholder="Find your documented journey..."
              className="bg-[#F6F6F6] outline-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-neutral-600 font-medium tracking-tight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-2 text-neutral-600">
              <Search size={18} />
            </div>
          </div>
        </div>
      </header>
      <DataTable
        table={table}
        className="max-w-[1536px] mx-auto w-full p-8"
      ></DataTable>
      <DeleteBlogsDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        blogs={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </section>
  );
};
