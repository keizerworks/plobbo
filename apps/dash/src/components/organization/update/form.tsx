import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { UpdateOrganizationInterface } from "@plobbo/validator/organization/update";
import { updateOrganizationSchema } from "@plobbo/validator/organization/update";

import type { Organization } from "~/interface/organization";
import { patchOrganization } from "~/actions/organization";
import { organizationsQueryOption } from "~/actions/organization/query-options";
import { ImageUpload } from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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

export const UpdateOrganizationForm = (data: Organization) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateOrganizationInterface>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
    },
  });

  const dirtyFields = form.formState.dirtyFields;

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: UpdateOrganizationInterface) => {
      const formData = new FormData();
      Object.keys(dirtyFields).map(
        // @ts-expect-error -- Object.keys is failing to infer literal keys
        (key: keyof typeof values) => {
          if (values[key]) formData.set(key, values[key]);
        },
      );
      if (values.logo instanceof File) formData.set("logo", values.logo);

      return patchOrganization(data.id, formData);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries(organizationsQueryOption);
      toast.success("updated");
    },
    onError: () => toast.error("something went wrong!"),
  });

  function onSubmit(values: UpdateOrganizationInterface) {
    console.log(values);
    mutate(values);
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b p-4 px-0">
        <CardTitle className="text-3xl font-bold">
          Update Organization
        </CardTitle>
        <CardDescription>
          Enter the details for your Organization. Click save when you&apos;re
          done.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-sm flex-col gap-y-3"
          >
            <BaseFormField
              control={form.control}
              name="logo"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      edit
                      defaultSrc={data.logo}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              control={form.control}
              name="name"
              label="Name"
              render={({ field }) => (
                <Input placeholder="Acme Inc" {...field} />
              )}
            />

            <FormField
              disabled={isPending}
              control={form.control}
              name="slug"
              label="Slug"
              render={({ field }) => (
                <Input placeholder="acme-inc" {...field} />
              )}
            />

            <Button loading={isPending} type="submit" className="w-full">
              Update Organization
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
