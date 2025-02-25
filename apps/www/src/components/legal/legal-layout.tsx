"use client"

import type * as React from "react";
import { usePathname } from "next/navigation";



export function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSection = pathname.includes("terms") ? "terms" : "privacy";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">
          {activeSection === "privacy" ? "Privacy Policy" : "Terms of Service"}
        </h1>
      </header>
      <div className="container max-w-3xl py-10">
        <div className="prose prose-gray dark:prose-invert">{children}</div>
      </div>
    </div>
  );
}