import "styles/prosemirror.css";

import { PlateEditor } from "components/editor/plate-editor";
import { api, HydrateClient } from "trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id: id } = await params;
  void api.blogMetadata.get.prefetch({ blog_id: id });
  void api.blog.get.prefetch({ id });

  return (
    <HydrateClient>
      <main className="flex size-full flex-col gap-y-2 p-4">
        <div
          data-registry="plate"
          className="relative flex size-full items-center justify-center overflow-hidden transition-all animate-in fade-in-0"
        >
          <PlateEditor />
        </div>
      </main>
    </HydrateClient>
  );
}
