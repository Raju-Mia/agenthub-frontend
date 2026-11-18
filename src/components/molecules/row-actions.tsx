"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

type RowActionsProps = {
  detailHref: string;
  editHref?: string;
  onDelete?: () => void;
  deleteLabel?: string;
  className?: string;
};

export function RowActions({
  detailHref,
  editHref,
  onDelete,
  deleteLabel = "Delete",
  className,
}: RowActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      <Link
        href={detailHref}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-8 px-2",
        )}
        title="Details"
      >
        <Eye className="size-3.5" />
        <span className="sr-only sm:not-sr-only">Details</span>
      </Link>
      {editHref ? (
        <Link
          href={editHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-8 px-2",
          )}
          title="Edit"
        >
          <Pencil className="size-3.5" />
          <span className="sr-only sm:not-sr-only">Edit</span>
        </Link>
      ) : null}
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          title={deleteLabel}
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only sm:not-sr-only">Delete</span>
        </Button>
      ) : null}
    </div>
  );
}
