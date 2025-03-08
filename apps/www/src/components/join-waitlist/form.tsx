"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
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
        className="flex w-full max-w-xl flex-col items-start gap-4 md:flex-row"
      >
        <FormField
          disabled={pending}
          control={form.control}
          className="flex-1 text-left"
          name="email"
          label=""
          render={({ field }) => (
            <div className="relative w-full flex-1 items-start">
              <User
                className="absolute left-2.5 top-2.5 size-5"
                strokeWidth={1}
              />
              <Input
                className="h-10 pl-9"
                placeholder="john.doe@plobbo.com"
                {...field}
              />
            </div>
          )}
        />

        <Button loading={pending} type="submit" size="lg">
          Join Waitlist
        </Button>
      </form>
    </Form>
  );
}
