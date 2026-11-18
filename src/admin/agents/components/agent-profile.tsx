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
import { CommissionControl } from "./commission-control";
import { useMoney } from "@/hooks/use-money";

type AgentProfileProps = {
  agent: MockAgent;
  workers: MockWorker[];
  transactions: Array<{
    transaction: MockTransaction;
    workerName: string;
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

function txnBadge(status: MockTransaction["status"]) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "agent_verified":
      return <Badge variant="pending">Awaiting admin</Badge>;
    case "approved":
      return <Badge variant="approved">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function AgentProfile({
  agent,
  workers,
  transactions,
}: AgentProfileProps) {

  const { format } = useMoney();
  const commissionShare = Math.round(
    (agent.approvedTk * agent.commissionPercent) / 100,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={agent.status === "active" ? "approved" : "inactive"}
            >
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
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/agents/${agent.id}/edit`}
            className={cn(buttonVariants())}
          >
            Edit
          </Link>
          <Link
            href="/admin/agents"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to agents
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MoneyStat
          label="Workers"
          value={String(workers.length)}
          hint="Under this agent"
          tone="slate"
        />
        <MoneyStat
          label="Pending"
          value={format(agent.pendingTk)}
          hint="Awaiting verify"
          tone="pending"
        />
        <MoneyStat
          label="Approved"
          value={format(agent.approvedTk)}
          hint="Worker volume"
          tone="approved"
        />
        <MoneyStat
          label="Commission"
          value={format(commissionShare)}
          hint={`${agent.commissionPercent}% share`}
          tone="teal"
        />
      </div>

      <CommissionControl
        initialPercent={agent.commissionPercent}
        agentName={agent.displayName}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Workers</CardTitle>
          <CardDescription>
            Workers belong to this agent only — open profile for earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workers.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No workers under this agent yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
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
                        href={`/admin/workers/${worker.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {worker.displayName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {worker.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          worker.status === "active" ? "approved" : "inactive"
                        }
                      >
                        {worker.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums text-amber-600">
                      {format(worker.pendingTk)}
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums text-teal-700">
                      {format(worker.approvedTk)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {worker.jobsCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Recent transactions
          </CardTitle>
          <CardDescription>
            Activity for workers under {agent.serial}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No transactions for this agent yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(
                  ({ transaction, workerName, customerName }) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{workerName}</TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell className="font-semibold tabular-nums text-foreground">
                        {format(transaction.amountTk)}
                      </TableCell>
                      <TableCell>{txnBadge(transaction.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {shortDate(transaction.createdAt)}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MoneyStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: "slate" | "pending" | "approved" | "teal";
}) {
  const styles = {
    slate: {
      card: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
      value: "text-slate-900",
      rail: "bg-slate-700",
    },
    pending: {
      card: "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white",
      value: "text-amber-700",
      rail: "bg-amber-500",
    },
    approved: {
      card: "border-teal-200/80 bg-gradient-to-br from-teal-50 to-white",
      value: "text-teal-800",
      rail: "bg-teal-600",
    },
    teal: {
      card: "border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white",
      value: "text-emerald-800",
      rail: "bg-emerald-600",
    },
  }[tone];

  return (
    <div
      className={cn(
        "admin-card relative overflow-hidden rounded-xl border p-5",
        styles.card,
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", styles.rail)} />
      <p className="pl-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 pl-2 font-display text-3xl font-semibold tabular-nums tracking-tight",
          styles.value,
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 pl-2 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
