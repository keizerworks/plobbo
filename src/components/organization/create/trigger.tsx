"use client";

import { PlusCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import { emitter } from "~/events/emitter";

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
