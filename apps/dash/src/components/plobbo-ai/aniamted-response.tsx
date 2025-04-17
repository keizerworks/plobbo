import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

import { Plobbo } from "~/assets/plobbo";

// Types
interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
}

interface AnimatedListItemProps {
  children: string;
  index: number;
}

// Animated typing effect for AI responses
const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  speed = 20,
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (currentIndex < text.length) {
      timeout = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        },
        delay + (currentIndex === 0 ? 0 : speed),
      );
    } else {
      setIsComplete(true);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Animated list items with staggered entry
const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
}) => {
  return (
    <motion.li
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        delay: 0.05 + index * 0.03, // Extremely reduced delay
        duration: 0.15, // Very fast animation
        type: "spring",
        stiffness: 200, // Much higher stiffness
        damping: 8,
      }}
      className="list-disc list-inside"
    >
      <TypewriterText
        text={children}
        delay={50 + index * 30} // Minimal delay
        speed={3} // Ultra-fast typing speed
      />
    </motion.li>
  );
};
export default function AnimatedChatComponent() {
  // First AI message content
  const firstAIMessage = "Hey there, Finding....";

  // Second AI message content
  const secondAIIntro = "I have mentioned your top achievements below:";
  const listItems = [
    "You have won ETH Denver in October 2025",
    "You have rocked the Arweave hacker house by working on an indexer called HAGRID and won 1st prize of $3000",
    "You have started Keizer and onboarded two startups in the first one month: ClientLabs and Edulume",
    "Founder meet in Dharamshala",
  ];
  const secondAIOutro =
    "These are some of your top from past few months. Do you want to know anything more about it? Lemme know?";

  return (
    <div className="flex-1 h-full max-w-[1536px] font-medium px-8 py-4 w-full mx-auto flex flex-col gap-4">
      {/* User message */}
      <motion.div
        className="flex justify-end w-full items-start gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 12,
          mass: 1,
        }}
      >
        <div className="px-4 tracking-tight py-1 max-w-3xl border border-[#E9E9E9] bg-[#FAF9F7] w-fit rounded-sm">
          Give me my top achievements
        </div>
        <div className="rounded-md bg-[#FAF9F7] border border-[#E9E9E9] p-2 flex items-center justify-center aspect-square">
          <User size={16} />
        </div>
      </motion.div>

      {/* First AI response */}
      <motion.div
        className="flex justify-start w-full items-start gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 12,
          mass: 1,
          delay: 0.2,
        }}
      >
        <div className="rounded-md bg-[#FAF9F7] border border-[#E9E9E9] p-2 flex items-center justify-center aspect-square">
          <Plobbo className="size-[16px]" />
        </div>
        <div className="px-4 tracking-tight py-1 max-w-xl border border-[#E9E9E9] bg-[#FAF9F7] w-fit rounded-sm">
          <TypewriterText text={firstAIMessage} speed={50} />
        </div>
      </motion.div>

      {/* Second AI response with list */}
      <motion.div
        className="flex justify-start w-full items-start gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 12,
          mass: 1,
          delay: 0.8,
        }}
      >
        <div className="rounded-md bg-[#FAF9F7] border border-[#E9E9E9] p-2 flex items-center justify-center aspect-square">
          <Plobbo className="size-[16px]" />
        </div>
        <div className="px-4 tracking-tight py-1 max-w-xl border border-[#E9E9E9] bg-[#FAF9F7] w-fit rounded-sm">
          <div className="space-y-4 font-medium text-black p-4 text-base">
            <p className="text-black tracking-tight">
              <TypewriterText text={secondAIIntro} speed={50} />
            </p>
            <motion.ul
              className="list-disc list-inside space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {listItems.map((item, index) => (
                <AnimatedListItem key={index} index={index}>
                  {item}
                </AnimatedListItem>
              ))}
            </motion.ul>
            <p className="text-black">
              <TypewriterText
                text={secondAIOutro}
                delay={5 + listItems.length * 30}
                speed={60}
              />
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
