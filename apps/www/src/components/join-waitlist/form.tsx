"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@plobbo/ui/components/button";
import { Form, FormField, useForm } from "@plobbo/ui/components/form";
import { Input } from "@plobbo/ui/components/input";
import { toast } from "@plobbo/ui/components/sonner";

import { joinWaitlistAction } from "~/actions/waitlist";

const schema = z.object({ email: z.string().email() });
type SchemaInterface = z.infer<typeof schema>;

export default function JoinWaitlistForm() {
  const router = useRouter();
  const form = useForm<SchemaInterface>({ resolver: zodResolver(schema) });
  const [pending, startTransition] = useTransition();

  const onSubmit = useCallback(
    ({ email }: SchemaInterface) => {
      startTransition(async () => {
        const res = await joinWaitlistAction(email);
        if (typeof res.error === "string") toast.error(res.error);
        else toast.success("Successfully joined the waitlist!");
        form.setValue("email", "");
        form.reset();
        router.refresh();
      });
    },
    [form, router],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative mt-4 flex w-full max-w-xl flex-col items-start gap-2 md:flex-row"
      >
        <FormField
          disabled={pending}
          control={form.control}
          className="mx-auto w-full flex-1 text-left md:w-auto"
          name="email"
          label=""
          render={({ field }) => (
            <div className="group relative w-full flex-1 items-start">
              <Input
                className="h-10 rounded-sm border border-neutral-400 pl-12 text-sm !outline-0 ring-0 !ring-transparent !ring-offset-0 transition-all placeholder:text-neutral-700 focus:!outline-none focus:!outline-0 focus:!ring-transparent focus:!ring-offset-0 focus-visible:!outline-none focus-visible:!outline-0 focus-visible:!ring-0 focus-visible:!ring-transparent dark:border-neutral-800 dark:bg-neutral-800 dark:placeholder:text-neutral-400 dark:hover:border-neutral-900 dark:hover:bg-neutral-800 md:h-12 md:text-base"
                placeholder="Enter your email"
                {...field}
              />{" "}
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <AtTheRate />
              </div>
            </div>
          )}
        />

        <Button
          loading={pending}
          className="absolute right-1 top-1 hidden h-10 rounded-[8px] px-4 font-semibold tracking-tight md:block"
          type="submit"
          size="sm"
        >
          Join Waitlist
        </Button>
        <Button
          loading={pending}
          className="right-1 top-1 mx-auto block h-10 w-full rounded-[8px] px-4 font-semibold tracking-tight md:hidden"
          type="submit"
          size="sm"
        >
          Join Waitlist
        </Button>
      </form>
    </Form>
  );
}

const AtTheRate = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-neutral-400 transition-all group-hover:text-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.105 17.082C13.416 17.367 12.702 17.5 12 17.5C8.963 17.5 6.5 15.037 6.5 12C6.5 8.963 8.963 6.5 12 6.5C15.037 6.5 17.5 8.963 17.5 12V12.916C17.5 13.865 16.73 14.634 15.782 14.634C14.834 14.634 14.064 13.864 14.064 12.916V12M14.064 12C14.064 10.86 13.141 9.938 12.002 9.938C10.862 9.938 9.94 10.861 9.94 12C9.94 13.139 10.863 14.062 12.002 14.062C13.141 14.062 14.064 13.14 14.064 12ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
