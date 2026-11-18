"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  Badge,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms";
import { AdminDirectory } from "@/components/molecules/admin-directory";
import { AdminPageHeader } from "@/components/molecules/admin-page-header";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { FilterSelect } from "@/components/molecules/filter-select";
import { RowActions } from "@/components/molecules/row-actions";
import { SortableTh } from "@/components/molecules/sortable-th";
import { TablePagination } from "@/components/molecules/table-pagination";
import { useAdminTable } from "@/hooks/use-admin-table";
import type {
  DeviceStatus,
  MockAgent,
  MockCustomer,
  MockDevice,
  MockWorker,
} from "@/mocks";
type DevicesListProps = {
  devices: MockDevice[];
  agents: MockAgent[];
  workers: MockWorker[];
  customers: MockCustomer[];
};

type StatusFilter = "all" | DeviceStatus;

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function deviceBadge(status: DeviceStatus) {
  if (status === "locked") return <Badge variant="locked">Locked</Badge>;
  if (status === "auto_solved") return <Badge variant="auto">Auto solved</Badge>;
  return <Badge variant="unlocked">Unlocked</Badge>;
}

function assignmentBadge(device: MockDevice) {
  if (device.assignmentStatus === "awaiting") {
    return (
      <Badge variant="outline" className="font-normal">
        Awaiting
      </Badge>
    );
  }
  if (device.assignmentStatus === "claimed") {
    return <Badge variant="pending">Claimed</Badge>;
  }
  if (device.assignmentStatus === "in_progress") {
    return <Badge variant="secondary">In progress</Badge>;
  }
  return <Badge variant="approved">Completed</Badge>;
}

