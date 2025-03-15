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

{
  /* <header className="fixed inset-x-6 top-6 z-50 flex h-14 w-[calc(100dvw_-_3rem)] items-center justify-between rounded-3xl border-[0.5px] bg-white/60 bg-clip-padding px-3 py-[14px] backdrop-blur-sm backdrop-filter dark:bg-black/60 max-[672px]:w-[90dvw] md:mx-auto md:w-full md:max-w-3xl lg:h-20 lg:px-4 lg:py-[18px]"> */
}
{
  /*   <div className="relative h-5 w-[calc(20px_*_3.4722222222)] lg:h-8 lg:w-[calc(32px_*_3.4722222222)]"> */
}
{
  /*     <Image */
}
{
  /*       className="dark:hidden" */
}
{
  /*       fill */
}
{
  /*       src="/assets/logo/dark-expanded.svg" */
}
{
  /*       alt="logo" */
}
{
  /*     /> */
}
{
  /*     <Image */
}
{
  /*       className="hidden dark:block" */
}
{
  /*       fill */
}
{
  /*       src="/assets/logo/light-expanded.svg" */
}
{
  /*       alt="logo" */
}
{
  /*     /> */
}
{
  /*   </div> */
}
{
  /**/
}
{
  /*   <Link */
}
{
  /*     className={buttonVariants({ className: "max-lg:h-8 max-lg:text-xs" })} */
}
{
  /*     href="https://dash.plobbo.com" */
}
{
  /*     target="_blank" */
}
{
  /*   > */
}
{
  /*     Get Bitch */
}
{
  /*   </Link> */
}
{
  /* </header> */
}
