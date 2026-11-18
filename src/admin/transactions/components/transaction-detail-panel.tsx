"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { MapPin, Phone, Smartphone, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { useMoney } from "@/hooks/use-money";
import { cn } from "@/lib/utils";
import type {
  MockAgent,
  MockCustomer,
  MockDevice,
  MockTransaction,
  MockWorker,
  TransactionStatus,
} from "@/mocks";

type TransactionDetailPanelProps = {
  transaction: MockTransaction;
  agent?: MockAgent;
  worker?: MockWorker;
  customer?: MockCustomer;
  device?: MockDevice;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  embedded?: boolean;
};

function shortDate(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function stepState(
  status: TransactionStatus,
  step: "paid" | "pending" | "verified" | "approved",
): "done" | "current" | "todo" | "rejected" {
  if (status === "rejected") {
    if (step === "approved") return "rejected";
    if (step === "paid" || step === "pending") return "done";
    return "done";
  }
  const order = ["paid", "pending", "verified", "approved"] as const;
  const currentIndex =
    status === "pending"
      ? 1
      : status === "agent_verified"
        ? 2
        : status === "approved"
          ? 3
          : 1;
  const stepIndex = order.indexOf(step);
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "current";
  return "todo";
}

export function TransactionDetailPanel({
  transaction,
  agent,
  worker,
  customer,
  device,
  onClose,
  onApprove,
  onReject,
  embedded = false,
}: TransactionDetailPanelProps) {
  const { format, pointsRule } = useMoney();
  const commission = agent?.commissionPercent ?? 50;
  const canDecide =
    transaction.status === "agent_verified" ||
    transaction.status === "pending";

  const steps = [
    {
      key: "paid" as const,
      title: "Customer paid",
      body: `Payment received · ${pointsRule}`,
    },
    {
      key: "pending" as const,
      title: "Pending (worker)",
      body: "Earning sits on worker profile as pending",
    },
    {
      key: "verified" as const,
      title: "Agent verified",
      body: "Owning agent confirmed the unlock job",
    },
    {
      key: "approved" as const,
      title: "Admin approved → Real earning",
      body: `Counts as real earning · agent commission ${commission}%`,
    },
  ];

  const content = (
    <Card
      className={cn(
        "admin-card border-border/80",
        embedded ? "border-0 shadow-none" : "shadow-xl",
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border/60 pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="font-mono text-lg">{transaction.id}</CardTitle>
            <StatusBadge status={transaction.status} />
          </div>
          <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
            {format(transaction.amountTk)}
          </p>
          <p className="text-xs text-muted-foreground">
            {transaction.points} pts · {pointsRule}
          </p>
        </div>
        {!embedded ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {device ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <InfoChip
              icon={Smartphone}
              label="Device"
              value={device.model}
              href={`/admin/devices/${device.id}`}
            />
            <InfoChip
              icon={MapPin}
              label="Location"
              value={device.location}
            />
            <InfoChip
              icon={Phone}
              label="Contact"
              value={device.contact}
              mono
            />
          </div>
        ) : null}

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <Meta
            label="Customer"
            value={
              customer ? (
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {customer.name}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <Meta
            label="Worker"
            value={
              worker ? (
                <Link
                  href={`/admin/workers/${worker.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {worker.displayName}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <Meta
            label="Agent"
            value={
              agent ? (
                <Link
                  href={`/admin/agents/${agent.id}`}
                  className="font-mono text-xs underline-offset-4 hover:underline"
                >
                  {agent.serial}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <Meta
            label="Device ID"
            value={
              device ? (
                <Link
                  href={`/admin/devices/${device.id}`}
                  className="font-mono text-xs underline-offset-4 hover:underline"
                >
                  {device.id}
                </Link>
              ) : (
                "—"
              )
            }
          />
          <Meta label="Created" value={shortDate(transaction.createdAt)} />
          <Meta label="Verified" value={shortDate(transaction.verifiedAt)} />
          <Meta label="Approved" value={shortDate(transaction.approvedAt)} />
          <Meta label="Commission" value={`${commission}%`} />
        </div>

        {device ? (
          <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Device access snapshot
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 tabular-nums">
              <span>Gallery {device.access.galleryCount}</span>
              <span>Contacts {device.access.contactsCount}</span>
              <span>Apps {device.access.appsCount}</span>
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-3 text-sm font-semibold">Pipeline</p>
          <ol className="space-y-2">
            {steps.map((step) => {
              const state = stepState(transaction.status, step.key);
              return (
                <li
                  key={step.key}
                  className="flex gap-3 rounded-lg border border-border/70 px-3 py-2.5"
                >
                  <StepDot state={state} />
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={!canDecide}
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!canDecide}
            onClick={onReject}
          >
            Reject
          </Button>
          {!embedded ? (
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
          ) : (
            <Link
              href="/admin/transactions"
              className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Back to list
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <div className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-background p-4 shadow-2xl sm:p-6">
        {content}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
  if (status === "agent_verified")
    return <Badge variant="pending">Awaiting admin</Badge>;
  if (status === "approved") return <Badge variant="approved">Approved</Badge>;
  return <Badge variant="destructive">Rejected</Badge>;
}

function InfoChip({
  icon: Icon,
  label,
  value,
  href,
  mono,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-[10px] uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p
        className={cn(
          "mt-1.5 text-sm font-semibold",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </p>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl border border-border/70 bg-card px-3 py-2.5 transition-colors hover:border-teal-300 hover:bg-teal-50/40"
      >
        {body}
      </Link>
    );
  }
  return (
    <div className="rounded-xl border border-border/70 bg-card px-3 py-2.5">
      {body}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border border-border/70 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function StepDot({
  state,
}: {
  state: "done" | "current" | "todo" | "rejected";
}) {
  return (
    <span
      className={
        state === "done"
          ? "mt-1 size-2.5 shrink-0 rounded-full bg-status-approved"
          : state === "current"
            ? "mt-1 size-2.5 shrink-0 rounded-full bg-status-pending"
            : state === "rejected"
              ? "mt-1 size-2.5 shrink-0 rounded-full bg-destructive"
              : "mt-1 size-2.5 shrink-0 rounded-full bg-border"
      }
    />
  );
}
