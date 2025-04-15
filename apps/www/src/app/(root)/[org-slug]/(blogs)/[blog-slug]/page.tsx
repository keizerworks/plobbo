import Image from "next/image";
import Link from "next/link";
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

import ThemeSwitcher from "~/components/theme-switcher";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ "org-slug": string; "blog-slug": string }>;
}

export default async function Page({ params }: Props) {
  const { "org-slug": orgSlug, "blog-slug": blogSlug } = await params;

  const [blog] = await db
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
    .leftJoin(
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
    );

  if (!blog?.publishedBody) {
    notFound();
  }

  const editor = createSlateEditor({
    plugins,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: blog.publishedBody as any,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 border-b border-neutral-800 z-10 flex w-full items-center bg-muted/30 px-4 py-2 backdrop-blur-md">
        <div className="max-w-5xl w-full flex items-center justify-between mx-auto">
          <div className="max-w-5xl flex items-center gap-2">
            <div className="relative aspect-square size-8 overflow-hidden">
              <Image
                fill
                src={blog.organization.logo}
                alt={blog.organization.slug}
                className="rounded-full object-cover"
              />
            </div>
            <h5 className="font-semibold">
              <Link href={blog.organization.slug}>
                {blog.organization.name}
              </Link>
            </h5>{" "}
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-12 pb-[200px]">
        <div className="space-y-2">
          <h1 className="font-bold text-[48px]">{blog.title}</h1>
          <p>{blog.metadata.description}</p>

          {blog.image ? (
            <div className="relative aspect-[16_/_6] w-full overflow-hidden rounded-sm">
              <Image
                src={blog.image}
                alt={blog.slug}
                fill
                className="object-cover"
              />
            </div>
          ) : null}
        </div>

        <EditorStatic
          components={components}
          editor={editor}
          variant="fullWidth"
          className="unset"
        />
      </main>
    </div>
  );
}
