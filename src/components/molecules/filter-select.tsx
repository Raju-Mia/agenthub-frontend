import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function FilterSelect({
  className,
  label,
  children,
  ...props
}: FilterSelectProps) {
  return (
    <select
      aria-label={label ?? props["aria-label"]}
      className={cn(
        "h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
