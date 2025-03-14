import type { PlateProps } from "@udecode/plate/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serializeMd } from "@udecode/plate-markdown";
import { Plate } from "@udecode/plate/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import type { Blog } from "~/interface/blog";
import { patchBlogs } from "~/actions/blog";
import { getBlogQueryOption } from "~/actions/blog/query-options";
import { useCreateEditor } from "~/components/editor/use-create-editor";
import { Editor, EditorContainer } from "~/components/plate-ui/editor";
import { useDebouncedCallback } from "~/hooks/use-debounced-callback";

interface Props {
  blog: Blog;
}

export function PlateEditor({ blog }: Props) {
  const queryClient = useQueryClient();
  const editor = useCreateEditor({
    value: blog.body ?? undefined,
  });

  const { mutate } = useMutation({
    mutationFn: ({
      id,
      image: _image,
      ...values
    }: Partial<Omit<Blog, "id">> & { id: Blog["id"] }) =>
      patchBlogs(id, values),
    onSuccess: (blog) => {
      queryClient.setQueryData(
        getBlogQueryOption(blog.id).queryKey,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (b) => ({ ...b, ...blog, metadata: b!.metadata }),
      );
    },
  });

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
