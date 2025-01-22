"use client";

import type { FloatingToolbarState } from "@udecode/plate-floating";
import React from "react";
import { cn, withRef } from "@udecode/cn";
import {
  flip,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@udecode/plate-floating";
import {
  useComposedRef,
  useEditorId,
  useEditorRef,
  useEventEditorSelectors,
} from "@udecode/plate/react";

import { Toolbar } from "./toolbar";

export const FloatingToolbar = withRef<
  typeof Toolbar,
  {
    state?: FloatingToolbarState;
  }
>(({ children, state, ...props }, componentRef) => {
  const editor = useEditorRef();
  const editorId = useEditorId();
  const focusedEditorId = useEventEditorSelectors.focus();
  const isFloatingLinkOpen = !!editor.useOption({ key: "a" }, "mode");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const isAIChatOpen = editor.useOption({ key: "aiChat" }, "open");

  const floatingToolbarState = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    hideToolbar: isFloatingLinkOpen || isAIChatOpen,
    ...state,
    floatingOptions: {
      middleware: [
        offset(12),
        flip({
          fallbackPlacements: [
            "top-start",
            "top-end",
            "bottom-start",
            "bottom-end",
          ],
          padding: 12,
        }),
      ],
      placement: "top",
      ...state?.floatingOptions,
    },
  });

  const {
    clickOutsideRef,
    hidden,
    props: rootProps,
    ref: floatingRef,
  } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(componentRef, floatingRef);

  if (hidden) return null;

  return (
    <div ref={clickOutsideRef}>
      <Toolbar
        ref={ref}
        className={cn(
          "absolute z-50 overflow-x-auto whitespace-nowrap rounded-md border bg-popover p-1 opacity-100 shadow-md scrollbar-hide print:hidden",
          "max-w-[80vw]",
        )}
        {...rootProps}
        {...props}
      >
        {children}
      </Toolbar>
    </div>
  );
});
