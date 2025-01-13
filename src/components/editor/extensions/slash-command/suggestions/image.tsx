import type { SuggestionItem } from "novel/extensions";
import { uploadFn } from "components/editor/extensions/upload-image";
import { ImageIcon } from "lucide-react";

export const imageSuggestion: SuggestionItem = {
  title: "Image",
  description: "Upload an image from your computer.",
  searchTerms: ["photo", "picture", "media"],
  icon: <ImageIcon size={18} />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).run();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const pos = editor.view.state.selection.from;
        uploadFn(file, editor.view, pos);
      }
    };
    input.click();
  },
};
