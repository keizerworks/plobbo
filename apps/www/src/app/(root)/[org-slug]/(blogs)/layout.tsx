import "@plobbo/ui/globals.css";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { ThemeProvider } from "~/providers/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

type Props = Readonly<{ children: React.ReactNode }>;
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`flex-1 antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
