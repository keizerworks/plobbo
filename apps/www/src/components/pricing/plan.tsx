import Image from "next/image";

import { Button } from "@plobbo/ui/components/button";
import { CardHeader } from "@plobbo/ui/components/card";
import { cn } from "@plobbo/ui/lib/utils";

import { MinimalCardDescription, MinimalCardTitle } from "../ui/minimal-card";

const plans = [
  {
    tier: "Free Tier",
    price: "0$",
    recursive: { value: "month" },
    description: "Best for individuals exploring AI-powered blogging.",
    cta: { value: "Start for Free", variant: "outline" },
    features: [
      "Subdomain Hosting: (blog.plobbo.com)",
      "File Upload Limit: 5MB",
      "Single User: (1 Author)",
      "Basic SEO: (Manual Keyword Input)",
    ],
  },
  {
    tier: "Pro Plan",
    price: "10$",
    recursive: { value: "month" },
    description:
      "Best for growing businesses, teams, and professional bloggers.",
    cta: { value: "Upgrade to Pro" },
    features: [
      "Subdomain Hosting: (blog.plobbo.com)",
      "File Upload Limit: 5MB",
      "Single User: (1 Author)",
      "Basic SEO: (Manual Keyword Input)",
    ],
    bestOption: true,
  },
  {
    tier: "Enterprise Plan",
    price: "Custom",
    description:
      "Best for enterprises, agencies, and large-scale content operations.",
    cta: { value: "Contact Us", variant: "outline" },
    features: [
      "Subdomain Hosting: (blog.plobbo.com)",
      "File Upload Limit: 5MB",
      "Single User: (1 Author)",
      "Basic SEO: (Manual Keyword Input)",
    ],
  },
];

export const Plan = () => {
  return (
    <div className="grid items-center justify-center gap-4 md:grid-cols-[20rem_calc(20rem_+_16px)_20rem]">
      {plans.map((plan) => (
        <div
          key={plan.tier + plan.description}
          className={
            plan.bestOption ? "space-y-2 rounded-[28px] bg-primary p-2" : ""
          }
        >
          {plan.bestOption ? (
            <p className="text-center text-muted">Best Option</p>
          ) : null}

          <div
            className={cn(
              "w-full md:max-w-80",
              "rounded-[24px] border border-white/60 dark:border-stone-950/60",
              plan.bestOption
                ? "bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-800 dark:to-neutral-900"
                : "bg-gradient-to-b from-neutral-100 to-white/70 dark:from-neutral-800 dark:to-neutral-900",
            )}
          >
            {/* Nested structure for borders */}
            <div className="rounded-[23px] border border-black/10 dark:border-neutral-900/80">
              <div className="rounded-[22px] border border-white/50 dark:border-neutral-950">
                <div className="rounded-[21px] border border-neutral-950/20 dark:border-neutral-900/70">
                  {/* Inner content wrapper */}
                  <div className="w-full space-y-6 rounded-[20px] border border-white/50 p-6 text-neutral-500 dark:border-neutral-700/50">
                    <CardHeader className="p-0">
                      <p className="text-sm font-medium text-foreground">
                        Free Tier
                      </p>

                      <MinimalCardTitle className="m-0 flex scroll-m-20 items-center gap-x-1.5 p-0 text-xl font-semibold tracking-tight text-primary md:text-2xl md:leading-[1.1] lg:text-3xl lg:leading-[1.1]">
                        $0{" "}
                        {plan.recursive ? (
                          <span className="mt-1 text-sm font-light text-muted-foreground">
                            /per {plan.recursive.value}
                          </span>
                        ) : null}
                      </MinimalCardTitle>

                      <MinimalCardDescription className="p-0">
                        Best for individuals exploring AI-powered blogging.
                      </MinimalCardDescription>
                    </CardHeader>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-x-2 text-sm text-muted-foreground"
                        >
                          <Image
                            src="/assets/list-checkmark.svg"
                            alt="checkmark"
                            height={16}
                            width={16}
                          />
                          <small className="flex-1">{feature}</small>
                        </li>
                      ))}
                    </ul>

                    <Button
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
                      variant={plan.cta.variant as any}
                      className="w-full"
                    >
                      {plan.cta.value}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
