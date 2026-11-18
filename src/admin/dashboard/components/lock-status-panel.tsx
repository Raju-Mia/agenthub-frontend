import Link from "next/link";
import { Lock, ShieldCheck, Unlock } from "lucide-react";
import {
  Badge,
  buttonVariants,
} from "@/components/atoms";
import { cn } from "@/lib/utils";

type LockStatusPanelProps = {
  breakdown: {
    locked: number;
    autoSolved: number;
    unlocked: number;
    total: number;
    lockedPercent: number;
    autoSolvedPercent: number;
    unlockedPercent: number;
  };
};

export function LockStatusPanel({ breakdown }: LockStatusPanelProps) {
  const segments = [
    {
      key: "locked",
      label: "Locked",
      percent: breakdown.lockedPercent,
      count: breakdown.locked,
      bar: "bg-status-locked",
      badge: "locked" as const,
      icon: Lock,
      tint: "from-rose-500/10 to-transparent",
      ring: "ring-rose-200",
    },
    {
      key: "auto",
      label: "Auto solved",
      percent: breakdown.autoSolvedPercent,
      count: breakdown.autoSolved,
      bar: "bg-status-auto",
      badge: "auto" as const,
      icon: ShieldCheck,
      tint: "from-blue-500/10 to-transparent",
      ring: "ring-blue-200",
    },
    {
      key: "unlocked",
      label: "Unlocked",
      percent: breakdown.unlockedPercent,
      count: breakdown.unlocked,
      bar: "bg-status-unlocked",
      badge: "unlocked" as const,
      icon: Unlock,
      tint: "from-emerald-500/10 to-transparent",
      ring: "ring-emerald-200",
    },
  ];

  return (
    <section className="admin-card overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Device fleet
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Lock health
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {breakdown.total} devices monitored across locked, auto, and unlocked
            states
          </p>
        </div>
        <Link
          href="/admin/devices"
          className={cn(buttonVariants({ size: "sm" }), "self-start sm:self-auto")}
        >
          Open devices
        </Link>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="relative h-4 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-border/60">
          <div className="absolute inset-0 flex">
            {segments.map((segment) => (
              <div
                key={segment.key}
                className={cn("h-full transition-all", segment.bar)}
                style={{ width: `${segment.percent}%` }}
                title={`${segment.label}: ${segment.percent}%`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <div
                key={segment.key}
                className={cn(
                  "relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br p-4 ring-1 ring-inset",
                  segment.tint,
                  segment.ring,
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-foreground/70" />
                    <span className="text-sm font-medium text-foreground">
                      {segment.label}
                    </span>
                  </div>
                  <Badge variant={segment.badge}>{segment.count}</Badge>
                </div>
                <p className="mt-4 font-display text-4xl font-semibold tabular-nums tracking-tight">
                  {segment.percent}
                  <span className="ml-0.5 text-2xl text-muted-foreground">%</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
