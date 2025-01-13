"use client";

import { Button } from "components/ui/button";
import { emitter } from "events/emitter";
import { PlusCircle } from "lucide-react";

export const CreateOrganizationTrigger = () => {
  const handleCreateOrg = () => {
    emitter.emit("create:org", true);
  };

  return (
    <Button onClick={handleCreateOrg} className="gap-x-2">
      <PlusCircle className="size-4" />
      Create Organization
    </Button>
  );
};
