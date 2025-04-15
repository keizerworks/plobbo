import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { CreateBlog } from "~/components/blogs/create";
import { Input } from "~/components/ui/input";

export const Route = createLazyFileRoute("/journey/$journey-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const journey = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSearch = (name: string) => {
    navigate({
      to: "/journey/$journey-id",
      params: { "journey-id": journey.id },
      search: { name: name.length > 0 ? name : undefined },
    }).catch(console.error);
  };

  return (
    <main className="flex size-full flex-col">
      <div className="border-b">
        <header className="flex items-center max-w-[1536px] mx-auto p-8 gap-x-2 justify-between w-full">
          <div>
            <h1 className="font-semibold text-4xl tracking-tighter ">
              {journey.title}
            </h1>
            <small className="text-sm">
              {journey.description ?? "A story to remember"}
            </small>
          </div>

          <div className="flex items-center gap-2">
            <CreateBlog />
          </div>
        </header>
      </div>

      <div className="border-b">
        <div className="max-w-[1536px] grid grid-cols-2 mx-auto w-full py-4 px-8">
          <div className="relative">
            <Input
              placeholder="Find your documented journey..."
              className="bg-[#F6F6F6] outline-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-neutral-600 font-medium tracking-tight"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-2 text-neutral-600">
              <Search size={18} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
