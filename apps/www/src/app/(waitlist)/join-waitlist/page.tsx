import Image from "next/image";

import { Separator } from "@plobbo/ui/components/separator";

import JoinWaitlistForm from "~/components/join-waitlist/form";

export default function Page() {
  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col items-center justify-center gap-y-4 px-6 pb-0 pt-28 text-center lg:pt-36">
        <h1 className="mt-6 text-balance">
          Experience the Future of Effortless Blogging
        </h1>

        <p className="max-w-2xl text-balance">
          The first open-source platform that prioritizes your creativity and
          freedom We turn your audience into a thriving brand with AI blogging,
          built-in SEO, and a minimalist UI
        </p>

        <JoinWaitlistForm />

        <div className="h-[calc( relative mx-auto mt-16 aspect-[1.9150579151/1] w-full max-w-5xl">
          <Image
            src="/assets/wishlist.png"
            alt="Plobbo Platform Preview"
            fill
            className="rounded-t-2xl object-cover shadow-2xl dark:opacity-90"
          />
        </div>
      </main>

      <Separator className="mb-10 w-full" />
    </>
  );
}
