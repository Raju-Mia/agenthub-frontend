"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  buttonVariants,
} from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { MockWorker, UserStatus } from "@/mocks";
import { useMoney } from "@/hooks/use-money";

type AgentWorkersListProps = {
  workers: MockWorker[];
  agentSerial: string;
};

type StatusFilter = "all" | UserStatus;

export function AgentWorkersList({
  workers,
  agentSerial,
}: AgentWorkersListProps) {

  const { format } = useMoney();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workers.filter((worker) => {
      if (status !== "all" && worker.status !== status) return false;
      if (!q) return true;
      return (
        worker.displayName.toLowerCase().includes(q) ||
        worker.email.toLowerCase().includes(q)
      );
    });
  }, [workers, search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            My workers
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Scoped to {agentSerial} only — cannot manage other agents&apos;
            workers.
          </p>
        </div>
        <Link href="/agent/workers/new" className={cn(buttonVariants())}>
          Create worker
        </Link>
      </div>

      <Card>
        <CardHeader className="gap-4 space-y-0 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-base">Team</CardTitle>
            <CardDescription>
              {filtered.length} of {workers.length} workers
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="sm:w-56"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm"
              aria-label="Filter by status"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              No workers match this filter.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Jobs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/agent/workers/${worker.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {worker.displayName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {worker.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          worker.status === "active" ? "approved" : "inactive"
                        }
                      >
                        {worker.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums text-status-pending">
                      {format(worker.pendingTk)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {format(worker.approvedTk)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {worker.jobsCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
