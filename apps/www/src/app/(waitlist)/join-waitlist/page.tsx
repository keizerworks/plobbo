import Image from "next/image";

import JoinWaitlistForm from "~/components/join-waitlist/form";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col items-center justify-center gap-y-4 px-6 pb-0 pt-28 text-center lg:pt-36">
      <h1 className="mt-6 text-balance">
        Be the First to Unlock the Future of Effortless Blogging!
      </h1>

      <p className="max-w-xl text-balance">
        Start for free, grow with Pro, or scale with Enterprise. Choose the plan
        that fits your needs and start blogging smarter with AI-powered tools.
      </p>

      <JoinWaitlistForm />

      {/* <small className="text-foreground"> */}
      {/*   5,590 people have already joined the waitlist */}
      {/* </small> */}

      <div className="h-[calc( relative mx-auto mt-16 aspect-[1.9150579151/1] w-full max-w-5xl">
        <Image
          src="/assets/wishlist.png"
          alt="Plobbo Platform Preview"
          fill
          className="rounded-t-2xl object-cover shadow-2xl dark:opacity-90"
        />
      </div>
    </main>
  );
}
