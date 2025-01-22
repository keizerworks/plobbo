import { TRPCError } from "@trpc/server";
import {
  getBlogMetadata,
  insertBlogMetadata,
  updateBlogMetadata,
} from "repository/blog-metadata";
import { protectedOrgProcedure } from "trpc";
import { upsertBlogMetadataInputSchema } from "validators/blog-metadata/upsert";

export const upsertBlogMetadataHandler = protectedOrgProcedure
  .input(upsertBlogMetadataInputSchema)
  .mutation(async ({ input }) => {
    const { blog_id, ...metadata } = input;

    try {
      const existingMetadata = await getBlogMetadata({ blog_id });
      if (existingMetadata) {
        await updateBlogMetadata(existingMetadata.id, metadata);
        return { message: "Metadata updated successfully" };
      }

      const newMetadata = await insertBlogMetadata(input);
      return {
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
