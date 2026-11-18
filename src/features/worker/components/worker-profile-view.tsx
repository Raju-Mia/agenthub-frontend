"use client";

import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";

import type { MockAgent, MockWorker } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

type WorkerProfileViewProps = {
  worker: MockWorker;
  agent?: MockAgent;
};

export function WorkerProfileView({
  worker,
  agent,
}: WorkerProfileViewProps) {

  const { format } = useMoney();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={worker.status === "active" ? "approved" : "inactive"}
          >
            {worker.status}
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {worker.agentSerial}
          </Badge>
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          {worker.displayName}
        </h2>
        <p className="text-sm text-muted-foreground">{worker.email}</p>
        {agent ? (
          <p className="text-sm text-muted-foreground">
            Agent: {agent.displayName} ({agent.serial})
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="font-display text-2xl tabular-nums">
              {format(worker.pendingTk)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="font-display text-2xl tabular-nums">
              {format(worker.approvedTk)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Jobs completed</CardDescription>
            <CardTitle className="font-display text-2xl tabular-nums">
              {worker.jobsCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role limits</CardTitle>
          <CardDescription>
            Workers cannot create users or manage other workers. Earnings stay
            pending until agent verify and admin approve.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
