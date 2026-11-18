import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description: React.ReactNode;
  createHref?: string;
  createLabel?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  createHref,
  createLabel,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {createHref && createLabel ? (
          <Link href={createHref} className={cn(buttonVariants())}>
            <Plus className="size-4" />
            {createLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
