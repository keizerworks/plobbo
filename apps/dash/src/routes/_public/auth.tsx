import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
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
import { initializeAuth, requestOtp, verifyOtp } from "~/store/auth";

const formSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).optional(),
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
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!isOtpSent) {
        await requestOtp(values.email);
        setIsOtpSent(true);
        toast.success("OTP sent to your email");
      } else {
        if (!values.otp) {
          toast.error("Please enter the OTP");
          return;
        }

        await verifyOtp(values.email, values.otp);
        toast.success("Logged in successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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

          {isOtpSent && (
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
