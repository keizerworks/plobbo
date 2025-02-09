"use client";

import type { UpdateUserProfileInterface } from "validators/organization-member/update";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { ImageUpload } from "components/image-upload";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
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
import { Textarea } from "components/ui/textarea";
import { env } from "env";
import { uploadToPresignedUrl } from "lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "trpc/react";
import { updateUserProfileSchema } from "validators/organization-member/update";

interface UpdateOrgMemberProfileProps {
  data:
    | {
        displayName: string | null;
        bio: string | null;
        profilePicture: string | null;
      }
    | undefined;
}

export const UpdateOrgMemberProfile = ({
  data,
}: UpdateOrgMemberProfileProps) => {
  const queryClient = useQueryClient();
  const orgListQueryKey = getQueryKey(api.organization.member.list);

  const [updateProfilePicture, setUpdateProfilePicture] = useState(false);

  const form = useForm<UpdateUserProfileInterface>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: data?.displayName ?? "",
      bio: data?.bio ?? "",
    },
  });

  const { mutateAsync } = api.organization.member.update.useMutation({
    onSuccess: async ({ profilePictureUploadUrl }) => {
      const logo = form.getValues("profilePicture");
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
          displayName: values.displayName,
          bio: values.bio,
          updateProfilePicture,
        }),
      {
        loading: (
          <div className="flex items-center gap-x-2">
            <p className="text-sm">Updating organization member...</p>
          </div>
        ),
        success: "Organization Profile updated successfully!",
        error: "Something went wrong while updating.",
      },
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>

      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BaseFormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <ImageUpload
                      edit
                      defaultSrc={
                        data?.profilePicture
                          ? env.NEXT_PUBLIC_S3_DOMAIN +
                            "/" +
                            data.profilePicture
                          : undefined
                      }
                      onChange={(file) => {
                        field.onChange(file);
                        setUpdateProfilePicture(file instanceof File);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              label="Name"
              render={({ field: { value, ...field } }) => (
                <Input
                  placeholder="Enter name"
                  value={value ?? ""}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              label="Bio"
              render={({ field: { value, ...field } }) => (
                <Textarea
                  placeholder="Enter bio"
                  value={value ?? ""}
                  {...field}
                />
              )}
            />

            <CardFooter className="-mx-6">
              <Button type="submit">Update</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
