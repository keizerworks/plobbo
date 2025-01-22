import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";
import { uuidv7 } from "uuidv7";

export type InsertBlogMetadataInterface = Omit<
  Insertable<DB["blog_metadata"]>,
  "id"
>;

// Insert metadata for a blog
export const insertBlogMetadata = async (
  values: InsertBlogMetadataInterface,
) => {
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
export const getBlogMetadata = async (
  props: { id: string } | { blog_id: string },
) => {
  return await db
    .selectFrom("blog_metadata")
    .selectAll()
    .$if("id" in props, (qb) =>
      qb.where("id", "=", (props as { id: string }).id),
    )
    .$if("blogId" in props, (qb) =>
      qb.where("blog_id", "=", (props as { blog_id: string }).blog_id),
    )
    .executeTakeFirst(); // Return null if no result is found
};

// Update metadata for a blog
export const updateBlogMetadata = async (
  id: string,
  values: Partial<Omit<InsertBlogMetadataInterface, "blog_id" | "id">>, // Ensure `blog_id` is excluded
) => {
  try {
    return await db
      .updateTable("blog_metadata")
      .where("id", "=", id)
      .set(values)
      .executeTakeFirstOrThrow();
  } catch (error) {
    console.error(`Error updating metadata for id ${id}:`, error);
    throw new Error("Failed to update blog metadata.");
  }
};

// Delete metadata for a blog
export const deleteBlogMetadata = async (id: string) => {
  try {
    return await db.deleteFrom("blog_metadata").where("id", "=", id).execute();
  } catch (error) {
    console.error(`Error deleting metadata for blogId ${id}:`, error);
    throw new Error("Failed to delete blog metadata.");
  }
};
