import { Plan } from "./plan";

export default function Pricing() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-7xl space-y-8 px-6 py-12 max-md:pt-0 md:space-y-12 md:px-12 md:py-24"
    >
      <div className="flex flex-col gap-y-4 md:items-center">
        <h2 className="md:text-center">
          Launch Your Creative Business with Plobbo
        </h2>

        <p className="max-w-xl max-md:text-sm md:max-w-lg md:text-balance md:text-center">
          Start for free, grow with Pro, or scale with Enterprise.
          <br className="max-md:hidden" /> Choose the plan that fits your needs
          and start blogging smarter with AI-powered tools.
        </p>
      </div>

      <Plan />
    </section>
  );
}
