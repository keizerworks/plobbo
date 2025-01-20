import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";
import { uuidv7 } from "uuidv7";

export type InsertBlogMetadataInterface = Omit<Insertable<DB["blog_metadata"]>, "id">;

// Insert metadata for a blog
export const insertBlogMetadata = async (values: InsertBlogMetadataInterface) => {
  try {
    return await db
      .insertInto("blog_metadata")
      .values({ ...values, id: uuidv7() })
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    console.error("Error inserting blog metadata:", error);
    throw new Error("Failed to insert blog metadata.");
  }
};

// Retrieve metadata for a specific blog
export const getBlogMetadata = async (blogId: string) => {
  try {
    return await db
      .selectFrom("blog_metadata")
      .selectAll()
      .where("blog_id", "=", blogId)
      .executeTakeFirstOrThrow();
  } catch (error) {
    console.error(`Error fetching metadata for blogId ${blogId}:`, error);
    throw new Error("Failed to fetch blog metadata.");
  }
};

// Update metadata for a blog
export const updateBlogMetadata = async (
  blogId: string,
  values: Partial<Omit<InsertBlogMetadataInterface, "blog_id">> // Ensure `blog_id` is excluded
) => {
  try {
    return await db
      .updateTable("blog_metadata")
      .where("blog_id", "=", blogId)
      .set(values)
      .executeTakeFirstOrThrow();
  } catch (error) {
    console.error(`Error updating metadata for blogId ${blogId}:`, error);
    throw new Error("Failed to update blog metadata.");
  }
};

// Delete metadata for a blog
export const deleteBlogMetadata = async (blogId: string) => {
  try {
    return await db
      .deleteFrom("blog_metadata")
      .where("blog_id", "=", blogId)
      .execute();
  } catch (error) {
    console.error(`Error deleting metadata for blogId ${blogId}:`, error);
    throw new Error("Failed to delete blog metadata.");
  }
};
