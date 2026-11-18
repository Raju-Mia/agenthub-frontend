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
import { useMoney } from "@/hooks/use-money";
import { cn, formatPoints } from "@/lib/utils";
import type { MockAgent, MockWorker } from "@/mocks";

type WorkerDashboardProps = {
  worker: MockWorker;
  agent?: MockAgent;
  deviceCount: number;
};

export function WorkerDashboard({
  worker,
  agent,
  deviceCount,
}: WorkerDashboardProps) {
  const { format, pointsRule } = useMoney();

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="approved">Worker</Badge>
          <Badge variant="secondary" className="font-mono">
            {worker.agentSerial}
          </Badge>
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Hi, {worker.displayName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your unlock jobs and earnings · {pointsRule}
          {agent ? ` · under ${agent.displayName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Pending" value={format(worker.pendingTk)} />
        <Stat label="Approved" value={format(worker.approvedTk)} />
        <Stat label="Points" value={formatPoints(worker.points)} />
        <Stat
          label="Jobs / devices"
          value={String(worker.jobsCount)}
          hint={`${deviceCount} linked devices`}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/worker/earnings" className={cn(buttonVariants())}>
          View earnings
        </Link>
        <Link
          href="/worker/devices"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          My devices
        </Link>
        <Link
          href="/worker/profile"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          My profile
        </Link>
      </div>
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
