import cache from "@plobbo/cache";
import { db, eq } from "@plobbo/db";
import { Organization } from "@plobbo/db/organization/index";
import {
  OrganizationDomainTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";

import "server-only";

export async function getOrgSlugFromCustomDomain(domain: string) {
  const cacheKey = `domain:${domain}`;
  let orgSlug = await cache.get(cacheKey);

  if (!orgSlug) {
    const record = (
      await db
        .select(Organization.columns)
        .from(OrganizationTable)
        .innerJoin(
          OrganizationDomainTable,
          eq(OrganizationTable.id, OrganizationDomainTable.organizationId),
        )
        .where(eq(OrganizationDomainTable.domain, domain))
        .limit(1)
    )[0];

    if (!record) return null;
    await cache.set(cacheKey, record.slug);
    orgSlug = record.slug;
  }

  return orgSlug;
}
