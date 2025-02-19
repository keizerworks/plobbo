import { createLazyFileRoute } from "@tanstack/react-router";

import { CreateBlog } from "~/components/blogs/create";
import { BlogsTable } from "~/components/blogs/list";
import { DateRangePicker } from "~/components/filters/date-filter";

export const Route = createLazyFileRoute("/blogs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-y-2 p-4">
      <div className="ml-auto flex items-center gap-x-2">
        <CreateBlog />
        <DateRangePicker
          triggerSize="sm"
          triggerClassName="w-56 sm:w-60"
          align="end"
          shallow={false}
        />
      </div>

      <BlogsTable />
    </main>
  );
}
