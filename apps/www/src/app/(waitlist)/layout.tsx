import "@plobbo/ui/globals.css";
import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Toaster } from "@plobbo/ui/components/sonner";

import { WaitlistFooter } from "~/components/join-waitlist/footer";
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
          <div className="flex min-h-dvh flex-col">
            <nav className="sticky top-0 z-50 h-[64px] w-full border-b border-neutral-400 px-6 backdrop-blur-lg transition-all dark:border-neutral-900 dark:bg-neutral-950/80">
              {" "}
              <div className="mx-auto flex h-full max-w-5xl items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <ThemeSwitcher className="transition-all" />
                </div>
              </div>
            </nav>
            <main className="flex-grow">{children}</main>
            <WaitlistFooter />
            <Toaster richColors />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
