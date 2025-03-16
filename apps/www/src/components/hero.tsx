import Image from "next/image";
import Link from "next/link";
import { Pen } from "lucide-react";

import { buttonVariants } from "@plobbo/ui/components/button";

export default function Hero() {
  return (
    <main className="mx-auto grid w-full max-w-[1120px] grid-cols-2 items-center gap-y-4 px-6 py-28 lg:min-h-dvh lg:py-36">
      <div className="space-y-4 max-lg:col-span-2">
        <h1>
          Effortless ,
          <br />
          Powered by AI.
        </h1>

        <p className="text-pretty font-medium text-secondary-foreground">
          Transform your blogging experience with Plobbo&apos;s AI-driven
          platform.
          <br />
          Simplify content creation, automate SEO, and collaborate
          <br />
          seamlessly—all in one place.
        </p>

        <div className="flex gap-x-3">
          <Link
            className={buttonVariants({ className: "max-lg:h-9" })}
            href="https://dash.plobbo.com"
            target="_blank"
          >
            <Pen />
            Start Writing for Free
          </Link>

          <Link
            className={buttonVariants({
              className: "max-lg:h-9",
              variant: "outline",
            })}
            href="#"
            target="_blank"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="relative z-20 -ml-8 aspect-square w-[120%] max-lg:col-span-2 lg:absolute lg:bottom-[5%] lg:right-0 lg:top-[15%] lg:w-[100%] lg:max-w-[50%]">
        <Image
          src="/assets/wishlist.png"
          alt="hero"
          className="object-contain object-right-top"
          fill
        />
      </div>
    </main>
  );
}
