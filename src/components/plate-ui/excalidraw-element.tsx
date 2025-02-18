"use client";

import React from "react";
import { withRef } from "@udecode/cn";
import { useExcalidrawElement } from "@udecode/plate-excalidraw/react";

import { PlateElement } from "./plate-element";

export const ExcalidrawElement = withRef<typeof PlateElement>(
    ({ nodeProps, ...props }, ref) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { children, element } = props;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { Excalidraw, excalidrawProps } = useExcalidrawElement({
            element,
        });

        return (
            <PlateElement ref={ref} {...props}>
                <div contentEditable={false}>
                    <div className="mx-auto aspect-video h-[600px] w-[min(100%,600px)] overflow-hidden rounded-sm border">
                        {Excalidraw && (
                            <Excalidraw {...nodeProps} {...excalidrawProps} />
                        )}
                    </div>
                </div>
                {children}
            </PlateElement>
        );
    },
);
