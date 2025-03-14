import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { getBlog } from "~/actions/blog";

export const Route = createFileRoute("/blogs/$blog-id")({
  validateSearch: () => ({}),
  loader: async ({ params }) => {
    return getBlog(params["blog-id"]);
  },
  pendingComponent: () => (
    <div className="flex size-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
});
