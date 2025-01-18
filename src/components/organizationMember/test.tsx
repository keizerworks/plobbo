"use client";

import type { UpdateUserProfileInterface } from "validators/organization-member/update";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { ImageUpload } from "components/image-upload";
import { Button, buttonVariants } from "components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "components/ui/credenza";
import {
  BaseFormField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Separator } from "components/ui/separator";
import { emitter } from "events/emitter";
import { uploadToPresignedUrl } from "lib/utils";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "trpc/react";
import { updateUserProfileSchema } from "validators/organization-member/update";

export const UpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const orgListQueryKey = getQueryKey(api.organizationmember.list);
  const orgGetQueryKey = getQueryKey(api.organizationmember.get);

  const [open, setOpen] = useState(false);
  const form = useForm<UpdateUserProfileInterface>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      display_name: "",
      bio: "",
    },
  });

  const { data, isPending } = api.organizationmember.get.useQuery(undefined, {
    enabled: open,
  });

  const { mutateAsync } = api.organizationmember.update.useMutation({
    onSuccess: async ({ profilePictureUploadUrl }) => {
      const logo = form.getValues("profile_picture");
      if (logo && profilePictureUploadUrl) {
        await uploadToPresignedUrl(profilePictureUploadUrl, logo);
      }
      await Promise.all([
        queryClient.refetchQueries({ queryKey: orgListQueryKey }),
        queryClient.refetchQueries({ queryKey: orgGetQueryKey }),
      ]);
    },
    onError: console.error,
  });

  function onSubmit(values: UpdateUserProfileInterface) {
    toast.promise(
      async () =>
        mutateAsync({
          display_name: values.display_name,
          bio: values.bio,
        }),
      {
        loading: (
          <div className="flex items-center gap-x-2">
            <Loader className="size-4 animate-spin" />
            <p className="text-sm">updating organization member</p>
          </div>
        ),
        success: () => "organization member updated",
        error: "something went wrong",
      },
    );

    setOpen(false);
  }

  useEffect(() => {
    emitter.on("update:organizationmember", setOpen);
    return () => {
      emitter.off("update:organizationmember");
    };
  }, []);

  useEffect(() => {
    if (data) {
      form.setValue("display_name", data.display_name ?? "");
      form.setValue("bio", data.bio ?? "");
    }
  }, [data]);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className={buttonVariants({ size: "sm" })}>
        Update Organization Member
      </CredenzaTrigger>
      <CredenzaContent className="px-0 sm:max-w-[425px]">
        {isPending ? (
          <Loader className="m-auto animate-spin" />
        ) : (
          <>
            <CredenzaHeader className="max-mb:pb-4 gap-0 space-y-0 px-4 text-left md:px-6">
              <CredenzaTitle>Update Organization Member</CredenzaTitle>
              <CredenzaDescription>
                Enter the details. Click save when you're done.
              </CredenzaDescription>
            </CredenzaHeader>
            <Separator />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="no-scrollbar flex max-h-[70vh] flex-col gap-y-2 overflow-y-scroll px-4 max-md:pt-3 md:px-6"
              >
                <BaseFormField
                  control={form.control}
                  name="profile_picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <ImageUpload
                          edit
                          onChange={(file) => {
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_name"
                  label="Name"
                  render={({ field }) => (
                    <Input placeholder="Acme Inc" {...field} />
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  label="Bio"
                  render={({ field }) => (
                    <Input placeholder="acme-inc" {...field} />
                  )}
                />
                <CredenzaFooter className="-mx-4 mt-4 border-t px-4 pt-2 max-md:pb-2 md:-mx-6 md:mt-6 md:px-6 md:pt-6">
                  <Button type="submit" className="w-full">
                    Update Organization Member
                  </Button>
                </CredenzaFooter>
              </form>
            </Form>
          </>
        )}
      </CredenzaContent>
    </Credenza>
  );
};
