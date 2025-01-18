import type { SearchParams } from "interface/data-table";
import type { ListBlogSortFilterInterface } from "validators/blog/list";
import React from "react";
import { CreateBlog } from "components/blogs/create";
import { BlogsTable } from "components/blogs/list";
import { DateRangePicker } from "components/ui/data-range-picker";
import { Skeleton } from "components/ui/skeleton";
import { api, HydrateClient } from "trpc/server";
import { blogsSearchParamsCache } from "validators/blog/query-params";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BlogsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = blogsSearchParamsCache.parse(searchParams);

  const params: ListBlogSortFilterInterface = {
    filter: {
      search: search.title,
      status: search.status[0],
    },
    sort: search.sort[0]
      ? {
          [search.sort[0].id]: search.sort[0].desc ? "desc" : "asc",
        }
      : {},
  };

  void api.blog.count.prefetch(params.filter ?? {});
  void api.blog.list.prefetch(params);

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

        <BlogsTable params={params} />
      </main>
    </HydrateClient>
  );
}
