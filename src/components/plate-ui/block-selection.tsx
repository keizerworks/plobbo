"use client";

import type { VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@udecode/cn";
import { DndPlugin } from "@udecode/plate-dnd";
import { useBlockSelected } from "@udecode/plate-selection/react";
import { useEditorPlugin } from "@udecode/plate/react";
import { cva } from "class-variance-authority";

export const blockSelectionVariants = cva(
  "pointer-events-none absolute inset-0 z-[1] bg-brand/[.13] transition-opacity",
  {
    defaultVariants: {
      active: true,
    },
    variants: {
      active: {
        false: "opacity-0",
        true: "opacity-100",
      },
    },
  },
);

export function BlockSelection({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof blockSelectionVariants>) {
  const isBlockSelected = useBlockSelected();
  const { useOption } = useEditorPlugin(DndPlugin);
  const isDragging = useOption("isDragging");

  if (!isBlockSelected) return null;

  return (
    <div
      className={cn(
        blockSelectionVariants({
          active: !isDragging,
        }),
        className,
      )}
      {...props}
    />
  );
}
