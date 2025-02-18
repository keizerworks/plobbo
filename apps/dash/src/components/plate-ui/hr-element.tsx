import { cn, withRef } from "@udecode/cn";
import { useFocused, useReadOnly, useSelected } from "@udecode/plate/react";

import { PlateElement } from "./plate-element";

export const HrElement = withRef<typeof PlateElement>(
    ({ className, nodeProps, ...props }, ref) => {
        const readOnly = useReadOnly();
        const selected = useSelected();
        const focused = useFocused();

        return (
            <PlateElement ref={ref} className={className} {...props}>
                <div className="py-6" contentEditable={false}>
                    <hr
                        {...nodeProps}
                        className={cn(
                            "bg-muted h-0.5 rounded-sm border-none bg-clip-content",
                            selected &&
                                focused &&
                                "ring-ring ring-2 ring-offset-2",
                            !readOnly && "cursor-pointer",
                        )}
                    />
                </div>
                {props.children}
            </PlateElement>
        );
    },
);
