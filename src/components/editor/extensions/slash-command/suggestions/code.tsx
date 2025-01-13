import type { SuggestionItem } from "novel/extensions";
import { Code } from "lucide-react";

export const codeSuggestion: SuggestionItem = {
  title: "Code",
  description: "Capture a code snippet.",
  searchTerms: ["codeblock"],
  icon: <Code size={18} />,
  command: ({ editor, range }) =>
    editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
};
