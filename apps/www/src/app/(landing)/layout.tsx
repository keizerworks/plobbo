import "@plobbo/ui/globals.css";
import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";

import Footer from "~/components/footer";
import Header from "~/components/header";
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
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
