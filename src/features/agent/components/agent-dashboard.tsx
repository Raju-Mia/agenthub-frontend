"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  buttonVariants,
} from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { MockAgent, MockWorker } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

type AgentDashboardProps = {
  agent: MockAgent;
  workers: MockWorker[];
};

export function AgentDashboard({ agent, workers }: AgentDashboardProps) {

  const { format } = useMoney();
  const commissionShare = Math.round(
    (agent.approvedTk * agent.commissionPercent) / 100,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="approved">Agent</Badge>
            <Badge variant="secondary" className="font-mono">
              {agent.serial}
            </Badge>
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Welcome, {agent.displayName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your workers only — you cannot create other agents.
          </p>
        </div>
        <Link
          href="/agent/workers/new"
          className={cn(buttonVariants())}
        >
          Create worker
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="My workers" value={String(workers.length)} />
        <Stat
          label="Pending"
          value={format(agent.pendingTk)}
          hint="Under your workers"
        />
        <Stat
          label="Approved volume"
          value={format(agent.approvedTk)}
          hint="Rollup of your workers"
        />
        <Stat
          label="My commission"
          value={`${agent.commissionPercent}%`}
          hint={`≈ ${format(commissionShare)} of approved`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Quick links</CardTitle>
          <CardDescription>
            Continue managing workers and earnings under your serial.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2 px-6 pb-6">
          <Link
            href="/agent/workers"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            My workers
          </Link>
          <Link
            href="/agent/earnings"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Earnings rollup
          </Link>
          <Link
            href="/agent/profile"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            My profile
          </Link>
        </div>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-display text-3xl tabular-nums">
          {value}
        </CardTitle>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardHeader>
    </Card>
  );
}
