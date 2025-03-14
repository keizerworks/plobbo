import { Link, useLocation } from "@tanstack/react-router";

import { cn } from "@plobbo/ui/lib/utils";

import { buttonVariants } from "../ui/button";

const items = [
  { title: "Organization", href: "/configure/settings" },
  { title: "Domain", href: "/configure/settings/custom-domain" },
  { title: "Appearance", href: "/configure/settings/appearance" },
  { title: "Subscription", href: "/configure/settings/subscription" },
];

export function ConfigureSidebarNav() {
  const pathname = useLocation().pathname;

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0">
      {items.map((item) => (
        <Link
          key={item.href + item.title}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
