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
import { useLocalRecords } from "@/hooks/use-local-records";
import { useMoney } from "@/hooks/use-money";
import type { MockAgent, MockWorker, UserStatus } from "@/mocks";

type WorkersListProps = {
  workers: MockWorker[];
  agents: MockAgent[];
};

type StatusFilter = "all" | UserStatus;

export function WorkersList({ workers, agents }: WorkersListProps) {
  const { format, pointsRule } = useMoney();
  const { records, remove, toast } = useLocalRecords(workers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [agentId, setAgentId] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<MockWorker | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((worker) => {
      if (status !== "all" && worker.status !== status) return false;
      if (agentId !== "all" && worker.agentId !== agentId) return false;
      if (!q) return true;
      return (
        worker.displayName.toLowerCase().includes(q) ||
        worker.email.toLowerCase().includes(q) ||
        worker.agentSerial.toLowerCase().includes(q)
      );
    });
  }, [records, search, status, agentId]);

  const getSortValue = useCallback((row: MockWorker, key: string) => {
    switch (key) {
      case "name":
        return row.displayName;
      case "email":
        return row.email;
      case "agent":
        return row.agentSerial;
      case "status":
        return row.status;
      case "pending":
        return row.pendingTk;
      case "approved":
        return row.approvedTk;
      case "jobs":
        return row.jobsCount;
      default:
        return "";
    }
  }, []);

  const table = useAdminTable({
    rows: filtered,
    pageSize: 5,
    defaultSortKey: "name",
    getSortValue,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Workers"
        description={
          <>
            Global directory · each worker belongs to one agent ·{" "}
            <span className="font-medium text-foreground">{pointsRule}</span>
          </>
        }
        createHref="/admin/workers/new"
        createLabel="Create worker"
      />

      {toast ? (
        <p className="rounded-lg border border-status-approved/30 bg-status-approved-bg px-3 py-2 text-sm text-status-approved" role="status">
          {toast}
        </p>
      ) : null}

      <AdminDirectory
        filteredCount={table.totalFiltered}
        totalCount={records.length}
        noun="workers"
        toolbar={
          <>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, agent serial…"
              className="sm:w-64"
            />
            <FilterSelect
              label="Filter by agent"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              <option value="all">All agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.serial} · {agent.displayName}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
            noun="workers"
          />
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTh label="Name" sortKey="name" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Email" sortKey="email" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Agent" sortKey="agent" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Status" sortKey="status" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Pending" sortKey="pending" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Approved" sortKey="approved" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Jobs" sortKey="jobs" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.pageRows.map((worker) => (
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
                  <Link
                    href={`/admin/agents/${worker.agentId}`}
                    className="font-mono text-xs underline-offset-4 hover:underline"
                  >
                    {worker.agentSerial}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={worker.status === "active" ? "approved" : "inactive"}
                  >
                    {worker.status}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums text-status-pending">
                  {format(worker.pendingTk)}
                </TableCell>
                <TableCell className="tabular-nums font-medium">
                  {format(worker.approvedTk)}
                </TableCell>
                <TableCell className="tabular-nums">{worker.jobsCount}</TableCell>
                <TableCell>
                  <RowActions
                    detailHref={`/admin/workers/${worker.id}`}
                    editHref={`/admin/workers/${worker.id}/edit`}
                    onDelete={() => setPendingDelete(worker)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminDirectory>

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete worker?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.displayName} from this directory. Design demo only — no API delete.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id, pendingDelete.displayName);
            setPendingDelete(null);
          }
        }}
      />
    </div>
  );
}
