"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@plobbo/ui/components/button";
import { Separator } from "@plobbo/ui/components/separator";

const ThemeSwitcher = dynamic(() => import("./theme-switcher"), { ssr: false });

const footerLinks = [
  { title: "Home", href: "/" },
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Terms of Service", href: "/legal/tos" },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-7xl border border-neutral-500 px-6 md:px-12">
      <div className="flex w-full flex-col items-start gap-y-4 py-8 md:items-center md:py-24">
        <div className="flex w-full items-center max-md:gap-x-4 md:flex-col md:gap-y-4">
          <div className="relative size-16 md:size-24">
            <Image
              className="dark:hidden"
              fill
              src="/assets/logo/dark.svg"
              alt="logo"
            />
            <Image
              className="hidden dark:block"
              fill
              src="/assets/logo/light.svg"
              alt="logo"
            />
          </div>

          <h2 className="text-center">
            Get Started with
            <br />
            Plobbo Today
          </h2>
        </div>

        <p className="max-w-xl text-pretty text-sm text-muted-foreground md:text-balance md:text-center md:text-base">
          Whether you&apos;re a solo creator, a growing team, or a thriving
          business, Plobbo helps you write smarter, optimize faster, and grow
          effortlessly.
        </p>

        <Link
          href="https://dash.plobbo.com"
          target="_blank"
          className={buttonVariants({
            size: "sm",
            className: "px-6",
          })}
        >
          Start for Free
        </Link>
      </div>

      <Separator className="md:hidden" />

      <div className="relative flex w-full flex-col items-start gap-y-4 py-8 md:items-center md:py-16">
        <Image
          src="/assets/footer/line-vector.svg"
          fill
          className="z-0 object-contain object-top max-md:hidden"
          alt="footer-line-vector"
        />

        <div className="flex w-full items-start justify-between gap-x-4 sm:items-center md:justify-center">
          <h4 className="font-semibold md:text-center md:text-xl">
            Plobbo © 2025 – AI-powered blogging, simplified.
          </h4>
          <ThemeSwitcher className="max-sm:mt-1.5 md:hidden" />
        </div>

        <nav className="balance relative z-10 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-6">
          {footerLinks.map((link, index) => (
            <Link
              className="text-xs text-muted-foreground underline md:text-sm"
              href={link.href}
              key={"footer-link" + link.title + index}
            >
              {link.title}
            </Link>
          ))}

          <span className="text-muted-foreground max-md:hidden">|</span>
          <ThemeSwitcher className="max-md:hidden" />
        </nav>
      </div>
    </footer>
  );
}
