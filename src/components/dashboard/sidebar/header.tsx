"use client";

import { useParams, usePathname } from "next/navigation";

import BlogMetadataForm from "~/components/blogs/metadata/upsert";
import { SidebarTrigger } from "~/components/dashboard/sidebar/sidebar";

export default function DashboardHeader() {
    const pathname = usePathname();
    const blogId = useParams().blog_id as string;

    return (
        <header className="flex h-12 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 mr-auto" />

            {pathname.includes("/blogs/") && blogId ? (
                <BlogMetadataForm blogId={blogId} />
            ) : null}
        </header>
    );
}
