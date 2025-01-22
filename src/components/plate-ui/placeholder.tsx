/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { PlaceholderProps } from "@udecode/plate/react";
import type { ReactNode } from "react";
import React from "react";
import { cn } from "@udecode/cn";
import { HEADING_KEYS } from "@udecode/plate-heading";
import {
  createNodeHOC,
  createNodesHOC,
  ParagraphPlugin,
  usePlaceholderState,
} from "@udecode/plate/react";

interface Props extends PlaceholderProps {
  children: ReactNode;
}

export const Placeholder = (props: Props) => {
  const { children, nodeProps, placeholder } = props;
  const { enabled } = usePlaceholderState(props);

  return React.Children.map(
    // @ts-expect-error please ignore
    children,
    (
      child: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    ) => {
      return React.cloneElement(child, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    },
  );
};

export const withPlaceholder = createNodeHOC(Placeholder);

export const withPlaceholdersPrimitive = createNodesHOC(Placeholder);

export const withPlaceholders = (components: any) =>
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
