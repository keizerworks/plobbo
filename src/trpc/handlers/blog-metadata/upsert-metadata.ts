import { TRPCError } from "@trpc/server";
import {
  getBlogMetadata,
  insertBlogMetadata,
  updateBlogMetadata,
} from "repository/blog-metadata";
import { protectedOrgProcedure } from "trpc";
import { createBlogMetadataSchema } from "validators/blog-metadata/create";
import { updateBlogMetadataSchema } from "validators/blog-metadata/update";
import { upsertBlogMetadataInputSchema } from "validators/blog-metadata/upsert-metadata";

export const upsertBlogMetadataHandler = protectedOrgProcedure
  .input(upsertBlogMetadataInputSchema)
  .mutation(async ({ input }) => {
    const { blog_id, metadata } = input;

    try {
      const existingMetadata = await getBlogMetadata(blog_id);

      // If exists then tupdate
      if (existingMetadata) {
        const validatedData = updateBlogMetadataSchema.parse(metadata);
        await updateBlogMetadata(blog_id, validatedData);
        return { success: true, message: "Metadata updated successfully" };
      }

      // If not exists then create
      const validatedData = createBlogMetadataSchema.parse({
        ...metadata,
        blog_id,
      });
      const newMetadata = await insertBlogMetadata(validatedData);
      return {
        success: true,
        message: "Metadata created successfully",
        data: newMetadata,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upsert blog metadata",
        cause: error,
      });
    }
  });
