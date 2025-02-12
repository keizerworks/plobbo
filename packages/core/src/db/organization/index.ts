import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  count as drizzleCount,
  eq,
  getTableColumns,
  getTableName,
} from "drizzle-orm";
import { z } from "zod";

import type { Drizzle } from "../drizzle";
import { OrganizationMemberTable, OrganizationTable } from "./organization.sql";

export namespace Organization {
  export type Model = InferSelectModel<typeof OrganizationTable>;
  export type CreateInput = InferInsertModel<typeof OrganizationTable>;
  export type UpdateInput = Partial<CreateInput> & { id: Model["id"] };

  export interface Filters {
    userId: string;
  }

  export const tableName = getTableName(OrganizationTable);

  export const createSchema = z.object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      }),
    logo: z.instanceof(File),
  });

  export const updateSchema = z.object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      }),
    logo: z.instanceof(File).optional(),
  });

  export async function create(db: Drizzle, values: CreateInput) {
    return (await db.insert(OrganizationTable).values(values).returning())[0];
  }

  export async function update(db: Drizzle, { id, ...input }: UpdateInput) {
    const [organization] = await db
      .update(OrganizationTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(OrganizationTable.id, id))
      .returning();
    return organization;
  }

  export async function findById(
    db: Drizzle,
    id: string,
  ): Promise<Model | undefined> {
    const [organization] = await db
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);
    return organization;
  }

  export async function findBySlug(
    db: Drizzle,
    slug: string,
  ): Promise<Model | undefined> {
    const [organization] = await db
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.slug, slug))
      .limit(1);
    return organization;
  }

  export async function findAllByUserId(db: Drizzle, filters: Filters) {
    let query = db
      .select({ ...getTableColumns(OrganizationTable) })
      .from(OrganizationTable)
      .$dynamic();

    if (filters.userId) {
      query = query
        .innerJoin(
          OrganizationMemberTable,
          eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
        )
        .where(eq(OrganizationMemberTable.userId, filters.userId));
    }

    return query;
  }

  export const count = async (db: Drizzle, filters: Filters) => {
    let query = db
      .select({ count: drizzleCount() })
      .from(OrganizationTable)
      .$dynamic();

    if (filters.userId) {
      query = query
        .innerJoin(
          OrganizationMemberTable,
          eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
        )
        .where(eq(OrganizationMemberTable.userId, filters.userId));
    }

    const res = (await query)[0];
    return res?.count ?? 0;
  };

  export async function remove(db: Drizzle, id: string): Promise<void> {
    await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));
  }
}
