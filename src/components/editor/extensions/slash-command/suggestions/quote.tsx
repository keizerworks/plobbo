import type { SuggestionItem } from "novel/extensions";
import { TextQuote } from "lucide-react";

export const quoteSuggestion: SuggestionItem = {
  title: "Quote",
  description: "Capture a quote.",
  searchTerms: ["blockquote"],
  icon: <TextQuote size={18} />,
  command: ({ editor, range }) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode("paragraph", "paragraph")
      .toggleBlockquote()
      .run(),
};
