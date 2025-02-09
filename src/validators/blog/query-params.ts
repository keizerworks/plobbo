import type { BlogList } from "components/blogs/list";
import { BlogStatusEnum } from "db/blog/blog.sql";
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
  sort: getSortingStateParser<BlogList>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  blog_metadata: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.enum(BlogStatusEnum.enumValues)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),

  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
