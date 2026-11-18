import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        locked:
          "border-transparent bg-status-locked-bg text-status-locked",
        auto: "border-transparent bg-status-auto-bg text-status-auto",
        unlocked:
          "border-transparent bg-status-unlocked-bg text-status-unlocked",
        pending:
          "border-transparent bg-status-pending-bg text-status-pending",
        approved:
          "border-transparent bg-status-approved-bg text-status-approved",
        inactive:
          "border-transparent bg-status-inactive-bg text-status-inactive",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
