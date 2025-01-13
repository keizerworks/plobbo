import type { SuggestionItem } from "novel/extensions";
import { Text } from "lucide-react";

export const textSuggestion: SuggestionItem = {
  title: "Text",
  description: "Just start typing with plain text.",
  searchTerms: ["p", "paragraph"],
  icon: <Text size={18} />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode("paragraph", "paragraph")
      .run();
  },
};
