"use client";

import type { EditorContentProps, JSONContent } from "novel";
import { useState } from "react";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
} from "novel";
import { handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";

import { novelExtensions } from "./extensions";
import { suggestionItems } from "./extensions/slash-command/suggestions";
import { uploadFn } from "./extensions/upload-image";
import { ColorSelector } from "./selector/color";
import { LinkSelector } from "./selector/link";
import { NodeSelector } from "./selector/node";
import { TextButtons } from "./selector/text-button";

const NovelEditor = () => {
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const onUpdate: EditorContentProps["onUpdate"] = ({ editor }) => {
    setContent(editor.getJSON());
  };

  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        initialContent={content}
        onUpdate={onUpdate}
        extensions={novelExtensions}
        className="relative size-full min-h-[500px]"
        editorProps={{
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),

          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
      >
        <EditorBubble
          tippyOptions={{ placement: "top" }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>

        <EditorCommand className="z-50 max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>

          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) =>
                  typeof item.command !== "undefined" ? item.command(val) : {}
                }
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent`}
                key={item.title}
              >
                <div className="flex size-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>

                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
};

export default NovelEditor;
