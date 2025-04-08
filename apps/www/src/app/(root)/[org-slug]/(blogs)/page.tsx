import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { and, db, eq } from "@plobbo/db";
import { BlogMetadataTable, BlogTable } from "@plobbo/db/blog/blog.sql";
import { Blog } from "@plobbo/db/blog/index";
import { OrganizationTable } from "@plobbo/db/organization/organization.sql";
import { Separator } from "@plobbo/ui/components/separato";

import ThemeSwitcher from "~/components/theme-switcher";

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

  return (
    <>
      <header className="sticky top-0 z-50 mx-auto w-full items-center justify-between gap-x-3 bg-muted/20 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative aspect-square size-8 overflow-hidden">
              <Image
                fill
                src={organization.logo}
                alt={organization.slug}
                className="rounded-full object-cover"
              />
            </div>
            <h5 className="font-semibold">{organization.name}</h5>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      <div className="mx-auto max-w-6xl">
        <main className="mx-auto w-full max-w-5xl px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {blogs.map((blog) => (
              <Link
                href={"/" + organization.slug + "/" + blog.slug}
                className="group relative flex h-full flex-col overflow-hidden rounded bg-white shadow-sm ring-1 ring-neutral-200 transition duration-300 hover:shadow-md hover:ring-neutral-300 dark:bg-neutral-900 dark:ring-neutral-800 dark:hover:ring-neutral-700"
                key={organization.slug + "_" + blog.slug}
              >
                <div className="relative aspect-[2/1] w-full overflow-hidden">
                  {blog.image ? (
                    <Image
                      className="object-cover transition-all duration-150 will-change-transform group-hover:scale-105"
                      fill
                      src={blog.image}
                      alt={blog.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950" />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div className="space-y-3">
                    <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
                      {blog.title}
                    </h3>

                    <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {blog.description ||
                        "In this post, we will upgrade the tooling config of an AdonisJS application to use the latest version of ESLint, move to the maintained fork of ts-node, and update the prettier config to format Edge templates."}
                    </p>
                  </div>

                  <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center">
                      Read more
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
