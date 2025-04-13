import { createLazyFileRoute } from "@tanstack/react-router";

import { CreateBlog } from "~/components/blogs/create";
import { BlogsTable } from "~/components/blogs/list";
import { DateRangePicker } from "~/components/filters/date-filter";
import { useAuthStore } from "~/store/auth";

export const Route = createLazyFileRoute("/journey/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profile } = useAuthStore();
  return (
    <main className="mx-auto flex w-full flex-col">
      <div className="border-b">
        <header className="flex items-center max-w-[1536px] mx-auto p-8 gap-x-2 justify-between w-full">
          <h1 className="font-semibold text-4xl tracking-tighter ">
            Welcome {profile?.name ? profile?.name : "back"}, Let's track your
            journey.
          </h1>
          <div className="flex items-center gap-2">
            <CreateBlog />
          </div>
        </header>
      </div>
      <BlogsTable />
    </main>
  );
}
