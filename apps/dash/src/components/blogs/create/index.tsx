import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
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
  const journeyId = useParams({ from: "/journey/$journey-id/" })["journey-id"];

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
      for (const [key, value] of Object.entries(values)) {
        if (value) formData.append(key, value);
      }
      return createBlog(formData);
    },

    onSuccess: async ({ id }) => {
      await navigate({
        to: "/journey/$journey-id/$story-id",
        params: { "journey-id": journeyId, "story-id": id },
      });
    },
    onError: console.error,
  });

  function onSubmit(values: CreateBlogInterface) {
    toast.promise(async () => mutateAsync(values), {
      loading: (
        <div className="flex items-center gap-x-2">
          <Loader className="size-4 animate-spin" />
          <p className="text-sm">initiating new story</p>
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
    form.setValue("journeyId", journeyId);
  }, [form, journeyId]);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger
        className={buttonVariants({ size: "default", variant: "rounded" })}
      >
        Create Story
      </CredenzaTrigger>

      <CredenzaContent className="px-0 sm:max-w-[425px] ">
        <CredenzaHeader className="max-mb:pb-4 space-y-0 gap-x-0 gap-y-1 px-4 text-left md:px-6">
          <CredenzaTitle className="text-3xl font-semibold tracking-tight">
            New Story
          </CredenzaTitle>
          <CredenzaDescription className="leading-snug">
            Enter the details for your new story. Click save when you&apos;re
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
                <Input placeholder="a story about" {...field} />
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              label="Slug"
              render={({ field }) => (
                <Input placeholder="a-story-about" {...field} />
              )}
            />

            <CredenzaFooter className="-mx-4 mt-4 border-t px-4 pt-2 max-md:pb-2 md:-mx-6 md:mt-6 md:px-6 md:pt-6">
              <Button type="submit" className="w-full">
                Create Story
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
};
