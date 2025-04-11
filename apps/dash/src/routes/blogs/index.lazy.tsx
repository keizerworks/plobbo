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
      <header className="flex items-center border-b py-8 gap-x-2 justify-between w-full">
        <h1 className="font-semibold">Blog Overview</h1>
        <div className="flex items-center gap-2">
          <CreateBlog />
          <DateRangePicker
            triggerSize="default"
            triggerClassName="w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </div>
      </header>

      <BlogsTable />
    </main>
  );
}
