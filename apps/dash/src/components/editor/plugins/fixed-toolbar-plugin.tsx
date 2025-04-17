"use client";

import { createPlatePlugin } from "@udecode/plate/react";

import { FixedToolbar } from "~/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "~/components/plate-ui/fixed-toolbar-buttons";

export const FixedToolbarPlugin = createPlatePlugin({
  key: "fixed-toolbar",
  render: {
    beforeEditable: () => (
      <FixedToolbar className="bg-[#FAF9F7] rounded-none">
        <FixedToolbarButtons />
      </FixedToolbar>
    ),
  },
});
