import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { initializeAuth, requestOtp } from "~/store/auth";

const formSchema = z.object({
  email: z.string().email(),
});

export const Route = createFileRoute("/_public/auth")({
  beforeLoad: async () => {
    await initializeAuth();
  },
  component: AuthComponent,
});

function AuthComponent() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await requestOtp(values.email);
      setIsOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isOtpSent ? "Enter OTP" : "Login"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isOtpSent
            ? "Enter the OTP sent to your email"
            : "Enter your email to receive an OTP"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    disabled={isOtpSent}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" loading={isLoading}>
            {"Send OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
