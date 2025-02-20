import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "~/components/ui/minimal-card";

const cards = [
  {
    imageSrc: "/assets/why/ai.png",
    title: "AI Powered Writing",
    description:
      "Boost your brand visibility with AI-driven blogging that enhances engagement.",
  },
  {
    imageSrc: "/assets/why/ai.png",
    title: "Built-in SEO Optimization",
    description: "Plobbo automatically enhances your posts for search engines.",
  },
  {
    imageSrc: "/assets/why/ai.png",
    title: "Minimalist UI",
    description:
      "A clean, distraction-free interface so you can focus on what matters.",
  },
  {
    imageSrc: "/assets/why/ai.png",
    title: "Multi-User Collaboration",
    description:
      "Bring your team on board! Assign roles & permissions for seamless teamwork.",
  },
];

export default function Why() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-7xl space-y-8 px-6 py-12 max-md:pt-0 md:space-y-12 md:px-12 md:py-24"
    >
      <div className="flex flex-col gap-y-4 md:items-center">
        <h2 className="md:text-center">What makes Plobbo Special?</h2>
        <p className="max-w-xl text-pretty max-md:text-sm md:text-balance md:text-center">
          Plobbo is designed to make blogging smarter, faster, and more
          efficient with AI-powered tools and seamless collaboration.
        </p>
      </div>

      <div className="grid items-center justify-center gap-4 md:grid-cols-[repeat(2,_336px)]">
        {cards.map((card, index) => (
          <MinimalCard key={card.title + index}>
            <MinimalCardImage
              className="mb-4 size-[calc(100dvw_-_3rem_-_16px)] md:size-[320px]"
              src={card.imageSrc}
              alt={card.title}
            />

            <MinimalCardFooter className="flex-col items-start gap-y-2 p-0 text-left">
              <MinimalCardTitle>{card.title}</MinimalCardTitle>
              <MinimalCardDescription className="text-sm">
                {card.description}
              </MinimalCardDescription>
            </MinimalCardFooter>
          </MinimalCard>
        ))}
      </div>
    </section>
  );
}
