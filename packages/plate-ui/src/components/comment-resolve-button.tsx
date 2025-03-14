import { cn } from "@udecode/cn";
import {
    CommentResolveButton as CommentResolveButtonPrimitive,
    useComment,
} from "@udecode/plate-comments/react";
import { Check, RotateCcw } from "lucide-react";

import { buttonVariants } from "./button";

export function CommentResolveButton() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const comment = useComment()!;

    return (
        <CommentResolveButtonPrimitive
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-muted-foreground h-6 p-1",
            )}
        >
            {comment.isResolved ? (
                <RotateCcw className="size-4" />
            ) : (
                <Check className="size-4" />
            )}
        </CommentResolveButtonPrimitive>
    );
}
