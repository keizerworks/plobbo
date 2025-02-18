import { notFound } from "next/navigation";
import { connection } from "next/server";

import { PlateEditor } from "~/components/editor/plate-editor";
import { api } from "~/trpc/server";

export default async function Page({
    params,
}: {
    params: Promise<{ "blog-id": string }>;
}) {
    await connection();
    const { "blog-id": id } = await params;
    void api.blogMetadata.get.prefetch({ blogId: id });
    const blog = await api.blog.get({ id });

    if (!blog) {
        return notFound();
    }

    return (
        <main className="flex size-full flex-col gap-y-2 p-4">
            <div
                data-registry="plate"
                className="relative flex size-full items-center justify-center overflow-hidden transition-all animate-in fade-in-0"
            >
                <PlateEditor blog={blog} />
            </div>
        </main>
    );
}
