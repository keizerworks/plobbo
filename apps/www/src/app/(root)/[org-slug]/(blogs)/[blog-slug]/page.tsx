import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

import type { BlogMetadata } from "@plobbo/db/blog/metadata";
import type { Organization } from "@plobbo/db/organization/index";
import { and, db, eq, or, sql } from "@plobbo/db";
import { BlogMetadataTable, BlogTable } from "@plobbo/db/blog/blog.sql";
import { Blog } from "@plobbo/db/blog/index";
import {
  OrganizationDomainTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";
import { EditorStatic } from "@plobbo/plate-ui/components/editor-static";
import { components, createSlateEditor, plugins } from "@plobbo/plate-ui/index";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ "org-slug": string; "blog-slug": string }>;
}

export default async function Page({ params }: Props) {
  const { "org-slug": orgSlug, "blog-slug": blogSlug } = await params;

  const [blog] = await unstable_cache(
    async () =>
      await db
        .select({
          ...Blog.columns,
          metadata: sql<BlogMetadata.Model>`(
            SELECT to_json(obj)
            FROM (
              SELECT *
              FROM ${BlogMetadataTable}
              WHERE ${BlogMetadataTable.blogId} = ${BlogTable.id}
            ) AS obj
          )`.as("metadata"),
          organization: sql<Organization.Model>`(
            SELECT to_json(obj)
            FROM (
              SELECT *
              FROM ${OrganizationTable}
              WHERE ${OrganizationTable.id} = ${BlogTable.organizationId}
            ) AS obj
          )`.as("organization"),
        })
        .from(BlogTable)
        .innerJoin(
          OrganizationTable,
          eq(BlogTable.organizationId, OrganizationTable.id),
        )
        .innerJoin(
          OrganizationDomainTable,
          eq(OrganizationDomainTable.organizationId, OrganizationTable.id),
        )
        .limit(1)
        .where(
          and(
            eq(BlogTable.status, "PUBLISHED"),
            eq(BlogTable.slug, blogSlug),
            or(
              eq(OrganizationTable.slug, orgSlug),
              eq(OrganizationDomainTable.domain, orgSlug),
            ),
          ),
        ),
    [blogSlug],
    { revalidate: 3600, tags: [blogSlug] },
  )();

  console.log(blog);
  if (!blog?.publishedBody) {
    notFound();
  }

  const editor = createSlateEditor({
    plugins,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: blog.publishedBody as any,
  });

  return (
    <div className="mx-auto min-h-dvh max-w-5xl border-l border-r">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-x-3 bg-muted px-4 py-4">
        <div className="relative aspect-square size-8 overflow-hidden">
          <Image
            fill
            src={blog.organization.logo}
            alt={blog.organization.slug}
            className="object-cover"
          />
        </div>
        <h5 className="font-bold">{blog.organization.name}</h5>
      </header>

      <main className="mx-auto w-full max-w-4xl space-y-8 py-12">
        <div className="space-y-2">
          <h1>{blog.title}</h1>
          <p>{blog.metadata.description}</p>

          {blog.image ? (
            <div className="relative aspect-[16_/_6] w-full overflow-hidden rounded-md">
              <Image
                src={blog.image}
                alt={blog.slug}
                fill
                className="object-cover"
              />
            </div>
          ) : null}
        </div>

        <EditorStatic components={components} editor={editor} />
      </main>
    </div>
  );
}
