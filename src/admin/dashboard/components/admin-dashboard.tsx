import Link from "next/link";
import {
  ArrowLeftRight,
  Contact,
  HardHat,
  Plus,
  Settings,
  Smartphone,
  Users,
} from "lucide-react";
import {
  getAgentById,
  getCustomerById,
  getWorkerById,
  mockAgents,
  mockDashboardStats,
  mockDeviceStatusBreakdown,
  mockTransactionPipeline,
  mockTransactions,
} from "@/mocks";
import { buttonVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { StatCard } from "./stat-card";
import { LockStatusPanel } from "./lock-status-panel";
import { EarningsSummary } from "./earnings-summary";
import {
  PendingApprovalsQueue,
  type ApprovalQueueRow,
} from "./pending-approvals-queue";
import { TopAgentsTable } from "./top-agents-table";

function buildApprovalQueue(): ApprovalQueueRow[] {
  return mockTransactions
    .filter(
      (t) => t.status === "agent_verified" || t.status === "pending",
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6)
    .map((transaction) => ({
      transaction,
      workerName:
        getWorkerById(transaction.workerId)?.displayName ??
        transaction.workerId,
      agentSerial:
        getAgentById(transaction.agentId)?.serial ?? transaction.agentId,
      customerName:
        getCustomerById(transaction.customerId)?.name ??
        transaction.customerId,
    }));
}

const QUICK_ACTIONS = [
  {
    href: "/admin/agents/new",
    label: "Create agent",
    icon: Users,
    tone: "bg-teal-50 text-teal-700",
  },
  {
    href: "/admin/workers/new",
    label: "Create worker",
    icon: HardHat,
    tone: "bg-slate-100 text-slate-700",
  },
  {
    href: "/admin/customers/new",
    label: "Add customer",
    icon: Contact,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    href: "/admin/devices/new",
    label: "Register device",
    icon: Smartphone,
    tone: "bg-rose-50 text-rose-700",
  },
  {
    href: "/admin/transactions",
    label: "Review pipeline",
    icon: ArrowLeftRight,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    tone: "bg-emerald-50 text-emerald-700",
  },
] as const;

export function AdminDashboard() {
  const stats = mockDashboardStats;
  const topAgents = [...mockAgents].sort(
    (a, b) => b.approvedTk - a.approvedTk,
  );
  const awaiting = mockTransactionPipeline.agentVerified;
  const pending = mockTransactionPipeline.pending;
  const lockedPct = mockDeviceStatusBreakdown.lockedPercent;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Operations overview
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Live network health, approval queue, and earnings activity across
            agents, workers, and Lock App devices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/settings"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Customize
          </Link>
          <Link href="/admin/agents/new" className={cn(buttonVariants())}>
            <Plus className="size-4" />
            Create agent
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <AlertCard
          label="Awaiting admin"
          value={String(awaiting)}
          hint="Agent-verified jobs"
          href="/admin/transactions"
          tone="amber"
        />
        <AlertCard
          label="Pending pipeline"
          value={String(pending)}
          hint="Waiting agent verify"
          href="/admin/transactions"
          tone="rose"
        />
        <AlertCard
          label="Locked devices"
          value={`${lockedPct}%`}
          hint="Fleet currently locked"
          href="/admin/devices"
          tone="teal"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="admin-card group flex flex-col items-start gap-3 rounded-xl border border-border/80 bg-card p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  action.tone,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-teal-800">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Agents"
          value={String(stats.totalAgents)}
          hint="Managers in network"
          icon={Users}
          accent="teal"
        />
        <StatCard
          label="Workers"
          value={String(stats.totalWorkers)}
          hint="Field unlock capacity"
          icon={HardHat}
          accent="slate"
        />
        <StatCard
          label="Customers"
          value={String(stats.totalCustomers)}
          hint="Records only · no login"
          icon={Contact}
          accent="amber"
        />
        <StatCard
          label="Devices"
          value={String(stats.totalDevices)}
          hint="Active Lock App fleet"
          icon={Smartphone}
          accent="rose"
        />
      </div>

      <LockStatusPanel breakdown={mockDeviceStatusBreakdown} />

      <EarningsSummary
        pendingTk={stats.pendingTk}
        approvedTk={stats.approvedTk}
        todayVolumeTk={stats.todayVolumeTk}
        awaitingAdmin={awaiting}
      />

      <div className="grid gap-6 xl:grid-cols-1">
        <PendingApprovalsQueue rows={buildApprovalQueue()} />
        <TopAgentsTable agents={topAgents} />
      </div>
    </div>
  );
}

function AlertCard({
  label,
  value,
  hint,
  href,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
  tone: "amber" | "rose" | "teal";
}) {
  const tones = {
    amber: {
      wrap: "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white",
      value: "text-amber-700",
      chip: "bg-amber-100 text-amber-800",
    },
    rose: {
      wrap: "border-rose-200/80 bg-gradient-to-br from-rose-50 to-white",
      value: "text-rose-700",
      chip: "bg-rose-100 text-rose-800",
    },
    teal: {
      wrap: "border-teal-200/80 bg-gradient-to-br from-teal-50 to-white",
      value: "text-teal-700",
      chip: "bg-teal-100 text-teal-800",
    },
  }[tone];

  return (
    <Link
      href={href}
      className={cn(
        "admin-card rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md",
        tones.wrap,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
            tones.chip,
          )}
        >
          Focus
        </span>
      </div>
      <p
        className={cn(
          "mt-3 font-display text-3xl font-semibold tabular-nums tracking-tight",
          tones.value,
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}
