"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input } from "@/components/atoms";
import { TablePagination } from "@/components/molecules/table-pagination";
import { cn } from "@/lib/utils";
import type {
  DeviceAssignmentStatus,
  MockAgent,
  MockCustomer,
  MockDevice,
  MockWorker,
} from "@/mocks";
import {
  LOCK_JOB_STEPS,
  type LockJobFilter,
  lockJobShort,
} from "../lib/lock-job";

const PAGE_SIZE = 6;

type PendingLockPanelProps = {
  devices: MockDevice[];
  workers: MockWorker[];
  agents: MockAgent[];
  customers: MockCustomer[];
  onAssign: (deviceIds: string[], workerId: string) => void;
  onComplete: (deviceIds: string[]) => void;
  onReturn: (deviceIds: string[]) => void;
};

export function PendingLockPanel({
  devices,
  workers,
  agents,
  customers,
  onAssign,
  onComplete,
  onReturn,
}: PendingLockPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [workerId, setWorkerId] = useState(workers[0]?.id ?? "");
  const [filter, setFilter] = useState<LockJobFilter>("awaiting");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const customerMap = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers],
  );
  const workerMap = useMemo(
    () => new Map(workers.map((w) => [w.id, w])),
    [workers],
  );
  const agentMap = useMemo(
    () => new Map(agents.map((a) => [a.id, a])),
    [agents],
  );

  const counts = useMemo(() => {
    const awaiting = devices.filter((d) => d.assignmentStatus === "awaiting").length;
    const inProgress = devices.filter(
      (d) => d.assignmentStatus === "in_progress",
    ).length;
    const completed = devices.filter(
      (d) => d.assignmentStatus === "completed",
    ).length;
    return { awaiting, inProgress, completed, all: devices.length };
  }, [devices]);

  const pool = useMemo(() => {
    if (filter === "all") return devices;
    return devices.filter((d) => d.assignmentStatus === filter);
  }, [devices, filter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((device) => {
      const customer = customerMap.get(device.customerId);
      const worker = device.workerId
        ? workerMap.get(device.workerId)
        : undefined;
      return (
        device.id.toLowerCase().includes(q) ||
        device.model.toLowerCase().includes(q) ||
        device.contact.toLowerCase().includes(q) ||
        device.location.toLowerCase().includes(q) ||
        (customer?.name.toLowerCase().includes(q) ?? false) ||
        (worker?.displayName.toLowerCase().includes(q) ?? false)
      );
    });
  }, [pool, search, customerMap, workerMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [filter, search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const selectedWorker = workerMap.get(workerId);
  const selectedAgent = selectedWorker
    ? agentMap.get(selectedWorker.agentId)
    : undefined;

  const pageIds = pageRows.map((d) => d.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  const selectedRows = devices.filter((d) => selected.includes(d.id));
  const canAssign =
    selectedRows.length > 0 &&
    selectedRows.every((d) => d.assignmentStatus === "awaiting");
  const canComplete =
    selectedRows.length > 0 &&
    selectedRows.every((d) => d.assignmentStatus === "in_progress");
  const canReturn =
    selectedRows.length > 0 &&
    selectedRows.every((d) => d.assignmentStatus === "in_progress");

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function togglePage() {
    if (allPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
      return;
    }
    setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
  }

  function statusTone(status: DeviceAssignmentStatus) {
    if (status === "awaiting") return "outline" as const;
    if (status === "in_progress") return "pending" as const;
    return "approved" as const;
  }

  return (
    <section className="admin-card overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="border-b border-border/60 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Lock jobs
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              One pipeline: Awaiting assignment → In progress → Completed.
            </p>
          </div>
          <ol className="flex flex-wrap gap-2">
            {LOCK_JOB_STEPS.map((step, index) => (
              <li
                key={step.id}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {index + 1}
                </span>
                <span className="font-medium">{step.short}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 flex flex-wrap gap-1 rounded-lg border border-border/70 p-0.5">
          {(
            [
              ["awaiting", counts.awaiting],
              ["in_progress", counts.inProgress],
              ["completed", counts.completed],
              ["all", counts.all],
            ] as const
          ).map(([id, count]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                filter === id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {id === "all" ? "All" : lockJobShort(id)}
              <span className="ml-1.5 tabular-nums text-muted-foreground">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search device, customer, worker, location…"
            className="sm:max-w-sm"
          />
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allPageSelected}
                onChange={togglePage}
                disabled={pageRows.length === 0}
                className="size-4 rounded border-border"
              />
              Page
            </label>
            {selected.length > 0 ? (
              <button
                type="button"
                className="text-xs hover:underline"
                onClick={() => setSelected([])}
              >
                Clear · {selected.length}
              </button>
            ) : null}
          </div>
        </div>

        {pageRows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No jobs in this view
            {search.trim() ? " match this search" : ""}.
          </p>
        ) : (
          <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
            {pageRows.map((device) => {
              const customer = customerMap.get(device.customerId);
              const worker = device.workerId
                ? workerMap.get(device.workerId)
                : undefined;
              const agent = device.agentId
                ? agentMap.get(device.agentId)
                : undefined;
              const checked = selected.includes(device.id);

              return (
                <li key={device.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer gap-3 px-3.5 py-3 transition sm:items-center",
                      checked ? "bg-muted/50" : "hover:bg-muted/20",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(device.id)}
                      className="mt-1 size-4 shrink-0 rounded border-border sm:mt-0"
                    />
                    <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1fr)_auto] sm:items-center">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/devices/${device.id}`}
                          className="text-sm font-semibold hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {device.model}
                        </Link>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {device.id} · {device.contact}
                        </p>
                      </div>
                      <div className="min-w-0 text-sm">
                        <p className="truncate font-medium">
                          {customer?.name ?? "—"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {device.location}
                        </p>
                      </div>
                      <div className="min-w-0 text-sm">
                        {worker || agent ? (
                          <>
                            <p className="truncate font-medium">
                              {worker?.displayName ?? "—"}
                            </p>
                            <p className="truncate font-mono text-[11px] text-muted-foreground">
                              {agent?.serial ?? "—"}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No owner yet
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={statusTone(device.assignmentStatus)}
                        className="w-fit font-normal"
                      >
                        {lockJobShort(device.assignmentStatus)}
                      </Badge>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        <TablePagination
          page={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          noun="jobs"
        />
      </div>

      <div className="border-t border-border/60 bg-muted/15 px-4 py-4 sm:px-5">
        {filter === "awaiting" || canAssign ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Assign worker
                </span>
                <select
                  className="h-10 w-full rounded-lg border border-border/80 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                >
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.displayName} · {worker.agentSerial}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Agent (auto)
                </span>
                <div className="flex h-10 items-center rounded-lg border border-border/60 bg-white px-3">
                  <p className="truncate font-mono text-xs">
                    {selectedAgent
                      ? `${selectedAgent.serial} · ${selectedAgent.displayName}`
                      : "Select a worker"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!canAssign || !workerId}
              onClick={() => {
                onAssign(selected, workerId);
                setSelected([]);
              }}
            >
              Assign → In progress
            </Button>
          </div>
        ) : filter === "in_progress" || canComplete ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Mark completed when the unlock succeeds. Return sends the job back
              to awaiting assignment.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!canReturn}
                onClick={() => {
                  onReturn(selected);
                  setSelected([]);
                }}
              >
                Return to awaiting
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!canComplete}
                onClick={() => {
                  onComplete(selected);
                  setSelected([]);
                }}
              >
                Mark completed
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Completed jobs are finished. Open a device for history, or filter
            Awaiting / In progress to manage active work.
          </p>
        )}
      </div>
    </section>
  );
}
