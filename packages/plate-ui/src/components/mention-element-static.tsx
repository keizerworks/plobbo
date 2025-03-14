import type { SlateElementProps } from "@udecode/plate";
import type { TMentionElement } from "@udecode/plate-mention";
import React from "react";
import { cn } from "@udecode/cn";
import { IS_APPLE, SlateElement } from "@udecode/plate";

export function MentionElementStatic({
    children,
    className,
    prefix,
    ...props
}: SlateElementProps & {
    prefix?: string;
}) {
    const element = props.element as TMentionElement;
    const firstChild = element.children[0];

    return (
        <SlateElement
            className={cn(
                className,
                "bg-muted inline-block rounded-md px-1.5 py-0.5 align-baseline text-sm font-medium",
                firstChild && firstChild.bold === true && "font-bold",
                firstChild && firstChild.italic === true && "italic",
                firstChild && firstChild.underline === true && "underline",
            )}
            data-slate-value={element.value}
            {...props}
        >
            {IS_APPLE ? (
                // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
                <React.Fragment>
                    {children}
                    {prefix}
                    {element.value}
                </React.Fragment>
            ) : (
                // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
                <React.Fragment>
                    {prefix}
                    {element.value}
                    {children}
                </React.Fragment>
            )}
        </SlateElement>
    );
}
