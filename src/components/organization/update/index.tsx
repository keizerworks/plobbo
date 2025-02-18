"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { UpdateOrganizationInterface } from "~/validators/organization/update";
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
import { env } from "~/env";
import { emitter } from "~/events/emitter";
import { uploadToPresignedUrl } from "~/lib/utils";
import { api } from "~/trpc/react";
import { updateOrganizationSchema } from "~/validators/organization/update";

export const UpdateOrganization = () => {
    const queryClient = useQueryClient();
    const orgListQueryKey = getQueryKey(api.organization.list);
    const orgGetQueryKey = getQueryKey(api.organization.get);

    const [open, setOpen] = useState(false);
    const [updateLogo, setUpdateLogo] = useState(false);

    const form = useForm<UpdateOrganizationInterface>({
        resolver: zodResolver(updateOrganizationSchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    });

    const { data, isPending } = api.organization.get.useQuery(undefined, {
        enabled: open,
    });

    const { mutateAsync } = api.organization.update.useMutation({
        onSuccess: async ({ logoUploadUrl }) => {
            const logo = form.getValues("logo");
            if (logo && logoUploadUrl) {
                await uploadToPresignedUrl(logoUploadUrl, logo);
            }

            await Promise.all([
                queryClient.refetchQueries({ queryKey: orgListQueryKey }),
                queryClient.refetchQueries({ queryKey: orgGetQueryKey }),
            ]);
        },
    });

    function onSubmit(values: UpdateOrganizationInterface) {
        toast.promise(
            async () =>
                mutateAsync({
                    name: values.name,
                    slug: values.slug,
                    updateLogo,
                }),
            {
                loading: (
                    <div className="flex items-center gap-x-2">
                        <Loader className="size-4 animate-spin" />
                        <p className="text-sm">updating organization</p>
                    </div>
                ),
                success: () => "organization updated",
                error: "something went wrong",
            },
        );

        setOpen(false);
    }

    useEffect(() => {
        emitter.on("update:org", setOpen);
        return () => {
            emitter.off("update:org");
        };
    }, []);

    useEffect(() => {
        if (data) {
            form.setValue("name", data.name);
            form.setValue("slug", data.slug);
        }
    }, [data, form]);

    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaContent className="px-0 sm:max-w-[425px]">
                {isPending ? (
                    <Loader className="m-auto animate-spin" />
                ) : (
                    <>
                        <CredenzaHeader className="max-mb:pb-4 gap-x-0 gap-y-1 space-y-0 px-4 text-left md:px-6">
                            <CredenzaTitle>Update Organization</CredenzaTitle>
                            <CredenzaDescription>
                                Enter the details for your Organization. Click
                                save when you&apos;re done.
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
                                    name="logo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logo</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    edit
                                                    defaultSrc={
                                                        env.NEXT_PUBLIC_S3_DOMAIN +
                                                        "/" +
                                                        data?.logo
                                                    }
                                                    onChange={(file) => {
                                                        field.onChange(file);
                                                        setUpdateLogo(
                                                            file instanceof
                                                                File,
                                                        );
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
                                        <Input
                                            placeholder="Acme Inc"
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    label="Slug"
                                    render={({ field }) => (
                                        <Input
                                            placeholder="acme-inc"
                                            {...field}
                                        />
                                    )}
                                />

                                <CredenzaFooter className="max-md:pb-2 -mx-4 mt-4 border-t px-4 pt-2 md:-mx-6 md:mt-6 md:px-6 md:pt-6">
                                    <Button type="submit" className="w-full">
                                        Update Organization
                                    </Button>
                                </CredenzaFooter>
                            </form>
                        </Form>
                    </>
                )}
            </CredenzaContent>
        </Credenza>
    );
};
