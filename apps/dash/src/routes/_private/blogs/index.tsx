import type { inferParserType } from "nuqs";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  createLoader,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs";
import { z } from "zod";

import type { ListBlogSortFilterInterface } from "@plobbo/validator/blog/list";
import { BlogStatusEnum } from "@plobbo/validator/blog/list";

import type { BlogList } from "~/components/blogs/list";
import { getBlogs, getBlogsCount } from "~/actions/blog";
import { getActiveOrgIdFromCookie } from "~/actions/cookies/active-org";
import { DataTableSkeleton } from "~/components/data-table/skeleton";
import { Skeleton } from "~/components/ui/skeleton";
import { getSortingStateParser } from "~/lib/data-table/parser";

const parser = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<BlogList>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(
    z.enum([BlogStatusEnum.PUBLISHED, BlogStatusEnum.DRAFT]),
  ).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
};

const loader = createLoader(parser);

export const Route = createFileRoute("/_private/blogs/")({
  validateSearch: loader,
  loader: async ({ location }) => {
    const search = location.search as unknown as inferParserType<
      typeof parser
    > & { organizationId: string };

    const sort: ListBlogSortFilterInterface["sort"] = {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (search.sort)
      for (const { id, desc } of search.sort) {
        sort[id as keyof typeof sort] = desc ? "desc" : "asc";
      }

    const activeOrg = getActiveOrgIdFromCookie();
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (!activeOrg) throw redirect({ to: "/" });

    const activeOrgId = (
      JSON.parse(activeOrg) as { state: { id: string; version: number } }
    ).state.id;

    const filter: ListBlogSortFilterInterface["filter"] = {
      search: search.title,
      organizationId: activeOrgId,
    };

    if (search.status[0]) {
      filter.status = search.status[0];
    }

    const [count, blogs] = await Promise.all([
      getBlogsCount(filter),
      getBlogs({
        filter,
        sort,
        page: search.page,
        perPage: search.perPage,
      }),
    ]);

    return { blogs, count };
  },
  pendingComponent: () => (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-y-2 p-4">
      <div className="ml-auto flex items-center gap-x-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-7 w-52" />
      </div>

      <DataTableSkeleton
        columnCount={4}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={4}
        cellWidths={["16rem", "24rem", "12rem", "12rem"]}
        shrinkZero
      />
    </main>
  ),
});
