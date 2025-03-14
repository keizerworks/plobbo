import type { PutBlogMetadataInterface } from "@plobbo/validator/blog/metadata/put";

import type { BlogMetadata } from "~/interface/blog";
import apiClient from "~/lib/axios";

import { patchBlogs } from "./index";

export async function getBlogMetadata(blogId: string) {
  return apiClient
    .get<BlogMetadata | null>("blogs/" + blogId + "/metadata")
    .then((res) => res.data);
}

export async function putBlogMetadata({
  title,
  image,
  slug,
  ...metadata
}: PutBlogMetadataInterface) {
  return await Promise.all([
    apiClient.put("blogs/" + metadata.blogId + "/metadata", metadata),
    patchBlogs(metadata.blogId, { title, slug, image }),
  ]);
}
