"use client";

import type { z } from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet";
import { useForm } from "react-hook-form";
import { api } from "trpc/react";
import { upsertBlogMetadataInputSchema } from "validators/blog-metadata/upsert-metadata";
import { toast } from "sonner";

type FormData = z.infer<typeof upsertBlogMetadataInputSchema>;

const BlogMetadataForm = ({ blogId }: { blogId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(upsertBlogMetadataInputSchema),
    defaultValues: {
      blog_id: blogId,
      metadata: {
        title: "",
        description: "",
        keywords: "",
        og_title: "",
        og_description: "",
        og_image: "",
        og_url: "",
      },
    },
  });

  const mutation = api.blogmetadata.upsert.useMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
      toast("Metadata successfully updated/created!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
      toast("Error upserting metadata!");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Metadata</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Blog Metadata</SheetTitle>
          <SheetDescription>
            Update the metadata for your blog. Make sure all fields are
            correctly filled before saving.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <input type="hidden" {...register("blog_id")} />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              {...register("metadata.title")}
              className="col-span-3"
            />
            {errors.metadata?.title && (
              <p className="col-span-4 text-sm text-red-500">
                {errors.metadata.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              {...register("metadata.description")}
              className="col-span-3"
            />
            {errors.metadata?.description && (
              <p className="col-span-4 text-sm text-red-500">
                {errors.metadata.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right">
              Keywords
            </Label>
            <Input
              id="keywords"
              {...register("metadata.keywords")}
              className="col-span-3"
            />
            {errors.metadata?.keywords && (
              <p className="col-span-4 text-sm text-red-500">
                {errors.metadata.keywords.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="og_title" className="text-right">
              Open Graph Title
            </Label>
            <Input
              id="og_title"
              {...register("metadata.og_title")}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="og_description" className="text-right">
              Open Graph Description
            </Label>
            <Input
              id="og_description"
              {...register("metadata.og_description")}
              className="col-span-3"
            />
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BlogMetadataForm;
