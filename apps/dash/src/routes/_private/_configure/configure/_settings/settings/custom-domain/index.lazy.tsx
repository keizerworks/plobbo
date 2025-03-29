import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";

import { getOrganizationsDomainQueryOption } from "~/actions/organization/domain/query-options";
import ConfigureCnameRecord from "~/components/custom-domain/configure-cname";
import RequestDomainVerification from "~/components/custom-domain/request-verification";
import VerifyDomainOwnership from "~/components/custom-domain/verify-ownership";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/ui/stepper";
import { useActiveOrgIdStore, useActiveOrgStore } from "~/store/active-org";

export const Route = createLazyFileRoute(
  "/_private/_configure/configure/_settings/settings/custom-domain/",
)({ component: RouteComponent });

const steps = [
  {
    id: "request_verification",
    step: 1,
    title: "Request Domain Verification",
    description: "Enter your custom domain to begin the verification process",
  },
  {
    id: "verify_ownership",
    step: 2,
    title: "Verify Domain Ownership",
  },
  {
    id: "configure_dns",
    step: 3,
    title: "Configure CNAME Record",
    description: "Add CNAME record to host your content",
  },
] as const;

function RouteComponent() {
  const activeOrgId = useActiveOrgIdStore.use.id();
  const activeOrg = useActiveOrgStore.use.data();

  const { data } = useSuspenseQuery(
    getOrganizationsDomainQueryOption(activeOrgId ?? undefined),
  );

  const value = useMemo(
    () => (!data || data.domain.length === 0 ? 1 : data.verified ? 3 : 2),
    [data],
  );

  if (activeOrg && activeOrg.subscription?.status !== "ACTIVE") {
    return (
      <div className="flex-1 p-4">
        <div className="flex items-center gap-x-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>
            Custom domain is a premium feature. Please upgrade your subscription
            to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b p-4 px-0">
        <CardTitle>Custom Domain</CardTitle>
        <CardDescription>Add a custom domain to your website</CardDescription>
      </CardHeader>

      <CardContent className="p-4 px-0">
        {!data?.cnameVerified ? (
          <Stepper value={value} orientation="vertical">
            {steps.map(({ id, step, title, ...props }) => (
              <StepperItem
                key={step}
                step={step}
                disabled={step !== value}
                className="relative items-start not-last:flex-1"
              >
                <div className="flex flex-col items-start gap-y-4 rounded pb-12 last:pb-0">
                  <StepperTrigger className="items-start">
                    <StepperIndicator />
                    <div className="mt-0.5 space-y-0.5 px-2 text-left">
                      <StepperTitle>{title}</StepperTitle>

                      {"description" in props ? (
                        <StepperDescription>
                          {props.description}
                        </StepperDescription>
                      ) : null}

                      {step === 2 && !data ? (
                        <StepperDescription>
                          Add the following TXT record to your DNS settings to
                          verify domain ownership
                        </StepperDescription>
                      ) : null}
                    </div>
                  </StepperTrigger>

                  <div className="flex w-full flex-col gap-y-2 pl-11">
                    {id === "request_verification" ? (
                      <RequestDomainVerification />
                    ) : id === "verify_ownership" ? (
                      <VerifyDomainOwnership
                        step={step}
                        value={value}
                        data={data}
                      />
                    ) : data ? (
                      <ConfigureCnameRecord data={data} />
                    ) : null}
                  </div>
                </div>

                {step < steps.length && (
                  <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        ) : (
          <div className="rounded-md border border-emerald-500/50 px-4 py-3 text-emerald-600">
            <p className="text-sm">
              <CircleCheck
                className="me-2 -mt-0.5 inline-flex opacity-60"
                size={16}
                aria-hidden="true"
              />
              Domain verification is completed for{" "}
              <a
                className="text-medium text-foreground"
                href={"https://" + data.domain}
                target="_blank"
              >
                {data.domain}
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
