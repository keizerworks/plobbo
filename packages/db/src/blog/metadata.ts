import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { db, eq } from "../index";
import { BlogMetadataTable } from "./blog.sql";

export namespace BlogMetadata {
  export type Model = InferSelectModel<typeof BlogMetadataTable>;
  export type Create = InferInsertModel<typeof BlogMetadataTable>;
  export type Update = Partial<Omit<Create, "blogId">> & {
    blogId: Create["blogId"];
  };

  export async function create(values: Create) {
    return (await db.insert(BlogMetadataTable).values(values).returning())[0];
  }

  export async function update({ blogId, ...values }: Update) {
    return (
      await db
        .update(BlogMetadataTable)
        .set(values)
        .where(eq(BlogMetadataTable.blogId, blogId))
        .returning()
    )[0];
  }

  export async function findUnique(blogId: Model["blogId"]) {
    return (
      await db
        .select()
        .from(BlogMetadataTable)
        .where(eq(BlogMetadataTable.blogId, blogId))
        .limit(1)
    )[0];
  }
}
