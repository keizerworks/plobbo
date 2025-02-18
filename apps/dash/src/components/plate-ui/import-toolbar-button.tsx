import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { getEditorDOMFromHtmlString } from "@udecode/plate";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { useEditorRef } from "@udecode/plate/react";
import { ArrowUpToLineIcon } from "lucide-react";
import { useFilePicker } from "use-file-picker";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

type ImportType = "html" | "markdown";

export function ImportToolbarButton({
    children: _,
    ...props
}: DropdownMenuProps) {
    const editor = useEditorRef();
    const openState = useOpenState();

    const [type, setType] = React.useState<ImportType>("html");
    const accept = type === "html" ? ["text/html"] : [".md"];

    const getFileNodes = (text: string, type: ImportType) => {
        if (type === "html") {
            const editorNode = getEditorDOMFromHtmlString(text);
            const nodes = editor.api.html.deserialize({
                element: editorNode,
            });

            return nodes;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const nodes = editor.getApi(MarkdownPlugin).markdown.deserialize(text);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return nodes;
    };

    const { openFilePicker } = useFilePicker({
        accept,
        multiple: false,
        onFilesSelected: async ({ plainFiles }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const text = await plainFiles[0].text();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
            const nodes = getFileNodes(text, type);

            editor.tf.insertNodes(nodes);
        },
    });

    return (
        <DropdownMenu modal={false} {...openState} {...props}>
            <DropdownMenuTrigger asChild>
                <ToolbarButton
                    pressed={openState.open}
                    tooltip="Import"
                    isDropdown
                >
                    <ArrowUpToLineIcon className="size-4" />
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onSelect={() => {
                            setType("html");
                            openFilePicker();
                        }}
                    >
                        Import from HTML
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={() => {
                            setType("markdown");
                            openFilePicker();
                        }}
                    >
                        Import from Markdown
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
