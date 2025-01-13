"use client";

import type { Table } from "@tanstack/react-table";

import type { BlogListWithAuthor } from "./list";
import { DeleteBlogsDialog } from "./delete-blogs-dialog";

interface TasksTableToolbarActionsProps {
  table: Table<BlogListWithAuthor>;
}

export function BlogsTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteBlogsDialog
          blogs={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
