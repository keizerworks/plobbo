import type { SlateElementProps } from "@udecode/plate";
import React from "react";
import { SlateElement } from "@udecode/plate";

export const CodeLineElementStatic = ({
  children,
  ...props
}: SlateElementProps) => {
  return <SlateElement {...props}>{children}</SlateElement>;
};
