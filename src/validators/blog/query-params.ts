import type { BlogListWithAuthor } from "components/blogs/list";
import { blog_status } from "db/enums";
import {
  getFiltersStateParser,
  getSortingStateParser,
} from "lib/data-table/parser";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";

export const blogsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<BlogListWithAuthor>().withDefault([
    { id: "created_at", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(
    z.enum([blog_status.PUBLISHED, blog_status.DRAFT]),
  ).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),

  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
