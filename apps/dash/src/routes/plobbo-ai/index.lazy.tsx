import { createLazyFileRoute } from "@tanstack/react-router";
import { Stars, WandSparkles } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export const Route = createLazyFileRoute("/plobbo-ai/")({
  component: RouteComponent,
});

function RouteComponent() {
  const prompts = ["Generate Ocean", "Analyze", "Research", "Generate Story"];
  return (
    <section className="max-h-[calc(100dvh-60px)] h-full bg-white justify-between flex flex-col">
      <div className="flex-1 relative h-full flex items-center justify-center px-8 pt-8">
        <div className="inset-0 backdrop-blur-3xl z-40 absolute" />
        <BackgroundGradient />
        <div className="text-center relative z-50">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 12,
              mass: 1,
            }}
            className="text-5xl flex justify-center items-center gap-2 font-semibold"
          >
            <Stars size={38} />
            Plobbo Ai
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 12,
              mass: 1,
              delay: 0.2,
            }}
            className="text-base font-medium"
          >
            Let's Brainstorm with your Ai buddy in plobbo
          </motion.p>
          <div className="space-x-2 pt-2">
            {prompts.map((prompt, index) => {
              return (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    mass: 1,
                    delay: 0.45 + index * 0.04,
                  }}
                  className="inline-block"
                >
                  <Button
                    key={prompt}
                    size="sm"
                    variant="outline"
                    className="bg-background/60"
                  >
                    {prompt}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <footer className="flex relative max-w-[1536px] px-8 pb-8 mx-auto gap-x-2 justify-between w-full">
        <div className="bg-[#FAF9F7] border p-4 rounded-md flex items-end w-full flex-col">
          <Textarea
            placeholder="Enter what you want plobbo ai to do..."
            className="bg-[#FAF9F7] resize-none p-0 h-12 outline-none border-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-neutral-600 shadow-none font-medium tracking-tight"
          />
          <Button className="rounded-full">
            <WandSparkles />
            Submit
          </Button>
        </div>
      </footer>
    </section>
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
          <stop offset="0%" stop-color="#ECEFEB">
            <animate
              attributeName="stop-color"
              values="#a8d5ba; #a0e4f1; #BDC9B8"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="33%" stop-color="#a8d5ba">
            <animate
              attributeName="stop-color"
              values="#7fb695; #7dcfe9; #7fb695"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="66%" stop-color="#F8EBEC">
            <animate
              attributeName="stop-color"
              values="#6a9c78; #5cbcd2; #6a9c78"
              dur="12s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stop-color="#E6C5C5">
            <animate
              attributeName="stop-color"
              values="#d2e7d6; #c5f0f9; #E6C5C5"
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
