"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  buttonVariants,
} from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { MockAgent } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

type TopAgentsTableProps = {
  agents: MockAgent[];
};

export function TopAgentsTable({ agents }: TopAgentsTableProps) {

  const { format } = useMoney();
  return (
    <Card className="admin-card border-border/80">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b border-border/60 pb-5">
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Performance
          </p>
          <CardTitle className="font-display text-xl">
            Top agents by volume
          </CardTitle>
          <CardDescription>
            Approved earnings rollup · commission shown per agent
          </CardDescription>
        </div>
        <Link
          href="/admin/agents"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Manage agents
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Workers</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/agents/${agent.id}`}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {agent.displayName}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {agent.serial}
                </TableCell>
                <TableCell className="tabular-nums">
                  {agent.workersCount}
                </TableCell>
                <TableCell className="tabular-nums">
                  {agent.commissionPercent}%
                </TableCell>
                <TableCell className="tabular-nums text-status-pending">
                  {format(agent.pendingTk)}
                </TableCell>
                <TableCell className="tabular-nums font-medium">
                  {format(agent.approvedTk)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={agent.status === "active" ? "approved" : "inactive"}
                  >
                    {agent.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
