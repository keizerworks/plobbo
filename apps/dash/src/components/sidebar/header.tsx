import { useParams } from "@tanstack/react-router";

import UpdateBlogMetadataForm from "../blogs/metadata/update";
import PublishBlog from "../blogs/publish";
import { SidebarTrigger } from "./sidebar";

export default function DashboardHeader() {
  const blogId = useParams({ strict: false, select: (s) => s["blog-id"] });
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="mr-auto -ml-1" />

      <div className="ml-auto flex items-center gap-2">
        <PublishBlog />
        {blogId ? <UpdateBlogMetadataForm /> : null}
      </div>
    </header>
  );
}
