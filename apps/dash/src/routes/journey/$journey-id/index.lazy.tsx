import { useMemo, useState } from "react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { CreateBlog } from "~/components/blogs/create";
import { StoryCard } from "~/components/blogs/story-card";
import { Input } from "~/components/ui/input";

export const Route = createLazyFileRoute("/journey/$journey-id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { stories, journey } = Route.useLoaderData();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const handleSearch = (name: string) => {
    setName(name);
    navigate({
      to: "/journey/$journey-id",
      params: { "journey-id": journey.id },
      search: { name: name.length > 0 ? name : undefined },
    }).catch(console.error);
  };
  const filteredStories = useMemo(() => {
    return stories.filter((journey) =>
      journey.title.toLowerCase().includes(name),
    );
  }, [stories, name]);

  return (
    <main className="flex size-full flex-col max-h-[calc(100dvh-60px)] overflow-y-scroll">
      <div className="border-b">
        <header className="flex lg:flex-row gap-4 flex-col lg:items-center items-start max-w-[1536px] mx-auto p-8 gap-x-2 justify-between w-full">
          <div className="max-w-4xl flex flex-col gap-3">
            <h1 className="font-semibold text-4xl tracking-tighter ">
              {journey.title}
            </h1>
            <small className="text-sm ">
              {journey.description ?? "A story to remember"}
            </small>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <CreateBlog />
          </div>
        </header>
      </div>

      <div className="border-b bg-white z-30 top-0 sticky">
        <div className="max-w-[1536px] grid grid-cols-1 md:grid-cols-2 mx-auto w-full py-4 px-8">
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
      <div className="max-w-[1536px] mx-auto w-full p-8 flex flex-col">
        {filteredStories.map((story, index) => (
          <StoryCard
            length={filteredStories.length}
            index={index}
            key={story.id}
            id={story.id}
            title={story.title}
            description=""
            date={story.createdAt?.toLocaleString() || ""}
            status={story.status}
            imageSrc={story.image}
            imageAlt={story.title}
            initials={"sm"}
            slug={story.slug}
          />
        ))}
      </div>
    </main>
  );
}
