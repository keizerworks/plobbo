"use client";

import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@plobbo/ui/components/label";
import { Switch } from "@plobbo/ui/components/switch";
import { cn } from "@plobbo/ui/lib/utils";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function ThemeSwitcher({ className, ...props }: Props) {
  const { setTheme, theme } = useTheme();

  return (
    <div
      className={cn("flex items-center gap-x-1 md:gap-x-2", className)}
      {...props}
    >
      <Sun className="size-3.5 md:size-4" />
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
      />
      <Moon className="size-3.5 md:size-4" />

      <Label htmlFor="dark-mode" className="sr-only">
        Toggle dark mode
      </Label>
    </div>
  );
}
