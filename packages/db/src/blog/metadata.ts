import type { InferSelectModel } from "drizzle-orm";

import type { BlogMetadataTable } from "./blog.sql";

export namespace BlogMetadata {
  export type Model = InferSelectModel<typeof BlogMetadataTable>;
}
