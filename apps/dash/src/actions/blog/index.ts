import type { ListBlogSortFilterInterface } from "@plobbo/validator/blog/list";

import type { Blog, BlogMetadata } from "~/interface/blog";
import type { OrganizationMember } from "~/interface/organization";
import apiClient from "~/lib/axios";

export const getBlog = async (id: string) =>
  apiClient
    .get<Blog & { metadata: BlogMetadata }>("blogs/" + id)
    .then((r) => r.data);

export const getBlogs = async (params: ListBlogSortFilterInterface) =>
  apiClient
    .get<(Blog & { author: OrganizationMember })[]>("blogs", {
      params: {
        sort: JSON.stringify(params.sort ?? {}),
        filter: JSON.stringify(params.filter ?? {}),
      },
    })
    .then((r) => r.data);

export const getBlogsCount = async (
  filters: ListBlogSortFilterInterface["filter"],
) =>
  apiClient
    .get<{ count: number }>("blogs/count", { params: filters })
    .then((r) => r.data.count);

export const createBlog = async (props: FormData) =>
  apiClient.post<Blog>("blogs", props).then((r) => r.data);

export const patchBlog = async (props: FormData) =>
  apiClient.patch<Blog>("blogs", props).then((r) => r.data);

export const deleteBlogs = async (ids: string[]) =>
  apiClient.post("blogs", { params: { ids } });

export const patchBlogs = async (
  id: string,
  values: Partial<Omit<Blog, "id">>,
) => {
  const formData = new FormData();

  for (const key of Object.keys(values)) {
    const parsedKey = key as keyof typeof values;
    const value = values[parsedKey];

    if (value instanceof Blob || value instanceof File) {
      formData.set(key, value);
    } else if (value instanceof Date) {
      formData.set(key, value.toUTCString());
    } else if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(
          key,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          parsedKey === "body" ? JSON.stringify(item) : item,
        );
      }
    } else if (value) {
      formData.set(key, String(value));
    }
  }

  return apiClient.patch<Blog>("blogs/" + id, formData).then((r) => r.data);
};
