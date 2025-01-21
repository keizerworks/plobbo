import { getBlogMetadata } from "repository/blog-metadata";
import { protectedOrgProcedure } from "trpc";
import { z } from "zod";

export const getBlogMetadataHandler = protectedOrgProcedure
  .input(z.string()) // Validating input as a string
  .query(async ({ input }) => {
    try {
      const blogMetadata = await getBlogMetadata(input); // Pass the ID
      if (!blogMetadata) {
        return { message: "No metadata found for this blog ID" }; // Or handle as needed
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
