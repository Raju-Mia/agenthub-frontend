"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/molecules/admin-page-header";
import type {
  MockAgent,
  MockCustomer,
  MockDevice,
  MockWorker,
} from "@/mocks";
import { LOCK_JOB_STEPS } from "../lib/lock-job";
import { PendingLockPanel } from "./pending-lock-panel";

type PendingLocksPageProps = {
  devices: MockDevice[];
  agents: MockAgent[];
  workers: MockWorker[];
  customers: MockCustomer[];
};

export function PendingLocksPage({
  devices,
  agents,
  workers,
  customers,
}: PendingLocksPageProps) {
  const [records, setRecords] = useState(devices);
  const [toast, setToast] = useState<string | null>(null);

  const workerMap = useMemo(
    () => new Map(workers.map((w) => [w.id, w])),
    [workers],
  );
  const agentMap = useMemo(
    () => new Map(agents.map((a) => [a.id, a])),
    [agents],
  );

  const awaiting = records.filter((d) => d.assignmentStatus === "awaiting").length;
  const inProgress = records.filter(
    (d) => d.assignmentStatus === "in_progress",
  ).length;
  const completed = records.filter(
    (d) => d.assignmentStatus === "completed",
  ).length;

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function assignDevices(deviceIds: string[], nextWorkerId: string) {
    const worker = workerMap.get(nextWorkerId);
    if (!worker) return;
    const agent = agentMap.get(worker.agentId);
    setRecords((prev) =>
      prev.map((device) =>
        deviceIds.includes(device.id)
          ? {
              ...device,
              workerId: worker.id,
              agentId: worker.agentId,
              assignmentStatus: "in_progress" as const,
              status: "locked" as const,
              updatedAt: new Date().toISOString(),
            }
          : device,
      ),
    );
    flash(
      `In progress · ${worker.displayName} / ${agent?.serial ?? worker.agentSerial}`,
    );
  }

  function completeDevices(deviceIds: string[]) {
    setRecords((prev) =>
      prev.map((device) =>
        deviceIds.includes(device.id)
          ? {
              ...device,
              assignmentStatus: "completed" as const,
              status: "unlocked" as const,
              updatedAt: new Date().toISOString(),
            }
          : device,
      ),
    );
    flash(`Completed ${deviceIds.length} unlock job(s)`);
  }

  function returnDevices(deviceIds: string[]) {
    setRecords((prev) =>
      prev.map((device) =>
        deviceIds.includes(device.id)
          ? {
              ...device,
              workerId: undefined,
              agentId: undefined,
              assignmentStatus: "awaiting" as const,
              status: "locked" as const,
              updatedAt: new Date().toISOString(),
            }
          : device,
      ),
    );
    flash(`${deviceIds.length} returned to awaiting assignment`);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Pending Lock"
        description="Manage lock jobs from assignment through successful unlock."
      />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="admin-card rounded-xl border border-border/80 bg-card px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Workflow
          </p>
          <ol className="mt-3 space-y-2">
            {LOCK_JOB_STEPS.map((step, index) => (
              <li key={step.id} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">
                  {index + 1}.
                </span>
                <span>
                  <span className="font-medium">{step.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {step.hint}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <SummaryCard label="Awaiting" count={awaiting} />
        <SummaryCard label="In progress" count={inProgress} />
        <SummaryCard label="Completed" count={completed} />
      </div>

      {toast ? (
        <p
          className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
          role="status"
        >
          {toast}
        </p>
      ) : null}

      <PendingLockPanel
        devices={records}
        workers={workers}
        agents={agents}
        customers={customers}
        onAssign={assignDevices}
        onComplete={completeDevices}
        onReturn={returnDevices}
      />
    </div>
  );
}

function SummaryCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="admin-card rounded-xl border border-border/80 bg-card px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">
        {count}
      </p>
    </div>
  );
}
