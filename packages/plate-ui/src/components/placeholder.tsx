"use client";

import type { PlaceholderProps } from "@udecode/plate/react";
import React from "react";
import { cn } from "@udecode/cn";
import { HEADING_KEYS } from "@udecode/plate-heading";
import {
  createNodeHOC,
  createNodesHOC,
  ParagraphPlugin,
  usePlaceholderState,
} from "@udecode/plate/react";

export const Placeholder = (props: PlaceholderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { children, nodeProps, placeholder } = props;

  const { enabled } = usePlaceholderState(props);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return React.Children.map(children, (child) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return React.cloneElement(child, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      className: child.props.className,
      nodeProps: {
        ...nodeProps,
        className: cn(
          enabled &&
            "before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]",
        ),
        placeholder,
      },
    });
  });
};

export const withPlaceholder = createNodeHOC(Placeholder);

export const withPlaceholdersPrimitive = createNodesHOC(Placeholder);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPlaceholders = (components: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  withPlaceholdersPrimitive(components, [
    {
      key: ParagraphPlugin.key,
      hideOnBlur: true,
      placeholder: "Type a paragraph",
      query: {
        maxLevel: 1,
      },
    },
    {
      key: HEADING_KEYS.h1,
      hideOnBlur: false,
      placeholder: "Untitled",
    },
  ]);
