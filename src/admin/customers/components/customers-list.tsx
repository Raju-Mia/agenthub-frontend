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
import type { MockCustomer, MockDevice, UserStatus } from "@/mocks";

type CustomersListProps = {
  customers: MockCustomer[];
  devices: MockDevice[];
};

type StatusFilter = "all" | UserStatus;

export function CustomersList({ customers, devices }: CustomersListProps) {
  const { records, remove, toast } = useLocalRecords(customers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<MockCustomer | null>(null);

  const devicesByCustomer = useMemo(() => {
    const map = new Map<string, MockDevice[]>();
    for (const device of devices) {
      const list = map.get(device.customerId) ?? [];
      list.push(device);
      map.set(device.customerId, list);
    }
    return map;
  }, [devices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((customer) => {
      if (status !== "all" && customer.status !== status) return false;
      if (!q) return true;
      const linked = devicesByCustomer.get(customer.id) ?? [];
      return (
        customer.name.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        (customer.email?.toLowerCase().includes(q) ?? false) ||
        (customer.notes?.toLowerCase().includes(q) ?? false) ||
        linked.some(
          (d) =>
            d.model.toLowerCase().includes(q) ||
            d.location.toLowerCase().includes(q) ||
            d.ip.toLowerCase().includes(q) ||
            d.contact.toLowerCase().includes(q),
        )
      );
    });
  }, [records, search, status, devicesByCustomer]);

  const getSortValue = useCallback((row: MockCustomer, key: string) => {
    switch (key) {
      case "name":
        return row.name;
      case "phone":
        return row.phone;
      case "email":
        return row.email ?? "";
      case "devices":
        return row.deviceIds.length;
      case "status":
        return row.status;
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
        title="Customers"
        description={
          <>
            Client records only —{" "}
            <span className="font-medium text-foreground">no login</span>, no
            passwords.
          </>
        }
        createHref="/admin/customers/new"
        createLabel="Create customer"
      />

      {toast ? (
        <p
          className="rounded-lg border border-status-approved/30 bg-status-approved-bg px-3 py-2 text-sm text-status-approved"
          role="status"
        >
          {toast}
        </p>
      ) : null}

      <AdminDirectory
        filteredCount={table.totalFiltered}
        totalCount={records.length}
        noun="customers"
        toolbar={
          <>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, email…"
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
            noun="customers"
          />
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTh label="Name" sortKey="name" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Phone" sortKey="phone" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Email" sortKey="email" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <SortableTh label="Devices" sortKey="devices" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <TableHead>Phone models</TableHead>
              <TableHead>Locations</TableHead>
              <SortableTh label="Status" sortKey="status" activeKey={table.sortKey} direction={table.sortDir} onSort={table.toggleSort} />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.pageRows.map((customer) => {
              const linked = devicesByCustomer.get(customer.id) ?? [];
              const models = linked.map((d) => d.model).slice(0, 2);
              const locations = [
                ...new Set(linked.map((d) => d.location)),
              ].slice(0, 2);
              return (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {customer.phone}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.email ?? "—"}
                </TableCell>
                <TableCell className="tabular-nums font-medium">
                  {linked.length}
                </TableCell>
                <TableCell className="max-w-[14rem] text-sm">
                  {models.length > 0 ? (
                    <span>
                      {models.join(" · ")}
                      {linked.length > models.length
                        ? ` +${linked.length - models.length}`
                        : ""}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[12rem] text-sm text-muted-foreground">
                  {locations.length > 0 ? locations.join(" · ") : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === "active" ? "approved" : "inactive"
                    }
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RowActions
                    detailHref={`/admin/customers/${customer.id}`}
                    editHref={`/admin/customers/${customer.id}/edit`}
                    onDelete={() => setPendingDelete(customer)}
                  />
                </TableCell>
              </TableRow>
            );
            })}
          </TableBody>
        </Table>
      </AdminDirectory>

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete customer?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name} from this directory. Design demo only — no API delete.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id, pendingDelete.name);
            setPendingDelete(null);
          }
        }}
      />
    </div>
  );
}
