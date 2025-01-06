import {type JSONContent } from "novel";
import Editor from "./editor"
import { useState } from "react";

import "../../styles/globals.css"

const EditorWrapper = () => {
  const [content ,setContent] = useState<string>('')

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
    console.log(editorContent)
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <Editor 
        initialValue={defaultValue} 
        handleChange={handleEditorChange} 
      />
    </div>
  );
};

export default EditorWrapper;