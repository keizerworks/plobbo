import { Command, renderItems } from "novel/extensions";

import { suggestionItems } from "./suggestions";

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
