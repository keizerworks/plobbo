import { useMemo, useState } from "react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { motion } from "motion/react";

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
      {stories.length === 0 ? (
        <section className="max-w-7xl mx-auto relative h-full w-full flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-[70px] z-20 " />
          <BackgroundGradient />
          <div className="flex flex-col justify-center items-center relative z-50 -translate-y-10">
            <div className="text-center">
              <h1 className="text-[55px] font-semibold tracking-tight flex flex-wrap justify-center">
                {["Let's", "Make", "Story"].map((word, index) => (
                  <motion.span
                    key={index}
                    className="mx-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      mass: 1,
                      delay: index * 0.04,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                className="text-black"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  mass: 1,
                  delay: 0.3,
                }}
              >
                Where ideas turn into stories worth telling
              </motion.p>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                mass: 1,
                delay: 0.5,
              }}
              className="mt-4"
            >
              <CreateBlog />
            </motion.div>
          </div>
        </section>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}

const BackgroundGradient = () => {
  return (
    <motion.svg
      className="absolute opacity-50 scale-75 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#a8d5ba">
            <animate
              attributeName="stop-color"
              values="#a8d5ba; #a0e4f1; #a8d5ba"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="33%" stop-color="#7fb695">
            <animate
              attributeName="stop-color"
              values="#7fb695; #7dcfe9; #7fb695"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="66%" stop-color="#6a9c78">
            <animate
              attributeName="stop-color"
              values="#6a9c78; #5cbcd2; #6a9c78"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stop-color="#d2e7d6">
            <animate
              attributeName="stop-color"
              values="#d2e7d6; #c5f0f9; #d2e7d6"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="white" />
      <circle cx="400" cy="300" r="300" fill="url(#grad)" filter="url(#blur)" />
    </motion.svg>
  );
};
