import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  initializeAuth,
  requestOtpApi,
  useAuthStore,
  verifyOtpApi,
} from "~/store/auth";

const emailFormSchema = z.object({
  email: z.string().email(),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const Route = createFileRoute("/_public/auth")({
  beforeLoad: async () => {
    await initializeAuth();
  },
  component: AuthComponent,
});

function useRequestOtpMutation() {
  return useMutation({
    mutationFn: requestOtpApi,
    onError: (error) => {
      console.error("Error requesting OTP:", error);
      throw error;
    },
  });
}

function useVerifyOtpMutation() {
  const fetchUser = useAuthStore.use.fetchUser();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtpApi(email, otp),
    onSuccess: async () => {
      await fetchUser();
    },
    onError: (error) => {
      console.error("Error verifying OTP:", error);
      throw error;
    },
  });
}

function AuthComponent() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState("");
  const { mutateAsync: requestOtp, isPending: isRequestingOtp } =
    useRequestOtpMutation();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyOtpMutation();

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    try {
      await requestOtp(values.email);
      setEmail(values.email);
      setIsOtpSent(true);
      setShowOtpModal(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpFormSchema>) {
    try {
      await verifyOtp({ email, otp: values.otp });
      toast.success("OTP verified successfully");
      setShowOtpModal(false);
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email to receive an OTP
          </p>
        </div>

        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="space-y-4"
          >
            <FormField
              control={emailForm.control}
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

            <Button type="submit" className="w-full" loading={isRequestingOtp}>
              Send OTP
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
          </DialogHeader>
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        type="text"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" loading={isVerifyingOtp}>
                Verify OTP
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
