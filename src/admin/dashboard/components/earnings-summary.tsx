"use client";

import { Badge } from "@/components/atoms";
import { useMoney } from "@/hooks/use-money";
import { Banknote, CircleCheckBig, Hourglass } from "lucide-react";

type EarningsSummaryProps = {
  pendingTk: number;
  approvedTk: number;
  todayVolumeTk: number;
  awaitingAdmin: number;
};

export function EarningsSummary({
  pendingTk,
  approvedTk,
  todayVolumeTk,
  awaitingAdmin,
}: EarningsSummaryProps) {
  const { format, pointsRule } = useMoney();

  const cards = [
    {
      label: "Pending earnings",
      value: format(pendingTk),
      hint: `${pointsRule} · waiting verify / approve`,
      badge: <Badge variant="pending">Pending</Badge>,
      icon: Hourglass,
      accent: "border-l-status-pending",
      iconWrap: "border-amber-200 bg-amber-50 text-amber-700",
    },
    {
      label: "Approved (real)",
      value: format(approvedTk),
      hint: "Settled volume across all workers",
      badge: <Badge variant="approved">Approved</Badge>,
      icon: CircleCheckBig,
      accent: "border-l-status-approved",
      iconWrap: "border-teal-200 bg-teal-50 text-teal-700",
    },
    {
      label: "Today's volume",
      value: format(todayVolumeTk),
      hint: `${awaitingAdmin} agent-verified awaiting admin`,
      badge: <Badge variant="secondary">{awaitingAdmin} to approve</Badge>,
      icon: Banknote,
      accent: "border-l-slate-700",
      iconWrap: "border-slate-200 bg-slate-50 text-slate-700",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`admin-card overflow-hidden rounded-xl border border-border/80 border-l-4 bg-card ${card.accent}`}
          >
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg border ${card.iconWrap}`}
                >
                  <Icon className="size-4" />
                </div>
                {card.badge}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">
                  {card.value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {card.hint}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
