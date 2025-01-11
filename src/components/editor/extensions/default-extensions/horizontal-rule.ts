import { cx } from "class-variance-authority";
import { HorizontalRule } from "novel/extensions";

export const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});
