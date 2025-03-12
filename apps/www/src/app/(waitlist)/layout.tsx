import "@plobbo/ui/globals.css";
import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@plobbo/ui/components/button";
import { Separator } from "@plobbo/ui/components/separator";
import { Toaster } from "@plobbo/ui/components/sonner";

import ThemeSwitcher from "~/components/theme-switcher";
import { ThemeProvider } from "~/providers/theme-provider";

const inter = Noto_Sans({
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Plobbo",
  description: "Effortless Blogging, Powered by AI.",
};

type Props = Readonly<{ children: React.ReactNode }>;
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className={`antialiased`}>
        <ThemeProvider>
          <header className="fixed inset-x-6 top-6 z-50 flex h-14 w-[calc(100dvw_-_3rem)] items-center justify-between rounded-3xl border-[0.5px] bg-white/60 bg-clip-padding px-3 py-[14px] backdrop-blur-sm backdrop-filter dark:bg-black/60 max-[672px]:w-[90dvw] md:mx-auto md:w-full md:max-w-3xl lg:h-20 lg:px-4 lg:py-[18px]">
            <div className="relative h-5 w-[calc(20px_*_3.4722222222)] lg:h-8 lg:w-[calc(32px_*_3.4722222222)]">
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
          </header>
          {children}
          <footer className="mx-auto w-full max-w-7xl px-6 md:px-12">
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
                Whether you&apos;re a solo creator, a growing team, or a
                thriving business, Plobbo helps you write smarter, optimize
                faster, and grow effortlessly.
              </p>

              <Link
                href="#"
                className={buttonVariants({
                  size: "sm",
                  className: "px-6 text-xs",
                })}
              >
                Join Waitlist
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
                {[
                  { title: "Home", href: "/" },
                  { title: "Features", href: "#features" },
                  { title: "Pricing", href: "#pricing" },
                  { title: "Privacy Policy", href: "/legal/privacy" },
                  { title: "Terms of Service", href: "/legal/tos" },
                ].map((link, index) => (
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
          </footer>{" "}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
