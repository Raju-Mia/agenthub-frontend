"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  buttonVariants,
} from "@/components/atoms";
import { cn } from "@/lib/utils";
import type {
  MockCustomer,
  MockDevice,
  MockWorker,
  TransactionStatus,
} from "@/mocks";

const NONE = "";

type TransactionFormProps = {
  workers: MockWorker[];
  customers: MockCustomer[];
  devices: MockDevice[];
};

export function TransactionForm({
  workers,
  customers,
  devices,
}: TransactionFormProps) {
  const router = useRouter();
  const [amountTk, setAmountTk] = useState("");
  const [workerId, setWorkerId] = useState(workers[0]?.id ?? "");
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [deviceId, setDeviceId] = useState(NONE);
  const [status, setStatus] = useState<TransactionStatus>("pending");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const devicesForCustomer = useMemo(() => {
    if (customerId === "") return devices;
    return devices.filter((d) => d.customerId === customerId);
  }, [devices, customerId]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const amount = Number(amountTk);
    if (!amountTk.trim() || Number.isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount in taka.");
      setSuccess(null);
      return;
    }
    if (!workerId || !customerId) {
      setError("Worker and customer are required.");
      setSuccess(null);
      return;
    }

    setError(null);
    setSubmitting(true);
    setSuccess(
      `Design demo: would record ৳${amount} (${status}) for worker ${workerId}${deviceId !== NONE ? ` · device ${deviceId}` : ""}. No API yet.`,
    );
    setSubmitting(false);
    window.setTimeout(() => router.push("/admin/transactions"), 1200);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Record payment
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo submit — starts as pending in the approval pipeline.
          </p>
        </div>
        <Link
          href="/admin/transactions"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Payment details</CardTitle>
            <Badge variant="secondary">Pending default</Badge>
          </div>
          <CardDescription>
            Amount flows to worker pending until agent verify and admin approve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="amountTk">Amount (৳)</Label>
              <Input
                id="amountTk"
                type="number"
                min={1}
                step={1}
                value={amountTk}
                onChange={(e) => setAmountTk(e.target.value)}
                placeholder="500"
                className="tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workerId">Worker</Label>
              <select
                id="workerId"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.displayName} · {worker.agentSerial}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <select
                id="customerId"
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setDeviceId(NONE);
                }}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} · {customer.phone}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceId">Device (optional)</Label>
              <select
                id="deviceId"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value={NONE}>— None —</option>
                {devicesForCustomer.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.id} · {device.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TransactionStatus)
                }
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="agent_verified">Agent verified</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}
            {success ? (
              <div
                role="status"
                className="rounded-md border border-status-approved/30 bg-status-approved-bg px-3 py-2 text-sm text-status-approved"
              >
                {success}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Saving…" : "Record payment (demo)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}