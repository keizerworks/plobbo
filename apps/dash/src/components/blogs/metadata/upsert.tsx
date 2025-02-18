import type { Tag, TagInputProps } from "emblor";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TagInput } from "emblor";
import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ulid } from "ulid";

import type {
  CreateBlogMetadataInterface} from "@plobbo/validator/blog/metadata/create";
import {
  createBlogMetadataSchema,
} from "@plobbo/validator/blog/metadata/create";

import { Button, buttonVariants } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";

const BlogMetadataForm = ({ blogId }: { blogId: string }) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<CreateBlogMetadataInterface>({
    resolver: zodResolver(createBlogMetadataSchema),
    defaultValues: {
      blogId,
    },
  });

  const { data, isPending: loadingMetadata } = useQuery({
    blogId: blogId,
  });

  const { mutate, isPending } = useMutation({
    onSuccess: (res) => {
      setOpen(false);
      toast.success(res.message);
    },
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  useEffect(() => {
    if (data) {
      form.setValue("title", data.title);
      form.setValue("description", data.description);
      form.setValue("ogTitle", data.ogTitle ?? undefined);
      form.setValue("ogDescription", data.ogDescription ?? undefined);
      form.setValue("ogUrl", data.ogUrl ?? undefined);
      if (data.keywords) {
        form.setValue("keywords", data.keywords);
        setTags(
          data.keywords.split(", ").map((text) => ({ id: ulid(), text })),
        );
      }
    }
  }, [data, form]);

  if (loadingMetadata) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={buttonVariants({
          variant: "outline",
          className: "ml-auto",
        })}
      >
        <FileText className="size-4" />
        Metadata
      </SheetTrigger>

      <SheetContent className="overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Edit Blog Metadata</SheetTitle>
          <SheetDescription>
            Update the metadata for your blog. Make sure all fields are
            correctly filled before saving.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-y-3 overflow-y-auto px-6 py-4 pb-20"
          >
            <FormField
              control={form.control}
              name="title"
              label="Title"
              render={({ field }) => (
                <Input
                  placeholder="e.g., 10 Tips for Better Programming"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              label="Descripton"
              render={({ field }) => (
                <Textarea
                  placeholder="e.g., A comprehensive guide to improving your programming skills with practical tips and real-world examples"
                  rows={3}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              label="Keywords"
              render={({ field: { value, ...field } }) => (
                <TagInput
                  {...field}
                  value={value as unknown as TagInputProps["value"]}
                  styleClasses={{ input: "border-0 shadow-none" }}
                  placeholder="e.g., programming, coding, software development"
                  tags={tags}
                  setTags={(newTags) => {
                    setTags(newTags);
                    field.onChange(
                      (newTags as [Tag, ...Tag[]])
                        .map((tag) => tag.text)
                        .join(", "),
                    );
                  }}
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                />
              )}
            />

            <FormField
              control={form.control}
              name="ogTitle"
              label="Open-Graph Title"
              render={({ field: { value, ...field } }) => (
                <Input
                  value={value ?? ""}
                  placeholder="e.g., Boost Your Programming Skills: 10 Essential Tips"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="ogDescription"
              label="Open-Graph Descripton"
              render={({ field: { value, ...field } }) => (
                <Textarea
                  value={value ?? ""}
                  rows={3}
                  {...field}
                  placeholder="e.g., Learn proven strategies and best practices to enhance your programming abilities and write better code"
                />
              )}
            />

            <SheetFooter className="absolute inset-x-0 bottom-0 border-t bg-white px-6 py-4">
              <Button loading={isPending} type="submit">
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default BlogMetadataForm;
