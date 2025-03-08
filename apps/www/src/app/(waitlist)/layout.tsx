import "@plobbo/ui/globals.css";
import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import Image from "next/image";

import { Toaster } from "@plobbo/ui/components/sonner";

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
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
