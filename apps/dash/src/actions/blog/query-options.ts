import { queryOptions } from "@tanstack/react-query";

import type { ListBlogSortFilterInterface } from "@plobbo/validator/blog/list";

import { getBlog, getBlogs, getBlogsCount } from "./index";
import { getBlogMetadata } from "./metadata";

export const getBlogQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["blog", id],
    queryFn: () => getBlog(id),
  });

export const getBlogsQueryOption = (params: ListBlogSortFilterInterface) =>
  queryOptions({
    queryKey: ["blogs", params],
    queryFn: () => getBlogs(params),
  });

export const getBlogsCountQueryOptions = (
  filters: ListBlogSortFilterInterface["filter"],
) =>
  queryOptions({
    queryKey: ["blogs-count", filters],
    queryFn: () => getBlogsCount(filters),
  });

export const getBlogMetadataQueryOptions = (blogId: string) =>
  queryOptions({
    queryKey: ["blog", blogId, "metadata"],
    queryFn: async () => getBlogMetadata(blogId),
  });
