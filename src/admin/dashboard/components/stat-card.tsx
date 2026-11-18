import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  accent?: "teal" | "slate" | "amber" | "rose";
  className?: string;
};

const accentMap = {
  teal: {
    rail: "bg-teal-600",
    icon: "border-teal-200 bg-teal-50 text-teal-700",
  },
  slate: {
    rail: "bg-slate-700",
    icon: "border-slate-200 bg-slate-50 text-slate-700",
  },
  amber: {
    rail: "bg-amber-500",
    icon: "border-amber-200 bg-amber-50 text-amber-700",
  },
  rose: {
    rail: "bg-rose-500",
    icon: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "teal",
  className,
}: StatCardProps) {
  const tone = accentMap[accent];

  return (
    <div
      className={cn(
        "admin-card relative overflow-hidden rounded-xl border border-border/80 bg-card",
        className,
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", tone.rail)} />
      <div className="flex items-start justify-between gap-3 p-5 pl-6">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg border",
              tone.icon,
            )}
          >
            <Icon className="size-4" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
