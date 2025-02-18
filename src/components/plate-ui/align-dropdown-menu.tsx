"use client";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import type { Alignment } from "@udecode/plate-alignment";
import React from "react";
import { setAlign } from "@udecode/plate-alignment";
import { useEditorRef, useSelectionFragmentProp } from "@udecode/plate/react";
import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
} from "lucide-react";

import { STRUCTURAL_TYPES } from "~/components/editor/transforms";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
    useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

const items = [
    {
        icon: AlignLeftIcon,
        value: "left",
    },
    {
        icon: AlignCenterIcon,
        value: "center",
    },
    {
        icon: AlignRightIcon,
        value: "right",
    },
    {
        icon: AlignJustifyIcon,
        value: "justify",
    },
];

export function AlignDropdownMenu({
    children: _children,
    ...props
}: DropdownMenuProps) {
    const editor = useEditorRef();
    const value = useSelectionFragmentProp({
        defaultValue: "start",
        getProp: (node) => node.align,
        structuralTypes: STRUCTURAL_TYPES,
    });

    const openState = useOpenState();
    const IconValue =
        items.find((item) => item.value === value)?.icon ?? AlignLeftIcon;

    return (
        <DropdownMenu modal={false} {...openState} {...props}>
            <DropdownMenuTrigger asChild>
                <ToolbarButton
                    pressed={openState.open}
                    tooltip="Align"
                    isDropdown
                >
                    <IconValue />
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-0" align="start">
                <DropdownMenuRadioGroup
                    value={value}
                    // @ts-expect-error onValueChange is not inferring it's prop type to Alignment
                    onValueChange={(value: Alignment) => {
                        setAlign(editor, { value: value });
                        editor.tf.focus();
                    }}
                >
                    {items.map(({ icon: Icon, value: itemValue }) => (
                        <DropdownMenuRadioItem
                            key={itemValue}
                            value={itemValue}
                            hideIcon
                        >
                            <Icon />
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
