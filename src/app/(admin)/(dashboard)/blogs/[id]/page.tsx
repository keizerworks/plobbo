import "styles/prosemirror.css";

import NovelEditor from "components/editor/wrapper";

export default function Page() {
  return (
    <main className="mx-auto flex size-full max-w-6xl flex-col gap-y-2 p-4">
      <div className="relative flex size-full items-center justify-center rounded-xl border transition-all animate-in fade-in-0">
        <NovelEditor />
      </div>
    </main>
  );
}
