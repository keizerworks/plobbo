import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RequestDomainVerificationInterface as SchemaInterface } from "@plobbo/validator/organization/domain";
import { requestDomainVerificationSchema as schema } from "@plobbo/validator/organization/domain";

import { requestDomainVerification } from "~/actions/organization/domain";
import { getOrganizationsDomainQueryOption } from "~/actions/organization/domain/query-options";
import { useActiveOrgIdStore } from "~/store/active-org";

import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { useStepper } from "../ui/stepper";

export default function RequestDomainVerification() {
  const { activeStep } = useStepper();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const activeOrgId = useActiveOrgIdStore.use.id()!;
  const queryClient = useQueryClient();
  const { invalidate } = useRouter();
  const form = useForm<SchemaInterface>({ resolver: zodResolver(schema) });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: SchemaInterface) =>
      requestDomainVerification(activeOrgId, values),
    onSuccess: async ({ message }) => {
      toast.success(message);
      await queryClient.invalidateQueries(
        getOrganizationsDomainQueryOption(activeOrgId),
      );
      await invalidate();
    },
    onError: console.error,
  });

  function onSubmit(values: SchemaInterface) {
    toast.promise(async () => mutateAsync(values), {
      loading: (
        <div className="flex items-center gap-x-2">
          <Loader className="size-4 animate-spin" />
          <p className="text-sm">requesting domain verification</p>
        </div>
      ),
      success: ({ message }) => message,
      error: "something went wrong",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2"
      >
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <Input placeholder="blogs.plobbo.com" {...field} />
          )}
        />

        <Button
          disabled={activeStep !== 1 || isPending}
          type="submit"
          size="sm"
          className="ml-auto text-xs"
        >
          Request
        </Button>
      </form>
    </Form>
  );
}
