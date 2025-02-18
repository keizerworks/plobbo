// import BlogMetadataForm from "~/components/blogs/metadata/upsert";
import { SidebarTrigger } from "./sidebar";

export default function DashboardHeader() {
  // const pathname = useLocation().pathname;
  // const blogId = useParams({ strict: false, select: (s) => s.id });

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="mr-auto -ml-1" />

      {/* {pathname.includes("/blogs/") && blogId ? ( */}
      {/*   <BlogMetadataForm blogId={blogId} /> */}
      {/* ) : null} */}
    </header>
  );
}
