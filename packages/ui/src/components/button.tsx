import type { VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader } from "lucide-react";

import { cn } from "@plobbo/ui/lib/utils";

const buttonVariants = cva(
  "aria-invalid:focus-visible:ring-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-ring/50 ring-ring/10 transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 dark:outline-ring/40 dark:ring-ring/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "shadow-xs bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "shadow-xs border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "shadow-xs bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  loading,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading ?? props.disabled}
      {...props}
    >
      <>
        {loading && (
          <Loader
            className={cn("size-4 animate-spin", size === "sm" && "size-3.5")}
          />
        )}
        {children}
      </>
    </Comp>
  );
}

export { Button, buttonVariants };
