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
import type { MockAgent, MockTransaction, MockWorker } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

type AgentEarningsProps = {
  agent: MockAgent;
  workers: MockWorker[];
  transactions: Array<{
    transaction: MockTransaction;
    workerName: string;
  }>;
};

export function AgentEarnings({
  agent,
  workers,
  transactions,
}: AgentEarningsProps) {

  const { format } = useMoney();
  const commissionShare = Math.round(
    (agent.approvedTk * agent.commissionPercent) / 100,
  );
  const workerShare = agent.approvedTk - commissionShare;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          My earnings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rollup of workers under {agent.serial} · commission{" "}
          <span className="font-medium text-foreground">
            {agent.commissionPercent}%
          </span>{" "}
          (default 50%)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums text-status-pending">
              {format(agent.pendingTk)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Approved volume</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">
              {format(agent.approvedTk)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-status-approved/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardDescription>My commission share</CardDescription>
              <Badge variant="approved">{agent.commissionPercent}%</Badge>
            </div>
            <CardTitle className="font-display text-3xl tabular-nums">
              {format(commissionShare)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Workers&apos; share (est.)</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">
              {format(workerShare)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="font-display text-xl">
              Workers contribution
            </CardTitle>
            <CardDescription>Approved volume per worker under you</CardDescription>
          </div>
          <Link
            href="/agent/workers"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Manage workers
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Jobs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/agent/workers/${worker.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {worker.displayName}
                    </Link>
                  </TableCell>
                  <TableCell className="tabular-nums text-status-pending">
                    {format(worker.pendingTk)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {format(worker.approvedTk)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {worker.jobsCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Recent transactions
          </CardTitle>
          <CardDescription>Activity under your workers (mock)</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No transactions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(({ transaction, workerName }) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{workerName}</TableCell>
                    <TableCell className="tabular-nums">
                      {format(transaction.amountTk)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "approved"
                            ? "approved"
                            : transaction.status === "agent_verified"
                              ? "pending"
                              : transaction.status === "rejected"
                                ? "destructive"
                                : "secondary"
                        }
                      >
                        {transaction.status === "agent_verified"
                          ? "Awaiting admin"
                          : transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