function percent(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function DevicesList({
  devices,
  agents,
  workers,
  customers,
}: DevicesListProps) {
  const [records, setRecords] = useState(devices);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [agentId, setAgentId] = useState("all");
  const [workerId, setWorkerId] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<MockDevice | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((device) => {
      if (status !== "all" && device.status !== status) return false;
      if (agentId !== "all" && device.agentId !== agentId) return false;
      if (workerId !== "all" && device.workerId !== workerId) return false;
      if (!q) return true;
      const customer = customerMap.get(device.customerId);
      return (
        device.id.toLowerCase().includes(q) ||
        device.model.toLowerCase().includes(q) ||
        device.contact.toLowerCase().includes(q) ||
        device.location.toLowerCase().includes(q) ||
        device.ip.toLowerCase().includes(q) ||
        device.address.toLowerCase().includes(q) ||
        device.access.imei.toLowerCase().includes(q) ||
        device.access.os.toLowerCase().includes(q) ||
        device.assignmentStatus.toLowerCase().includes(q) ||
        (customer?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [records, search, status, agentId, workerId, customerMap]);

  const getSortValue = useCallback(
    (row: MockDevice, key: string) => {
      switch (key) {
        case "id":
          return row.id;
        case "model":
          return row.model;
        case "status":
          return row.status;
        case "assignment":
          return row.assignmentStatus;
        case "contact":
          return row.contact;
        case "location":
          return row.location;
        case "gallery":
          return row.access.galleryCount;
        case "contacts":
          return row.access.contactsCount;
        case "customer":
          return customerMap.get(row.customerId)?.name ?? "";
        case "updated":
          return new Date(row.updatedAt).getTime();
        default:
          return "";
      }
    },
    [customerMap],
  );

  const table = useAdminTable({
    rows: filtered,
    pageSize: 6,
    defaultSortKey: "updated",
    defaultSortDir: "desc",
    getSortValue,
  });

  const locked = filtered.filter((d) => d.status === "locked").length;
  const autoSolved = filtered.filter((d) => d.status === "auto_solved").length;
  const unlocked = filtered.filter((d) => d.status === "unlocked").length;
  const total = filtered.length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Devices"
        description="Lock App fleet — model, location, contact, gallery & ownership."
        createHref="/admin/devices/new"
        createLabel="Add device"
      />

      {toast ? (
        <p
          className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
          role="status"
        >
          {toast}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatusCard
          label="Locked"
          count={locked}
          meta={`${percent(locked, total)}%`}
        />
        <StatusCard
          label="Auto solved"
          count={autoSolved}
          meta={`${percent(autoSolved, total)}%`}
        />
        <StatusCard
          label="Unlocked"
          count={unlocked}
          meta={`${percent(unlocked, total)}%`}
        />
      </div>

      <AdminDirectory
        title="Device directory"
        filteredCount={table.totalFiltered}
        totalCount={records.length}
        noun="devices"
        toolbar={
          <>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, model, contact, location…"
              className="sm:w-64 xl:w-72"
            />
            <FilterSelect
              label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
            >
              <option value="all">All status</option>
              <option value="locked">Locked</option>
              <option value="auto_solved">Auto solved</option>
              <option value="unlocked">Unlocked</option>
            </FilterSelect>
            <FilterSelect
              label="Filter by agent"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              <option value="all">All agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.serial}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Filter by worker"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
            >
              <option value="all">All workers</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.displayName}
                </option>
              ))}
            </FilterSelect>
          </>
        }
        isEmpty={table.totalFiltered === 0}
        footer={
          <TablePagination
            page={table.page}
            totalPages={table.totalPages}
            totalItems={table.totalFiltered}
            pageSize={table.pageSize}
            onPageChange={table.setPage}
            noun="devices"
          />
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTh label="Device" sortKey="model" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <SortableTh label="Status" sortKey="status" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <SortableTh label="Assignment" sortKey="assignment" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <SortableTh label="Location" sortKey="location" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <SortableTh label="Customer" sortKey="customer" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <TableHead>Owner</TableHead>
                <SortableTh label="Gallery" sortKey="gallery" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <SortableTh label="Updated" sortKey="updated" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.pageRows.map((device) => {
                const customer = customerMap.get(device.customerId);
                const worker = device.workerId
                  ? workerMap.get(device.workerId)
                  : undefined;
                const agent = device.agentId
                  ? agentMap.get(device.agentId)
                  : undefined;
                return (
                  <TableRow key={device.id}>
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
                    <TableCell>{deviceBadge(device.status)}</TableCell>
                    <TableCell>{assignmentBadge(device)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{device.location}</div>
                      <div className="max-w-[10rem] truncate text-[11px] text-muted-foreground">
                        {device.ip}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer ? (
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="font-medium hover:underline"
                        >
                          {customer.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {worker || agent ? (
                        <div className="space-y-0.5">
                          {worker ? (
                            <Link
                              href={`/admin/workers/${worker.id}`}
                              className="block text-foreground hover:underline"
                            >
                              {worker.displayName}
                            </Link>
                          ) : null}
                          {agent ? (
                            <Link
                              href={`/admin/agents/${agent.id}`}
                              className="block font-mono hover:underline"
                            >
                              {agent.serial}
                            </Link>
                          ) : null}
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums text-sm">
                      {device.access.galleryCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {shortDate(device.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        detailHref={`/admin/devices/${device.id}`}
                        editHref={`/admin/devices/${device.id}/edit`}
                        onDelete={() => setPendingDelete(device)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </AdminDirectory>

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete device?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.model} (${pendingDelete.id}). Demo only.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            setRecords((prev) =>
              prev.filter((d) => d.id !== pendingDelete.id),
            );
            flash(`Removed ${pendingDelete.model}`);
            setPendingDelete(null);
          }
        }}
      />
    </div>
  );
}

function StatusCard({
  label,
  count,
  meta,
}: {
  label: string;
  count: number;
  meta?: string;
}) {
  return (
    <div className="admin-card rounded-xl border border-border/80 bg-card px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        {meta ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">
        {count}
      </p>
    </div>
  );
}
