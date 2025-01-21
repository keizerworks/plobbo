import "styles/prosemirror.css";

import BlogMetadataForm from "components/blogs/metadata/upsert";
import NovelEditor from "components/editor/wrapper";
import { api } from "trpc/server";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  void api.blogMetadata.get.prefetch({ blog_id: id });
  void api.blog.get.prefetch({ id });

  return (
    <main className="mx-auto flex size-full max-w-6xl flex-col gap-y-2 p-4">
      <BlogMetadataForm blogId={id} />
      <div className="relative flex size-full items-center justify-center rounded-xl border transition-all animate-in fade-in-0">
        <NovelEditor />
      </div>
    </main>
  );
}
