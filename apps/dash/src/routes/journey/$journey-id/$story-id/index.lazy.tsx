import { createLazyFileRoute } from "@tanstack/react-router";

import { PlateEditor } from "~/components/editor/plate-editor";

export const Route = createLazyFileRoute("/journey/$journey-id/$story-id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const blog = Route.useLoaderData();
  return (
    <main className="flex size-full max-h-[calc(100dvh-60px)] flex-col gap-y-2">
      <div
        data-registry="plate"
        className="animate-in fade-in-0 relative flex size-full items-center justify-center overflow-hidden transition-all"
      >
        <PlateEditor blog={blog} />
      </div>
    </main>
  );
}
