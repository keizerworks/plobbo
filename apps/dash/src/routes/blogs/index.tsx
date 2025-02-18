import type { QueryClient } from "@tanstack/react-query";
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
import {
    getBlogsCountQueryOptions,
    getBlogsQueryOption,
} from "~/actions/blog/query-options";
import { getActiveOrg } from "~/actions/cookies/active-org";
import { CreateBlog } from "~/components/blogs/create";
import { BlogsTable } from "~/components/blogs/list";
import { DataTableSkeleton } from "~/components/data-table/skeleton";
import { DateRangePicker } from "~/components/filters/date-filter";
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

export const Route = createFileRoute("/blogs/")({
    component: RouteComponent,
    validateSearch: (s: Record<string, string>) => loader(s),
    loader: async ({ location, context }) => {
        console.log(location);
        // @ts-expect-error -- idk4
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const queryClient: QueryClient = context.queryClient;
        const search = location.search as unknown as inferParserType<
            typeof parser
        > & { organizationId: string };

        const sort: ListBlogSortFilterInterface["sort"] = {};
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (search.sort)
            for (const { id, desc } of search.sort) {
                sort[id as keyof typeof sort] = desc ? "desc" : "asc";
            }

        const activeOrg = getActiveOrg();
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
            queryClient.ensureQueryData(getBlogsCountQueryOptions(filter)),
            queryClient.ensureQueryData(getBlogsQueryOption({ filter, sort })),
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
