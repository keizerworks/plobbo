"use client";

import type { UpdateUserProfileInterface } from "validators/organization-member/update";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { ImageUpload } from "components/image-upload";
import { Button } from "components/ui/button";
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
import { env } from "env";
import { uploadToPresignedUrl } from "lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "trpc/react";
import { updateUserProfileSchema } from "validators/organization-member/update";

interface UpdateUserProfileProps {
  data:
    | {
        display_name: string | null;
        bio: string | null;
        profile_picture: string | null;
      }
    | undefined;
}

export const UpdateUserProfile = ({ data }: UpdateUserProfileProps) => {
  const queryClient = useQueryClient();
  const orgListQueryKey = getQueryKey(api.organizationmember.list);

  const [updateProfile_picture, setUpdateProfile_picture] = useState(false);

  const form = useForm<UpdateUserProfileInterface>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      display_name: data?.display_name ?? "",
      bio: data?.bio ?? "",
    },
  });

  const { mutateAsync } = api.organizationmember.update.useMutation({
    onSuccess: async ({ profilePictureUploadUrl }) => {
      const logo = form.getValues("profile_picture");
      if (logo && profilePictureUploadUrl) {
        await uploadToPresignedUrl(profilePictureUploadUrl, logo);
      }
      await queryClient.refetchQueries({ queryKey: orgListQueryKey });
    },
    onError: console.error,
  });

  function onSubmit(values: UpdateUserProfileInterface) {
    toast.promise(
      async () =>
        mutateAsync({
          display_name: values.display_name,
          bio: values.bio,
          updateProfile_picture,
        }),
      {
        loading: (
          <div className="flex items-center gap-x-2">
            <p className="text-sm">Updating organization member...</p>
          </div>
        ),
        success: "Organization member updated successfully!",
        error: "Something went wrong while updating.",
      },
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BaseFormField
              control={form.control}
              name="profile_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <ImageUpload
                      edit
                      defaultSrc={
                        data?.profile_picture
                          ? env.NEXT_PUBLIC_MINIO_URL + data.profile_picture
                          : undefined
                      }
                      onChange={(file) => {
                        field.onChange(file);
                        setUpdateProfile_picture(file instanceof File);
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter bio"
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-2 text-white md:w-auto"
            >
              Update Organization Member
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
