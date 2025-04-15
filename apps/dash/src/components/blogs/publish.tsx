import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { publishBlog } from "~/actions/blog";

import { Button } from "../ui/button";

export default function PublishBlog() {
  const blogId: string | undefined = useParams({
    strict: false,
    select: (s) => s["story-id"],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: publishBlog,
    onSuccess: () => toast.success("Blog published successfully"),
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const onSubmit = useCallback(() => mutate(blogId!), [blogId, mutate]);

  if (!blogId) {
    return null;
  }

  return (
    <Button
      loading={isPending}
      onClick={onSubmit}
      size="sm"
      className="rounded-sm"
    >
      Publish
    </Button>
  );
}
