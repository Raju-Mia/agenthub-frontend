"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Check, Eye, Trash2, X } from "lucide-react";
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
import { AdminDirectory } from "@/components/molecules/admin-directory";
import { AdminPageHeader } from "@/components/molecules/admin-page-header";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { FilterSelect } from "@/components/molecules/filter-select";
import { SortableTh } from "@/components/molecules/sortable-th";
import { TablePagination } from "@/components/molecules/table-pagination";
import { useAdminTable } from "@/hooks/use-admin-table";
import { useLocalRecords } from "@/hooks/use-local-records";
import { useMoney } from "@/hooks/use-money";
import type {
  MockAgent,
  MockCustomer,
  MockDevice,
  MockTransaction,
  MockWorker,
  TransactionStatus,
} from "@/mocks";
import { TransactionDetailPanel } from "./transaction-detail-panel";

type TransactionsListProps = {
  transactions: MockTransaction[];
  agents: MockAgent[];
  workers: MockWorker[];
  customers: MockCustomer[];
  devices: MockDevice[];
};

type StatusFilter = "all" | TransactionStatus;

function shortDate(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function statusLabel(status: TransactionStatus) {
  if (status === "agent_verified") return "Awaiting admin";
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  return "Rejected";
}

export function TransactionsList({
  transactions,
  agents,
  workers,
  customers,
  devices,
}: TransactionsListProps) {
  const { format } = useMoney();
  const { records, remove, toast } = useLocalRecords(transactions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [agentId, setAgentId] = useState("all");
  const [workerId, setWorkerId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<
    Record<string, TransactionStatus>
  >({});
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MockTransaction | null>(
    null,
  );

  const agentMap = useMemo(
    () => new Map(agents.map((a) => [a.id, a])),
    [agents],
  );
  const workerMap = useMemo(
    () => new Map(workers.map((w) => [w.id, w])),
    [workers],
  );
  const customerMap = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers],
  );
  const deviceMap = useMemo(
    () => new Map(devices.map((d) => [d.id, d])),
    [devices],
  );

  const rows = useMemo(
    () =>
      records.map((t) => ({
        ...t,
        status: localStatus[t.id] ?? t.status,
      })),
    [records, localStatus],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((txn) => {
      if (status !== "all" && txn.status !== status) return false;
      if (agentId !== "all" && txn.agentId !== agentId) return false;
      if (workerId !== "all" && txn.workerId !== workerId) return false;
      if (!q) return true;
      const worker = workerMap.get(txn.workerId);
      const agent = agentMap.get(txn.agentId);
      const customer = customerMap.get(txn.customerId);
      const device = txn.deviceId ? deviceMap.get(txn.deviceId) : undefined;
      return (
        txn.id.toLowerCase().includes(q) ||
        (worker?.displayName.toLowerCase().includes(q) ?? false) ||
        (agent?.serial.toLowerCase().includes(q) ?? false) ||
        (customer?.name.toLowerCase().includes(q) ?? false) ||
        (customer?.phone.toLowerCase().includes(q) ?? false) ||
        (device?.model.toLowerCase().includes(q) ?? false) ||
        (device?.location.toLowerCase().includes(q) ?? false) ||
        (device?.contact.toLowerCase().includes(q) ?? false) ||
        (txn.deviceId?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [
    rows,
    search,
    status,
    agentId,
    workerId,
    workerMap,
    agentMap,
    customerMap,
    deviceMap,
  ]);

  const getSortValue = useCallback(
    (row: MockTransaction, key: string) => {
      switch (key) {
        case "id":
          return row.id;
        case "device":
          return row.deviceId
            ? (deviceMap.get(row.deviceId)?.model ?? "")
            : "";
        case "customer":
          return customerMap.get(row.customerId)?.name ?? "";
        case "worker":
          return workerMap.get(row.workerId)?.displayName ?? "";
        case "agent":
          return agentMap.get(row.agentId)?.serial ?? "";
        case "amount":
          return row.amountTk;
        case "status":
          return row.status;
        case "created":
          return new Date(row.createdAt).getTime();
        default:
          return "";
      }
    },
    [customerMap, workerMap, agentMap, deviceMap],
  );

  const table = useAdminTable({
    rows: filtered,
    pageSize: 8,
    defaultSortKey: "created",
    defaultSortDir: "desc",
    getSortValue,
  });

  const summary = useMemo(() => {
    const pending = rows.filter((t) => t.status === "pending");
    const awaiting = rows.filter((t) => t.status === "agent_verified");
    const approved = rows.filter((t) => t.status === "approved");
    const rejected = rows.filter((t) => t.status === "rejected");
    const sum = (list: MockTransaction[]) =>
      list.reduce((acc, t) => acc + t.amountTk, 0);
    return {
      pending: { count: pending.length, amount: sum(pending) },
      awaiting: { count: awaiting.length, amount: sum(awaiting) },
      approved: { count: approved.length, amount: sum(approved) },
      rejected: { count: rejected.length, amount: sum(rejected) },
    };
  }, [rows]);

  const selected = selectedId
    ? (rows.find((t) => t.id === selectedId) ?? null)
    : null;

  function flash(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 2000);
  }

  function approve(id: string) {
    setLocalStatus((prev) => ({ ...prev, [id]: "approved" }));
    flash(`${id} approved`);
  }

  function reject(id: string) {
    setLocalStatus((prev) => ({ ...prev, [id]: "rejected" }));
    flash(`${id} rejected`);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Transactions"
        description="Payment ledger and approval queue."
        createHref="/admin/transactions/new"
        createLabel="Record payment"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Pending"
          count={summary.pending.count}
          amount={format(summary.pending.amount)}
        />
        <SummaryCard
          label="Awaiting admin"
          count={summary.awaiting.count}
          amount={format(summary.awaiting.amount)}
        />
        <SummaryCard
          label="Approved"
          count={summary.approved.count}
          amount={format(summary.approved.amount)}
        />
        <SummaryCard
          label="Rejected"
          count={summary.rejected.count}
          amount={format(summary.rejected.amount)}
        />
      </div>

      {(notice || toast) && (
        <p
          className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
          role="status"
        >
          {notice ?? toast}
        </p>
      )}

      <AdminDirectory
        title="Ledger"
        filteredCount={table.totalFiltered}
        totalCount={records.length}
        noun="transactions"
        toolbar={
          <>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, device, customer…"
              className="sm:w-56 xl:w-64"
            />
            <FilterSelect
              label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="agent_verified">Awaiting admin</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
            noun="transactions"
          />
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <SortableTh
                  label="Transaction"
                  sortKey="id"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Device"
                  sortKey="device"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Customer"
                  sortKey="customer"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Worker"
                  sortKey="worker"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Agent"
                  sortKey="agent"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Amount"
                  sortKey="amount"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Status"
                  sortKey="status"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <SortableTh
                  label="Created"
                  sortKey="created"
                  activeKey={table.sortKey}
                  direction={table.sortDir}
                  onSort={table.toggleSort}
                />
                <TableHead className="w-[1%] text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.pageRows.map((txn) => {
                const agent = agentMap.get(txn.agentId);
                const worker = workerMap.get(txn.workerId);
                const customer = customerMap.get(txn.customerId);
                const device = txn.deviceId
                  ? deviceMap.get(txn.deviceId)
                  : undefined;
                const canDecide =
                  txn.status === "agent_verified" || txn.status === "pending";

                return (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setSelectedId(txn.id)}
                        className="text-left"
                      >
                        <span className="font-mono text-xs font-medium text-foreground hover:underline">
                          {txn.id}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell>
                      {device ? (
                        <div className="min-w-[9rem]">
                          <Link
                            href={`/admin/devices/${device.id}`}
                            className="text-sm font-medium text-foreground hover:underline"
                          >
                            {device.model}
                          </Link>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {device.location}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {device.contact}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer ? (
                        <div>
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {customer.name}
                          </Link>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {customer.phone}
                          </p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {worker ? (
                        <Link
                          href={`/admin/workers/${worker.id}`}
                          className="text-sm hover:underline"
                        >
                          {worker.displayName}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {agent ? (
                        <Link
                          href={`/admin/agents/${agent.id}`}
                          className="hover:underline"
                        >
                          {agent.serial}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold tabular-nums">
                        {format(txn.amountTk)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {txn.points} pts
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-normal text-muted-foreground"
                      >
                        {statusLabel(txn.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {shortDate(txn.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground"
                          title="View"
                          onClick={() => setSelectedId(txn.id)}
                        >
                          <Eye className="size-3.5" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground disabled:opacity-30"
                          title="Approve"
                          disabled={!canDecide}
                          onClick={() => approve(txn.id)}
                        >
                          <Check className="size-3.5" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground disabled:opacity-30"
                          title="Reject"
                          disabled={!canDecide}
                          onClick={() => reject(txn.id)}
                        >
                          <X className="size-3.5" />
                          <span className="sr-only">Reject</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground"
                          title="Delete"
                          onClick={() => setPendingDelete(txn)}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </AdminDirectory>

      {selected ? (
        <TransactionDetailPanel
          transaction={selected}
          agent={agentMap.get(selected.agentId)}
          worker={workerMap.get(selected.workerId)}
          customer={customerMap.get(selected.customerId)}
          device={
            selected.deviceId ? deviceMap.get(selected.deviceId) : undefined
          }
          onClose={() => setSelectedId(null)}
          onApprove={() => approve(selected.id)}
          onReject={() => reject(selected.id)}
        />
      ) : null}

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete transaction?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.id} from this ledger.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id, pendingDelete.id);
            setPendingDelete(null);
            if (selectedId === pendingDelete.id) setSelectedId(null);
          }
        }}
      />
    </div>
  );
}

function SummaryCard({
  label,
  count,
  amount,
}: {
  label: string;
  count: number;
  amount: string;
}) {
  return (
    <div className="admin-card rounded-xl border border-border/80 bg-card px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <span className="text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {amount}
      </p>
    </div>
  );
}
