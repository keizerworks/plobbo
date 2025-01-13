import React from "react";
import { CreateBlog } from "components/blogs/create";
import { BlogsTable } from "components/blogs/list";
import { DateRangePicker } from "components/ui/data-range-picker";
import { Skeleton } from "components/ui/skeleton";
import { api, HydrateClient } from "trpc/server";

export default function BlogsPage() {
  void api.blog.count.prefetch({});
  void api.blog.list.prefetch({});

  return (
    <HydrateClient>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-y-2 p-4">
        <div className="ml-auto flex items-center gap-x-2">
          <React.Suspense
            fallback={
              <>
                <Skeleton className="h-7 w-36" />
                <Skeleton className="h-7 w-52" />
              </>
            }
          >
            <CreateBlog />
            <DateRangePicker
              triggerSize="sm"
              triggerClassName="w-56 sm:w-60"
              align="end"
              shallow={false}
            />
          </React.Suspense>
        </div>

        <BlogsTable />
      </main>
    </HydrateClient>
  );
}
