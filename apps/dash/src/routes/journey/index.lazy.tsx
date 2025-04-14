import { FormEvent, useState } from "react";
import {
  createLazyFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { motion } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/plate-ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuthStore } from "~/store/auth";

export const Route = createLazyFileRoute("/journey/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profile } = useAuthStore();
  const { activeOrgId } = useLoaderData({ from: "/journey/" });
  const journey = false;
  return (
    <main className="mx-auto flex w-full flex-col h-full">
      {/* <div className="border-b"> */}
      {/*   <header className="flex items-center max-w-[1536px] mx-auto p-8 gap-x-2 justify-between w-full"> */}
      {/*     <h1 className="font-semibold text-4xl tracking-tighter "> */}
      {/*       Welcome {profile?.name ? profile?.name : "back"}, Let's track your */}
      {/*       journey. */}
      {/*     </h1> */}
      {/*     <div className="flex items-center gap-2"> */}
      {/*       <CreateBlog /> */}
      {/*     </div> */}
      {/*   </header> */}
      {/* </div> */}
      {/* <BlogsTable /> */}

      <section className="max-w-7xl mx-auto relative h-full w-full flex items-center justify-center">
        <div className="absolute inset-0 backdrop-blur-[70px] z-20 " />
        <BackgroundGradient />
        <div className="flex flex-col justify-center items-center relative z-50 -translate-y-10">
          <div className="text-center">
            <h1 className="text-[55px] font-semibold tracking-tight flex flex-wrap justify-center">
              {["Welcome", "To", "Plobbo"].map((word, index) => (
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
              It's time to add a new Journey
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
          >
            <CreateJourney />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const BackgroundGradient = () => {
  return (
    <motion.svg
      className="absolute opacity-80 scale-75 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
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
          <stop offset="0%" stop-color="#a896ff">
            <animate
              attributeName="stop-color"
              values="#a896ff; #67e8f9; #a896ff"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="33%" stop-color="#9370db">
            <animate
              attributeName="stop-color"
              values="#9370db; #70D7F6; #9370db"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="66%" stop-color="#70D7F6">
            <animate
              attributeName="stop-color"
              values="#70D7F6; #9370db; #70D7F6"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stop-color="#67e8f9">
            <animate
              attributeName="stop-color"
              values="#67e8f9; #a896ff; #67e8f9"
              dur="4s"
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

const CreateJourney = () => {
  const [journeyName, setJourneyName] = useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (journeyName.trim().length === 0) return;
    navigate({
      to: "/journey/$journey-id",
      params: { "journey-id": journeyName },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-fit mt-4 rounded-full">Create Now</Button>
      </DialogTrigger>
      <DialogContent className="bg-white/80 backdrop-blur-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-4xl tracking-tighter">
              Let's start your journey
            </DialogTitle>
            <DialogDescription>Create your first journey</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <Input
                id="title"
                placeholder="Enter your journey name..."
                className="font-semibold tracking-tight"
                onChange={(e) => setJourneyName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
