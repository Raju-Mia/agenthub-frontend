"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms";
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
import { ClaimDeviceModal } from "./claim-device-modal";

const PAGE_SIZE = 8;

type PendingLockPanelProps = {
  devices: MockDevice[];
  workers: MockWorker[];
  agents: MockAgent[];
  customers: MockCustomer[];
  onClaim: (deviceId: string, workerId: string) => void;
  onApprove: (deviceIds: string[]) => void;
  onReject: (deviceIds: string[]) => void;
  onComplete: (deviceIds: string[]) => void;
};

export function PendingLockPanel({
  devices,
  workers,
  agents,
  customers,
  onClaim,
  onApprove,
  onReject,
  onComplete,
}: PendingLockPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<LockJobFilter>("awaiting");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [claimDevice, setClaimDevice] = useState<MockDevice | null>(null);

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
    const claimed = devices.filter((d) => d.assignmentStatus === "claimed").length;
    const inProgress = devices.filter(
      (d) => d.assignmentStatus === "in_progress",
    ).length;
    const completed = devices.filter(
      (d) => d.assignmentStatus === "completed",
    ).length;
    return {
      awaiting,
      claimed,
      inProgress,
      completed,
      all: devices.length,
    };
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

  const selectedRows = devices.filter((d) => selected.includes(d.id));
  const canApprove =
    selectedRows.length > 0 &&
    selectedRows.every((d) => d.assignmentStatus === "claimed");
  const canReject = canApprove;
  const canComplete =
    selectedRows.length > 0 &&
    selectedRows.every((d) => d.assignmentStatus === "in_progress");

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function togglePage() {
    const ids = pageRows.map((d) => d.id);
    const allSelected = ids.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
      return;
    }
    setSelected((prev) => Array.from(new Set([...prev, ...ids])));
  }

  function statusTone(status: DeviceAssignmentStatus) {
    if (status === "awaiting") return "outline" as const;
    if (status === "claimed") return "pending" as const;
    if (status === "in_progress") return "secondary" as const;
    return "approved" as const;
  }

  return (
    <>
      <section className="admin-card overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/60 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Lock jobs
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Worker claims a locked device → admin approves or rejects →
                unlock work → completed.
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
                ["claimed", counts.claimed],
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
              placeholder="Search device, customer, worker…"
              className="sm:max-w-sm"
            />
            {(filter === "claimed" || filter === "in_progress") &&
            selected.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {selected.length} selected
              </p>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {(filter === "claimed" || filter === "in_progress") && (
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={
                          pageRows.length > 0 &&
                          pageRows.every((d) => selected.includes(d.id))
                        }
                        onChange={togglePage}
                        className="size-4 rounded border-border"
                        aria-label="Select page"
                      />
                    </TableHead>
                  )}
                  <TableHead>Device</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No jobs in this view.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((device) => {
                    const customer = customerMap.get(device.customerId);
                    const worker = device.workerId
                      ? workerMap.get(device.workerId)
                      : undefined;
                    const agent = device.agentId
                      ? agentMap.get(device.agentId)
                      : undefined;

                    return (
                      <TableRow key={device.id}>
                        {(filter === "claimed" ||
                          filter === "in_progress") && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.includes(device.id)}
                              onChange={() => toggle(device.id)}
                              className="size-4 rounded border-border"
                              aria-label={`Select ${device.id}`}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Link
                            href={`/admin/devices/${device.id}`}
                            className="font-semibold hover:underline"
                          >
                            {device.model}
                          </Link>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {device.id} · {device.contact}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {customer?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {device.location}
                        </TableCell>
                        <TableCell className="text-sm">
                          {worker || agent ? (
                            <div>
                              <p className="font-medium">
                                {worker?.displayName ?? "—"}
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {agent?.serial ?? "—"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusTone(device.assignmentStatus)}
                            className="font-normal"
                          >
                            {lockJobShort(device.assignmentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {device.assignmentStatus === "awaiting" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setClaimDevice(device)}
                            >
                              Claim
                            </Button>
                          ) : device.assignmentStatus === "claimed" ? (
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => onReject([device.id])}
                              >
                                Reject
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => onApprove([device.id])}
                              >
                                Approve
                              </Button>
                            </div>
                          ) : device.assignmentStatus === "in_progress" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onComplete([device.id])}
                            >
                              Complete
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Done
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            page={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            noun="jobs"
          />
        </div>

        {(canApprove || canComplete) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/15 px-4 py-3 sm:px-5">
            <p className="text-sm text-muted-foreground">
              Bulk actions for selected rows.
            </p>
            <div className="flex flex-wrap gap-2">
              {canReject ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onReject(selected);
                    setSelected([]);
                  }}
                >
                  Reject selected
                </Button>
              ) : null}
              {canApprove ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onApprove(selected);
                    setSelected([]);
                  }}
                >
                  Approve selected
                </Button>
              ) : null}
              {canComplete ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onComplete(selected);
                    setSelected([]);
                  }}
                >
                  Complete selected
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </section>

      <ClaimDeviceModal
        open={claimDevice != null}
        device={claimDevice}
        workers={workers}
        agents={agents}
        onClose={() => setClaimDevice(null)}
        onConfirm={(workerId) => {
          if (claimDevice) {
            onClaim(claimDevice.id, workerId);
            setClaimDevice(null);
          }
        }}
      />
    </>
  );
}
