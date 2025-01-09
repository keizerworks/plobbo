import { useState } from "react";
import type {JSONContent} from "novel";

import Editor from "./editor";

import "../../styles/globals.css";

const EditorWrapper = () => {
  const [content, setContent] = useState<string>("");

  const defaultValue: JSONContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: 'type "/" for commands or start writing content',
          },
        ],
      },
    ],
  };

  const handleEditorChange = (editorContent: string) => {
    setContent(editorContent);
  };

  return (
    <div className="flex h-auto w-full items-center justify-center">
      <Editor initialValue={defaultValue} handleChange={handleEditorChange} />
    </div>
  );
};

export default EditorWrapper;
