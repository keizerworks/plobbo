"use client";

import type { PlateProps } from "@udecode/plate/react";
import type { Blog } from "db/blog";
import React from "react";
import { serializeMd } from "@udecode/plate-markdown";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "components/editor/use-create-editor";
import { Editor, EditorContainer } from "components/plate-ui/editor";
import { useDebouncedCallback } from "hooks/use-debounced-callback";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { api } from "trpc/react";

interface Props {
  blog: Blog.Model;
}

export function PlateEditor({ blog }: Props) {
  const editor = useCreateEditor({
    value: blog.body ?? undefined,
  });

  const { mutate } = api.blog.update.useMutation();

  const onUpdate: PlateProps["onChange"] = ({ value, editor }) => {
    const md = serializeMd(editor);
    mutate({ body: value, content: md, id: blog.id });
  };

  const debouncedUpdate = useDebouncedCallback(onUpdate, 2000);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate onChange={debouncedUpdate} editor={editor}>
        <EditorContainer>
          <Editor variant="fullWidth" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
