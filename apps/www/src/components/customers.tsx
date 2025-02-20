import Image from "next/image";

import { cn } from "@plobbo/ui/lib/utils";

import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardTitle,
} from "~/components/ui/minimal-card";

const cards = [
  {
    imageSrc: "/assets/customers/biz-ent.svg",
    title: "Businesses & Enterprises",
    description: "Build and scale your content effortlessly.",
  },
  {
    imageSrc: "/assets/customers/startups.svg",
    title: "Startups",
    description: "Plobbo automatically enhances your posts for search engines.",
  },
  {
    imageSrc: "/assets/customers/marketting-agencies.svg",
    title: "Marketing Agencies",
    description: "Streamline content creation for multiple clients.",
  },
  {
    imageSrc: "/assets/customers/freelancers.svg",
    title: "Freelancers",
    description: "Automate your blogging process and save time.",
  },
];

export default function Customers() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-6 py-12 md:space-y-12 md:px-12 md:py-24">
      <div className="flex flex-col gap-y-4 md:items-center">
        <h2 className="md:text-center">Our Ideal Customers</h2>
        <p className="max-w-xl text-pretty max-md:text-sm md:text-balance md:text-center">
          Whether you&apos;re a startup, enterprise, or freelancer,
          <br className="max-md:hidden" />
          Plobbo streamlines your blogging process so you can focus on growth.
        </p>
      </div>

      <div className="grid items-center justify-center gap-4 md:grid-cols-[repeat(2,_calc(14rem_+_24px))]">
        {cards.map((card, index) => (
          <MinimalCard
            key={card.title + index}
            className="flex flex-col items-center gap-y-2 p-3 text-center md:w-[calc(14rem_+_24px)]"
          >
            <div
              className={cn(
                "absolute rounded-t-md",
                "bg-gradient-to-b from-[#52525B1A] to-transparent dark:from-slate-100/10",
                "h-[calc((100dvw_-_3rem_-_24px)_/_2.3235294118)] w-[calc(100dvw_-_3rem_-_24px)]",
                "md:h-[calc(18rem_/_2.3235294118)] md:w-56",
              )}
            />

            <Image
              height={90}
              width={90}
              src={card.imageSrc}
              alt={card.title}
              className="mt-3 dark:invert"
            />

            <MinimalCardTitle className="my-0">{card.title}</MinimalCardTitle>
            <MinimalCardDescription className="my-0 text-balance text-sm">
              {card.description}
            </MinimalCardDescription>
          </MinimalCard>
        ))}
      </div>
    </section>
  );
}
