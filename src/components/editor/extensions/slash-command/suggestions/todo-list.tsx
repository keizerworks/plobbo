import type { SuggestionItem } from "novel/extensions";
import { CheckSquare } from "lucide-react";

export const todoListSuggestion: SuggestionItem = {
  title: "To-do List",
  description: "Track tasks with a to-do list.",
  searchTerms: ["todo", "task", "list", "check", "checkbox"],
  icon: <CheckSquare size={18} />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleTaskList().run();
  },
};
