"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
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
import { useMoney } from "@/hooks/use-money";
import { cn, formatPoints } from "@/lib/utils";
import type {
  MockAgent,
  MockDevice,
  MockTransaction,
  MockWorker,
} from "@/mocks";

type WorkerProfileProps = {
  worker: MockWorker;
  agent?: MockAgent;
  transactions: Array<{
    transaction: MockTransaction;
    customerName: string;
  }>;
  devices: MockDevice[];
  backHref?: string;
  backLabel?: string;
  agentHref?: string;
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

function deviceBadge(status: MockDevice["status"]) {
  if (status === "locked") return <Badge variant="locked">Locked</Badge>;
  if (status === "auto_solved") return <Badge variant="auto">Auto solved</Badge>;
  return <Badge variant="unlocked">Unlocked</Badge>;
}

export function WorkerProfile({
  worker,
  agent,
  transactions,
  devices,
  backHref = "/admin/workers",
  backLabel = "Back to workers",
  agentHref,
}: WorkerProfileProps) {
  const { format } = useMoney();
  const unlockedJobs = devices.filter((d) => d.status === "unlocked").length;
  const lockedJobs = devices.filter((d) => d.status === "locked").length;
  const resolvedAgentHref = agentHref ?? `/admin/agents/${worker.agentId}`;

  return (
    <div className="space-y-5">
      <div className="admin-card flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-lg font-semibold text-white">
            {worker.displayName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={worker.status === "active" ? "approved" : "inactive"}
              >
                {worker.status}
              </Badge>
              <Link href={resolvedAgentHref}>
                <Badge
                  variant="secondary"
                  className="font-mono hover:bg-muted"
                >
                  {worker.agentSerial}
                  {agent ? ` · ${agent.displayName}` : ""}
                </Badge>
              </Link>
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {worker.displayName}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{worker.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/workers/${worker.id}/edit`}
            className={cn(buttonVariants())}
          >
            Edit
          </Link>
          <Link
            href={backHref}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {backLabel}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MoneyStat
          label="Pending"
          value={format(worker.pendingTk)}
          hint="Awaiting approve"
          tone="pending"
        />
        <MoneyStat
          label="Approved"
          value={format(worker.approvedTk)}
          hint="Real earnings"
          tone="approved"
        />
        <MoneyStat
          label="Points"
          value={formatPoints(worker.points)}
          hint="Ledger points"
          tone="teal"
        />
        <MoneyStat
          label="Jobs"
          value={String(worker.jobsCount)}
          hint={`${unlockedJobs} unlocked · ${lockedJobs} locked`}
          tone="slate"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <Card className="admin-card border-border/80">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Basic info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5 text-sm">
            <MetaRow label="Name" value={worker.displayName} />
            <MetaRow label="Email" value={worker.email} />
            <MetaRow label="Status" value={worker.status} />
            <MetaRow
              label="Agent"
              value={
                <Link
                  href={resolvedAgentHref}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {worker.agentSerial}
                  {agent ? ` · ${agent.displayName}` : ""}
                </Link>
              }
            />
            <MetaRow label="Commission" value={`${agent?.commissionPercent ?? 50}%`} />
            <MetaRow label="Devices" value={String(devices.length)} />
          </CardContent>
        </Card>

        <Card className="admin-card border-border/80">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Earnings</CardTitle>
              <Badge variant="secondary">{transactions.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {transactions.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No earnings yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(({ transaction, customerName }) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        <Link
                          href={`/admin/transactions/${transaction.id}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {transaction.id}
                        </Link>
                      </TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell className="font-semibold tabular-nums text-teal-700">
                        {format(transaction.amountTk)}
                      </TableCell>
                      <TableCell>{txnBadge(transaction.status)}</TableCell>
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

      <Card className="admin-card border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Devices</CardTitle>
            <Badge variant="secondary">{devices.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {devices.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No devices linked.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <Link
                        href={`/admin/devices/${device.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {device.model}
                      </Link>
                      <div className="font-mono text-xs text-muted-foreground">
                        {device.id}
                      </div>
                    </TableCell>
                    <TableCell>{deviceBadge(device.status)}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {device.ip}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {shortDate(device.updatedAt)}
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

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
