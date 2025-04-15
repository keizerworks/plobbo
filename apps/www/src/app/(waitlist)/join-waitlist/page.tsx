"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import JoinWaitlistForm from "~/components/join-waitlist/form";

export default function Page() {
  const headlineText = ["Experience the future of", "Effortless Blogging"];
  const headlineTextSm = ["Experience the future of Effortless Blogging"];

  const descriptionLines = [
    "The first open-source platform that prioritizes your creativity and freedom. We turn",
    "your audience into a thriving brand with AI blogging, built-in SEO, and a minimalist UI",
  ];

  const descriptionLinesSm = [
    `The first open-source platform that prioritizes your creativity and freedom. We turn
    your audience into a thriving brand with AI blogging, built-in SEO, and a minimalist UI`,
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const lineVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const descriptionContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 1.2,
      },
    },
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 1.5,
      },
    },
  };

  const imageVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 1.9,
      },
    },
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center justify-start px-4 pb-8 pt-6 text-center transition-all sm:px-6 sm:pt-24 md:pt-32 lg:pt-16">
      <motion.h1
        className="font-bold mt-4 flex flex-col gap-1 text-3xl capitalize leading-tight tracking-tighter sm:mt-6 sm:text-5xl sm:leading-[1.1] md:text-6xl md:leading-[1]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {headlineText.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line.split(" ").map((word, idx) => (
              <motion.span
                key={idx}
                className="mr-1 hidden md:mr-2 md:inline-block"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </span>
        ))}
        {headlineTextSm.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line.split(" ").map((word, idx) => (
              <motion.span
                key={idx}
                className="mr-1 inline-block md:mr-2 md:hidden"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>

      <motion.p
        className="mt-2 text-xs sm:mt-4 sm:max-w-md sm:text-base md:max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={descriptionContainerVariants}
      >
        {descriptionLines.map((line, lineIdx) => (
          <motion.span
            key={lineIdx}
            className="hidden md:block"
            variants={lineVariants}
          >
            {line}
          </motion.span>
        ))}
        {descriptionLinesSm.map((line, lineIdx) => (
          <motion.span
            key={lineIdx}
            className="block md:hidden"
            variants={lineVariants}
          >
            {line}
          </motion.span>
        ))}
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="mt-4 w-full max-w-xs sm:mt-6 sm:max-w-sm md:max-w-md"
      >
        <JoinWaitlistForm />
      </motion.div>

      <motion.div
        className="group relative isolate mx-auto my-8 w-full max-w-5xl lg:my-16"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <div className="aspect-video min-h-[100px] w-full sm:h-auto sm:min-h-[200px] md:min-h-[300px] lg:min-h-[500px]">
          <Image
            src="/assets/wishlist.png"
            alt="Plobbo Platform Preview"
            fill
            sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
            className="z-50 rounded-md object-cover shadow-md dark:opacity-90 sm:rounded-lg sm:shadow-xl md:rounded-2xl md:shadow-2xl"
            priority
          />
          <Image
            src="/assets/wishlist.png"
            alt="Plobbo Platform Preview"
            fill
            sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
            className="z-0 scale-[1.05] rounded-md object-cover opacity-20 shadow-md blur-xl transition-all duration-300 sm:rounded-lg sm:shadow-xl md:rounded-2xl"
          />
        </div>
      </motion.div>
    </main>
  );
}
