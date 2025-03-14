import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { and, db, eq } from "@plobbo/db";
import { BlogMetadataTable, BlogTable } from "@plobbo/db/blog/blog.sql";
import { Blog } from "@plobbo/db/blog/index";
import { OrganizationTable } from "@plobbo/db/organization/organization.sql";

interface Props {
  params: Promise<{ "org-slug": string }>;
}

export default async function Page({ params }: Props) {
  const { "org-slug": slug } = await params;
  const [blogs, [organization]] = await Promise.all([
    db
      .select({ ...Blog.columns, description: BlogMetadataTable.description })
      .from(BlogTable)
      .innerJoin(
        OrganizationTable,
        eq(BlogTable.organizationId, OrganizationTable.id),
      )
      .innerJoin(BlogMetadataTable, eq(BlogTable.id, BlogMetadataTable.blogId))
      .where(
        and(
          eq(BlogTable.status, "PUBLISHED"),
          eq(OrganizationTable.slug, slug),
        ),
      )
      .limit(10),
    db
      .select()
      .from(OrganizationTable)
      .limit(1)
      .where(eq(OrganizationTable.slug, slug)),
  ]);

  if (!organization) {
    notFound();
  }

  console.log(blogs);

  return (
    <div className="mx-auto min-h-dvh max-w-5xl border-l border-r">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-x-3 bg-muted px-4 py-4">
        <div className="relative aspect-square size-8 overflow-hidden">
          <Image
            fill
            src={organization.logo}
            alt={organization.slug}
            className="object-cover"
          />
        </div>
        <h5 className="font-bold">{organization.name}</h5>
      </header>

      <main className="mx-auto w-full max-w-4xl py-12">
        {blogs.map((blog) => (
          <Link
            href={"/" + organization.slug + "/" + blog.slug}
            className="flex items-start gap-x-4"
            key={organization.slug + "_" + blog.slug}
          >
            {blog.image ? (
              <div className="relative aspect-video h-44 overflow-hidden rounded-md">
                <Image
                  className="object-cover"
                  fill
                  src={blog.image}
                  alt={blog.slug}
                />
              </div>
            ) : null}

            <div className="flex-1 space-y-1.5 py-2">
              <h3 className="line-clamp-2 scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
                {blog.title}
              </h3>

              <p className="line-clamp-3 text-base">
                {blog.description.length
                  ? blog.description
                  : "In this post, we will upgrade the tooling config of an AdonisJS application to use the latest version of ESLint, move to the maintained fork of ts-node, and update the prettier config to format Edge templates."}
              </p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
