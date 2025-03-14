import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { cn } from "@plobbo/ui/lib/utils";

import type { getDomainSettings } from "~/actions/organization/domain";
import { verifyDomainCname } from "~/actions/organization/domain";
import { getOrganizationsDomainQueryOption } from "~/actions/organization/domain/query-options";
import { getErrorMessage } from "~/lib/error";
import { useActiveOrgIdStore } from "~/store/active-org";

import { Button } from "../ui/button";
import CopyToClipboard from "../ui/copy-to-clipboard";
import { Label } from "../ui/label";
import { useStepper } from "../ui/stepper";

interface Props {
  data: Awaited<ReturnType<typeof getDomainSettings>>;
}

export default function ConfigureCnameRecord({ data }: Props) {
  const { activeStep } = useStepper();
  const queryClient = useQueryClient();
  const { invalidate } = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const activeOrgId = useActiveOrgIdStore.use.id()!;

  const { mutate, isPending } = useMutation({
    mutationFn: verifyDomainCname,
    onSuccess: async ({ message }) => {
      toast.success(message, { duration: 5000 });
      await queryClient.invalidateQueries(
        getOrganizationsDomainQueryOption(activeOrgId),
      );
      await invalidate();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = () => mutate(activeOrgId);

  if (!data) {
    return null;
  }

  return (
    <>
      <div className={cn("rounded border bg-gray-50 p-4")}>
        <div className={cn("space-y-3", activeStep === 3 ? "" : "opacity-50")}>
          <Label>Record Name</Label>
          <CopyToClipboard value={data.domain} />

          <Label>Target</Label>
          <CopyToClipboard value={data.cloudfrontTarget} />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Note: Add the following CNAME record to your DNS settings to point your
        domain to our servers. DNS changes may take up to 48 hours to propagate
        globally.
      </p>

      <Button
        disabled={isPending || activeStep !== 3}
        loading={isPending}
        onClick={onSubmit}
        className="mt-2 ml-auto px-4 text-xs"
        size="sm"
      >
        Verify
      </Button>
    </>
  );
}
