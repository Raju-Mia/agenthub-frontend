"use client";

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
} from "@/components/atoms";
import { EmptyState } from "@/components/molecules/empty-state";
import { useMoney } from "@/hooks/use-money";
import { formatPoints } from "@/lib/utils";
import type { MockTransaction, MockWorker } from "@/mocks";

type WorkerEarningsViewProps = {
  worker: MockWorker;
  transactions: Array<{
    transaction: MockTransaction;
    customerName: string;
  }>;
};

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function WorkerEarningsView({
  worker,
  transactions,
}: WorkerEarningsViewProps) {
  const { format, pointsRule } = useMoney();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          My earnings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pending waits for agent verify + admin approve · then becomes real
          earning
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-status-pending/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardDescription>Pending</CardDescription>
              <Badge variant="pending">Pending</Badge>
            </div>
            <CardTitle className="font-display text-3xl tabular-nums">
              {format(worker.pendingTk)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-status-approved/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardDescription>Approved (real)</CardDescription>
              <Badge variant="approved">Approved</Badge>
            </div>
            <CardTitle className="font-display text-3xl tabular-nums">
              {format(worker.approvedTk)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardDescription>Points</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">
              {formatPoints(worker.points)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{pointsRule}</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">History</CardTitle>
          <CardDescription>Your earning entries (mock)</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState
              title="No earnings yet"
              description="Completed unlocks will show here after payment."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(({ transaction, customerName }) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell className="tabular-nums">
                      {format(transaction.amountTk)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {transaction.points}
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
                    <TableCell className="text-muted-foreground">
                      {shortDate(transaction.createdAt)}
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
