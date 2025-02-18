import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { UpdateOrganizationInterface } from "@plobbo/validator/organization/update";
import { updateOrganizationSchema } from "@plobbo/validator/organization/update";

import type { Organization } from "~/types/organization";
import { patchOrganization } from "~/actions/organization";
import { organizationsQueryOption } from "~/actions/organization/query-options";
import { ImageUpload } from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "~/components/ui/credenza";
import {
  BaseFormField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { emitter } from "~/events/emitter";

export const UpdateOrganizationForm = (data: Organization) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateOrganizationInterface>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
      id: data.id,
    },
  });

  const dirtyFields = form.formState.dirtyFields;

  const { mutateAsync } = useMutation({
    mutationFn: async (values: UpdateOrganizationInterface) => {
      const formData = new FormData();
      Object.keys(dirtyFields).map(
        // @ts-expect-error -- Object.keys is failing to infer literal keys
        (key: keyof typeof values) => {
          if (values[key]) formData.set(key, values[key]);
        },
      );
      formData.set("id", values.id);
      return patchOrganization(formData);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(organizationsQueryOption);
    },
  });

  function onSubmit(values: UpdateOrganizationInterface) {
    toast.promise(async () => mutateAsync(values), {
      loading: (
        <div className="flex items-center gap-x-2">
          <Loader className="size-4 animate-spin" />
          <p className="text-sm">updating organization</p>
        </div>
      ),
      success: () => "organization updated",
      error: "something went wrong",
    });

    setOpen(false);
  }

  useEffect(() => {
    emitter.on("update:org", setOpen);
    return () => {
      emitter.off("update:org");
    };
  }, []);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent className="px-0 sm:max-w-[425px]">
        <CredenzaHeader className="max-mb:pb-4 gap-x-0 space-y-0 gap-y-1 px-4 text-left md:px-6">
          <CredenzaTitle>Update Organization</CredenzaTitle>
          <CredenzaDescription>
            Enter the details for your Organization. Click save when you&apos;re
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
                    <ImageUpload
                      edit
                      defaultSrc={data.logo}
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
              name="name"
              label="Name"
              render={({ field }) => (
                <Input placeholder="Acme Inc" {...field} />
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
                Update Organization
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
};
