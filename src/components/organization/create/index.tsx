"use client";

import type { CreateOrganizationInterface } from "validators/organization/create";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Button } from "components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
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
import { createOrganizationSchema } from "validators/organization/create";

import { ImageUpload } from "./image-upload";

export const CreateOrganization = () => {
  const queryClient = useQueryClient();
  const orgListQueryKey = getQueryKey(api.organization.list);

  const [open, setOpen] = useState(false);
  const form = useForm<CreateOrganizationInterface>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { mutateAsync } = api.organization.create.useMutation({
    onSuccess: async ({ logoUploadUrl }) => {
      const logo = form.getValues("logo");
      await uploadToPresignedUrl(logoUploadUrl, logo);
      await queryClient.refetchQueries({ queryKey: orgListQueryKey });
    },
  });

  function onSubmit(values: CreateOrganizationInterface) {
    toast.promise(
      async () =>
        mutateAsync({
          logoFilename: values.logo.name,
          name: values.name,
          slug: values.slug,
        }),
      {
        loading: (
          <div className="flex items-center gap-x-2">
            <Loader className="size-4 animate-spin" />
            <p className="text-sm">creating organization</p>
          </div>
        ),
        success: () => "create organization successfully",
        error: "something went wrong",
      },
    );

    setOpen(false);
  }

  useEffect(() => {
    emitter.on("createOrganization", setOpen);
    return () => {
      emitter.off("createOrganization");
    };
  }, []);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent className="px-0 sm:max-w-[425px]">
        <CredenzaHeader className="max-mb:pb-4 gap-0 space-y-0 px-4 text-left md:px-6">
          <CredenzaTitle>Create Organization</CredenzaTitle>
          <CredenzaDescription>
            Enter the details for your new organization. Click save when you're
            done.
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
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload onChange={(file) => field.onChange(file)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              label="Name"
              render={({ field }) => (
                <Input placeholder="Acme Inc." {...field} />
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              label="Slug"
              render={({ field }) => (
                <Input placeholder="acme-inc" {...field} />
              )}
            />

            <CredenzaFooter className="-mx-4 mt-4 border-t px-4 pt-2 max-md:pb-2 md:-mx-6 md:mt-6 md:px-6 md:pt-6">
              <Button type="submit" className="w-full">
                Create Organization
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
};
