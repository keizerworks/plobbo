/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { SlateEditor, SlateElementProps, TElement } from "@udecode/plate";
import type { Heading } from "@udecode/plate-heading";
import { cn } from "@udecode/cn";
import { NodeApi, SlateElement } from "@udecode/plate";
import { BaseTocPlugin, HEADING_KEYS, isHeading } from "@udecode/plate-heading";
import { cva } from "class-variance-authority";

import { Button } from "./button";

const headingItemVariants = cva(
    "text-muted-foreground hover:bg-accent hover:text-muted-foreground block h-auto w-full cursor-pointer truncate rounded-none px-0.5 py-1.5 text-left font-medium underline decoration-[0.5px] underline-offset-4",
    {
        variants: {
            depth: {
                1: "pl-0.5",
                2: "pl-[26px]",
                3: "pl-[50px]",
            },
        },
    },
);

export function TocElementStatic({
    children,
    className,
    ...props
}: SlateElementProps) {
    const { editor } = props;
    const headingList = getHeadingList(editor);

    return (
        <SlateElement className={cn(className, "mb-1 p-0")} {...props}>
            <div>
                {headingList.length > 0 ? (
                    headingList.map((item) => (
                        <Button
                            key={item.title}
                            variant="ghost"
                            className={cn(
                                headingItemVariants({
                                    // @ts-expect-error -- cannot infer literals
                                    depth: item.depth,
                                }),
                            )}
                        >
                            {item.title}
                        </Button>
                    ))
                ) : (
                    <div className="text-sm text-gray-500">
                        Create a heading to display the table of contents.
                    </div>
                )}
            </div>
            {children}
        </SlateElement>
    );
}

const headingDepth: Record<string, number> = {
    [HEADING_KEYS.h1]: 1,
    [HEADING_KEYS.h2]: 2,
    [HEADING_KEYS.h3]: 3,
    [HEADING_KEYS.h4]: 4,
    [HEADING_KEYS.h5]: 5,
    [HEADING_KEYS.h6]: 6,
};

const getHeadingList = (editor?: SlateEditor) => {
    if (!editor) return [];

    const options = editor.getOptions(BaseTocPlugin);
    if (options.queryHeading) return options.queryHeading(editor);

    const headingList: Heading[] = [];
    const values = editor.api.nodes<TElement>({
        at: [],
        match: (n) => isHeading(n),
    });

    if (!values) return [];

    Array.from(values, ([node, path]) => {
        const { type } = node;
        const title = NodeApi.string(node);
        const depth = headingDepth[type];
        const id = node.id as string;
        if (title)
            headingList.push({
                id,
                depth: depth as unknown as number,
                path,
                title,
                type,
            });
    });

    return headingList;
};
