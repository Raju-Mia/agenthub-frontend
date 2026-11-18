"use client";

import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";

import type { MockAgent } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

type AgentProfileViewProps = {
  agent: MockAgent;
  workersCount: number;
};

export function AgentProfileView({
  agent,
  workersCount,
}: AgentProfileViewProps) {

  const { format } = useMoney();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={agent.status === "active" ? "approved" : "inactive"}>
            {agent.status}
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {agent.serial}
          </Badge>
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          {agent.displayName}
        </h2>
        <p className="text-sm text-muted-foreground">{agent.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Commission</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">
              {agent.commissionPercent}%
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Default is 50% — set by admin
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Workers under me</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">
              {workersCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Approved rollup</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">
              {format(agent.approvedTk)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role limits</CardTitle>
          <CardDescription>
            This portal cannot create agents or view other agents&apos; workers.
            Admin manages commission and global approvals.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
