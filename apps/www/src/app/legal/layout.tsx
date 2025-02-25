"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function LegalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <h4>
        {pathname.includes("terms") ? "Privacy Policy" : "Terms of Service"}
      </h4>
      <main className="prose prose-gray dark:prose-invert container max-w-3xl py-10">
        {children}
      </main>
    </div>
  );
}
