import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { baseTable } from "../base";

export const UserTable = pgTable("user", {
  ...baseTable,
  email: varchar().notNull().unique(),
  name: varchar().notNull(),
  emailVerified: boolean().notNull().default(false),
  recoveryCode: varchar(),
  passwordHash: text(),
});

export const UserMetadataTable = pgTable("user_metadata", {
  ...baseTable,

  // Separate metadata table to support multiple profiles for the same user
  // For example, a user might want different display names, profile images,
  // or bios when acting as an author in different organizations
  //
  userId: uuid()
    .notNull()
    .references(() => UserTable.id),
  displayName: varchar(),
  profileImage: varchar(),
  bio: text(),
  location: varchar(),
  timezone: varchar(),
  language: varchar(),
  preferences: jsonb(),
  socialLinks: jsonb(), // {twitter: "", github: "", linkedin: "", etc}
  customFields: jsonb(), // For any additional user-specific data
});

export type UserInterface = InferSelectModel<typeof UserTable>;
export type CreateUserInterface = InferInsertModel<typeof UserTable>;
