import { useMemo } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

import { cn, focusRing } from "@plobbo/ui/lib/utils";

export const Route = createFileRoute("/_configure")({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useLocation().pathname;

  const value = useMemo(
    () => (pathname.startsWith("/configure/settings") ? "settings" : "profile"),
    [pathname],
  );

  const links = useMemo(
    () => [
      {
        title: "Profile",
        href: "/configure",
        isActive: value === "profile",
      },
      {
        title: "Settings",
        href: "/configure/settings",
        isActive: value === "settings",
      },
    ],
    [value],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-y-2 p-4">
      <div
        className={cn(
          "flex items-center justify-start border-b whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "border-gray-200 dark:border-gray-800",
        )}
      >
        {links.map((link) => (
          <Link
            className="group relative flex shrink-0 items-center justify-center select-none"
            key={link.href + link.title}
            to={link.href}
          >
            <span
              className={cn(
                // base
                "-mb-px flex items-center justify-center border-b-2 border-transparent px-3 pb-2 text-xs font-medium whitespace-nowrap transition-all",
                // text color
                "text-gray-500 dark:text-gray-500",
                // hover
                "group-hover:text-gray-700 group-hover:dark:text-gray-400",
                // border hover
                "group-hover:border-gray-300 group-hover:dark:border-gray-400",
                // selected
                link.isActive ? "border-primary text-foreground" : "",
                focusRing,
              )}
            >
              {link.title}
            </span>
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
