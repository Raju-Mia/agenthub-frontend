"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/hooks/use-admin-table";

type SortableThProps = {
  label: string;
  sortKey: string;
  activeKey?: string;
  direction?: SortDir;
  onSort: (key: string) => void;
  className?: string;
};

export function SortableTh({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className,
}: SortableThProps) {
  const active = activeKey === sortKey;
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide transition hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className="size-3.5 opacity-70" aria-hidden />
      </button>
    </TableHead>
  );
}
