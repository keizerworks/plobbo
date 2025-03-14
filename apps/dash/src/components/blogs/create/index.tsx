import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { CreateBlogInterface } from "@plobbo/validator/blog/create";
import { createBlogSchema } from "@plobbo/validator/blog/create";

import { createBlog } from "~/actions/blog";
import { ImageUpload } from "~/components/image-upload";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
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
import { getActiveOrgId } from "~/store/active-org";

export const CreateBlog = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const form = useForm<CreateBlogInterface>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (values: CreateBlogInterface) => {
      const formData = new FormData();
      for (const key of Object.keys(values)) {
        // @ts-expect-error -- Object.keys fails to infer literal key
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.set(key, values[key]);
      }
      return createBlog(formData);
    },
    onSuccess: async ({ id }) => {
      await navigate({
        from: "/blogs",
        to: "/blogs/$blog-id",
        params: { "blog-id": id },
        search: true,
      });
    },
    onError: console.error,
  });

  function onSubmit(values: CreateBlogInterface) {
    toast.promise(async () => mutateAsync(values), {
      loading: (
        <div className="flex items-center gap-x-2">
          <Loader className="size-4 animate-spin" />
          <p className="text-sm">initiating new blog</p>
        </div>
      ),
      success: () => "created blog successfully",
      error: "something went wrong",
    });

    setOpen(false);
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    form.setValue("organizationId", getActiveOrgId()!);
  }, [form]);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className={buttonVariants({ size: "sm" })}>
        New Blog
      </CredenzaTrigger>

      <CredenzaContent className="px-0 sm:max-w-[425px]">
        <CredenzaHeader className="max-mb:pb-4 space-y-0 gap-x-0 gap-y-1 px-4 text-left md:px-6">
          <CredenzaTitle>New Blog</CredenzaTitle>
          <CredenzaDescription>
            Enter the details for your new blog. Click save when you&apos;re
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      aspectVideo
                      onChange={(file) => field.onChange(file)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              label="Title"
              render={({ field }) => (
                <Input placeholder="How to write blog" {...field} />
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              label="Slug"
              render={({ field }) => (
                <Input placeholder="how-to-write-a-blog" {...field} />
              )}
            />

            <CredenzaFooter className="-mx-4 mt-4 border-t px-4 pt-2 max-md:pb-2 md:-mx-6 md:mt-6 md:px-6 md:pt-6">
              <Button type="submit" className="w-full">
                Create Blog
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
};
