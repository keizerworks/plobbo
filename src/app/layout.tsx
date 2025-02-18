import "~/styles/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
    title: "Keizer Blog",
    description: "Blogging Application",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <TRPCReactProvider>
                    <div vaul-drawer-wrapper="">{children}</div>
                    <Toaster />
                </TRPCReactProvider>
            </body>
        </html>
    );
}
