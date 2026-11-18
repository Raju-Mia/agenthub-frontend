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
import type { MockAgent, UserStatus } from "@/mocks";

type AgentsListProps = {
  agents: MockAgent[];
};

type StatusFilter = "all" | UserStatus;

export function AgentsList({ agents }: AgentsListProps) {
  const { format } = useMoney();
  const { records, remove, toast } = useLocalRecords(agents);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<MockAgent | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((agent) => {
      if (status !== "all" && agent.status !== status) return false;
      if (!q) return true;
      return (
        agent.displayName.toLowerCase().includes(q) ||
        agent.email.toLowerCase().includes(q) ||
        agent.serial.toLowerCase().includes(q)
      );
    });
  }, [records, search, status]);

  const getSortValue = useCallback((row: MockAgent, key: string) => {
    switch (key) {
      case "name":
        return row.displayName;
      case "email":
        return row.email;
      case "serial":
        return row.serial;
      case "status":
        return row.status;
      case "workers":
        return row.workersCount;
      case "commission":
        return row.commissionPercent;
      case "approved":
        return row.approvedTk;
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
        title="Agents"
        description={
          <>
            Managers under admin · default commission{" "}
            <span className="font-medium text-foreground">50%</span>
          </>
        }
        createHref="/admin/agents/new"
        createLabel="Create agent"
      />

      {toast ? (
        <p className="rounded-lg border border-status-approved/30 bg-status-approved-bg px-3 py-2 text-sm text-status-approved" role="status">
          {toast}
        </p>
      ) : null}

      <AdminDirectory
        filteredCount={table.totalFiltered}
        totalCount={records.length}
        noun="agents"
        toolbar={
          <>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, serial…"
              className="sm:w-64"
            />
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
            noun="agents"
          />
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTh label="Name" sortKey="name" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Email" sortKey="email" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Serial" sortKey="serial" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Status" sortKey="status" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Workers" sortKey="workers" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Commission" sortKey="commission" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Approved volume" sortKey="approved" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.pageRows.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/agents/${agent.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {agent.displayName}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.email}
                </TableCell>
                <TableCell className="font-mono text-xs">{agent.serial}</TableCell>
                <TableCell>
                  <Badge
                    variant={agent.status === "active" ? "approved" : "inactive"}
                  >
                    {agent.status}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">{agent.workersCount}</TableCell>
                <TableCell className="tabular-nums">
                  {agent.commissionPercent}%
                </TableCell>
                <TableCell className="tabular-nums font-medium">
                  {format(agent.approvedTk)}
                </TableCell>
                <TableCell>
                  <RowActions
                    detailHref={`/admin/agents/${agent.id}`}
                    editHref={`/admin/agents/${agent.id}/edit`}
                    onDelete={() => setPendingDelete(agent)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminDirectory>

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete agent?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.displayName} (${pendingDelete.serial}) from this admin directory. Design demo only — no API delete.`
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
