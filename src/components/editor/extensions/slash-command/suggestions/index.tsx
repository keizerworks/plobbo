import type { SuggestionItem } from "novel/extensions";
import { createSuggestionItems } from "novel/extensions";

import { codeSuggestion } from "./code";
import { headingSuggestions } from "./heading";
import { imageSuggestion } from "./image";
import { listSuggestion } from "./list";
import { quoteSuggestion } from "./quote";
import { textSuggestion } from "./text";
import { todoListSuggestion } from "./todo-list";

const items: SuggestionItem[] = [
  textSuggestion,
  todoListSuggestion,
  ...headingSuggestions,
  imageSuggestion,
  ...listSuggestion,
  quoteSuggestion,
  codeSuggestion,
];

export const suggestionItems = createSuggestionItems(items);
