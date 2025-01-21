import { TRPCError } from "@trpc/server";
import { getBlogMetadata } from "repository/blog-metadata";
import { protectedOrgProcedure } from "trpc";
import { getBlogMetadataSchema } from "validators/blog-metadata/get";

export const getBlogMetadataHandler = protectedOrgProcedure
  .input(getBlogMetadataSchema) // Validating input as a string
  .query(async ({ input }) => {
    try {
      const blogMetadata = await getBlogMetadata(input); // Pass the ID

      if (!blogMetadata) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No metadata found for this blog ID",
        });
      }

      return blogMetadata;
    } catch (error) {
      console.error("Error fetching blog metadata:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve blog metadata: ${error.message}`);
      } else {
        throw new Error(
          "Failed to retrieve blog metadata due to an unknown error",
        );
      }
    }
  });
