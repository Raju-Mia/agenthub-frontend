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
import type { MockTransaction } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

export type ApprovalQueueRow = {
  transaction: MockTransaction;
  workerName: string;
  agentSerial: string;
  customerName: string;
};

type PendingApprovalsQueueProps = {
  rows: ApprovalQueueRow[];
};

function statusBadge(status: MockTransaction["status"]) {
  if (status === "agent_verified") {
    return <Badge variant="pending">Awaiting admin</Badge>;
  }
  if (status === "pending") {
    return <Badge variant="secondary">Pending verify</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
}

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function PendingApprovalsQueue({ rows }: PendingApprovalsQueueProps) {

  const { format } = useMoney();
  return (
    <Card className="admin-card border-border/80">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b border-border/60 pb-5">
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Pipeline
          </p>
          <CardTitle className="font-display text-xl">
            Approval queue
          </CardTitle>
          <CardDescription>
            Pay → pending → agent verify → admin approve
          </CardDescription>
        </div>
        <Link
          href="/admin/transactions"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          All transactions
        </Link>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No items waiting on admin right now.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ transaction, workerName, agentSerial, customerName }) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/admin/transactions/${transaction.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {transaction.id}
                    </Link>
                  </TableCell>
                  <TableCell>{workerName}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {agentSerial}
                  </TableCell>
                  <TableCell>{customerName}</TableCell>
                  <TableCell className="tabular-nums">
                    {format(transaction.amountTk)}
                  </TableCell>
                  <TableCell>{statusBadge(transaction.status)}</TableCell>
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
  );
}
