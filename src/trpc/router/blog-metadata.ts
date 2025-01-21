import { getBlogMetadataHandler } from "trpc/handlers/blog-metadata/get";
import { upsertBlogMetadataHandler } from "trpc/handlers/blog-metadata/upsert-metadata";

export const blogMetadataRouter = {
  upsert: upsertBlogMetadataHandler,
  get: getBlogMetadataHandler,
};
