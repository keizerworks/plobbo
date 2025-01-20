import { createBlogMetadataHandler } from "trpc/handlers/blog-metadata/create";
import { updateBlogMetadataHandler } from "trpc/handlers/blog-metadata/update";

export const blogMetadataRouter = {
  create: createBlogMetadataHandler,  
  update: updateBlogMetadataHandler,
};
