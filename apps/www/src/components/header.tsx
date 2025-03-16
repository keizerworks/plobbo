import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@plobbo/ui/components/button";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 h-[64px] w-full border-b border-neutral-400 px-6 backdrop-blur-lg dark:border-neutral-900 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="relative h-full w-24">
          <Image
            className="dark:hidden"
            fill
            src="/assets/logo/dark-expanded.svg"
            alt="logo"
          />
          <Image
            className="hidden dark:block"
            fill
            src="/assets/logo/light-expanded.svg"
            alt="logo"
          />
        </div>
        <Link
          className={buttonVariants({
            className: "rounded-sm font-bold max-lg:h-8 max-lg:text-xs",
          })}
          href="https://dash.plobbo.com"
          target="_blank"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
