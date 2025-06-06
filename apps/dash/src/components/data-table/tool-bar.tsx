import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { X } from "lucide-react";

import type { DataTableFilterField } from "~/interface/data-table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDebouncedCallback } from "~/hooks/use-debounced-callback";
import { cn } from "~/lib/utils";

import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: DataTableFilterField<TData>["id"],
  ) => table.getColumn(String(id))?.setFilterValue(event.target.value);

  const debouncedOnChange = useDebouncedCallback(onChange, 300);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  autoFocus
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  defaultValue={
                    table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string
                  }
                  onChange={(event) => debouncedOnChange(event, column.id)}
                  className="h-8 w-40 lg:w-64"
                />
              ),
          )}

        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}

        {!isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
