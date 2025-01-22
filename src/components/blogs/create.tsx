"use client";

import type { CreateBlogInterface } from "validators/blog/create";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { uploadToPresignedUrl } from "lib/utils";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "trpc/react";
import { createBlogSchema } from "validators/blog/create";

export const CreateBlog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogListQueryKey = getQueryKey(api.blog.list);
  const blogCountQueryKey = getQueryKey(api.blog.count);

  const [open, setOpen] = useState(false);
  const form = useForm<CreateBlogInterface>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "DRAFT",
    },
  });

  const { mutateAsync } = api.blog.create.useMutation({
    onSuccess: async ({ imageUploadUrl, blog: { id } }) => {
      const image = form.getValues("image");
      if (image) {
        await uploadToPresignedUrl(imageUploadUrl, image);
      }

      await Promise.all([
        await queryClient.refetchQueries({ queryKey: blogListQueryKey }),
        await queryClient.refetchQueries({ queryKey: blogCountQueryKey }),
      ]);

      router.push("/blogs" + id);
    },
    onError: console.error,
  });

  function onSubmit(values: CreateBlogInterface) {
    toast.promise(
      async () =>
        mutateAsync({
          title: values.title,
          slug: values.slug,
          status: values.status,
        }),
      {
        loading: (
          <div className="flex items-center gap-x-2">
            <Loader className="size-4 animate-spin" />
            <p className="text-sm">initiating new blog</p>
          </div>
        ),
        success: () => "created blog successfully",
        error: "something went wrong",
      },
    );

    setOpen(false);
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className={buttonVariants({ size: "sm" })}>
        New Blog
      </CredenzaTrigger>

      <CredenzaContent className="px-0 sm:max-w-[425px]">
        <CredenzaHeader className="max-mb:pb-4 gap-x-0 gap-y-1 space-y-0 px-4 text-left md:px-6">
          <CredenzaTitle>New Blog</CredenzaTitle>
          <CredenzaDescription>
            Enter the details for your new blog. Click save when you're done.
          </CredenzaDescription>
        </CredenzaHeader>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar max-md:pt-3 flex max-h-[70vh] flex-col gap-y-2 overflow-y-scroll px-4 md:px-6"
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

            <CredenzaFooter className="max-md:pb-2 -mx-4 mt-4 border-t px-4 pt-2 md:-mx-6 md:mt-6 md:px-6 md:pt-6">
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
