/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@plobbo/ui/lib/utils";

import type { getDomainSettings } from "~/actions/organization/domain";
import { verifyDomain } from "~/actions/organization/domain";
import { getOrganizationsDomainQueryOption } from "~/actions/organization/domain/query-options";
import { getErrorMessage } from "~/lib/error";
import { getRecordName } from "~/lib/utils";
import { useActiveOrgStore } from "~/store/active-org";

import { Button } from "../ui/button";
import CopyToClipboard from "../ui/copy-to-clipboard";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useStepper } from "../ui/stepper";

interface Props {
  data: Awaited<ReturnType<typeof getDomainSettings>>;
  value: number;
  step: number;
}

export default function VerifyDomainOwnership(props: Props) {
  const { activeStep } = useStepper();
  const queryClient = useQueryClient();
  const { step, value, data } = props;
  const { invalidate } = useRouter();
  const activeOrgId = useActiveOrgStore.use.id()!;

  const { mutate, isPending } = useMutation({
    mutationFn: verifyDomain,
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
      <div className={cn("space-y-3", step !== value ? "opacity-50" : "")}>
        <Label>Record Name</Label>
        <CopyToClipboard
          disabled={step !== value}
          value={data.resourceRecord?.Name ?? ""}
        />

        <Label>Content</Label>
        <CopyToClipboard
          disabled={step !== value}
          value={data.resourceRecord?.Value ?? ""}
        />

        <div
          className={cn(
            "rounded-md border border-amber-500/50 px-4 py-3 text-amber-600",
            value !== step ? "disabled" : undefined,
          )}
        >
          <p className="text-sm">
            <TriangleAlert
              className="me-2 -mt-0.5 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add the {data.resourceRecord?.Type} record to your DNS settings to
            verify domain ownership
          </p>
        </div>
      </div>

      <Separator className="mt-2" />

      <div className={cn("space-y-3", step !== value ? "opacity-50" : "")}>
        <Label>Record Name</Label>
        <CopyToClipboard
          disabled={step !== value}
          value={getRecordName(data.domain)}
        />

        <Label>Content</Label>
        <CopyToClipboard
          disabled={step !== value}
          value={"0 issue amazonaws.com"}
        />

        <div
          className={cn(
            "rounded-md border border-amber-500/50 px-4 py-3 text-amber-600",
            value !== step ? "disabled" : undefined,
          )}
        >
          <p className="text-sm">
            <TriangleAlert
              className="me-2 -mt-0.5 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add the CAA record to your DNS settings to verify domain ownership
          </p>
        </div>
      </div>

      <div className="text-muted-foreground mt-4 text-sm">
        <p>
          Note: Both DNS records must be added before verification. Verification
          will fail if only one record is present.
        </p>
      </div>

      <Button
        disabled={activeStep !== 2 || isPending}
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
