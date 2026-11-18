"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
  DeviceStatus,
  MockAgent,
  MockCustomer,
  MockDevice,
  MockWorker,
} from "@/mocks";

const NONE = "";

type DeviceFormProps = {
  mode: "create" | "edit";
  customers: MockCustomer[];
  workers: MockWorker[];
  agents: MockAgent[];
  initial?: MockDevice;
};

export function DeviceForm({
  mode,
  customers,
  workers,
  agents,
  initial,
}: DeviceFormProps) {
  const router = useRouter();
  const [model, setModel] = useState(initial?.model ?? "");
  const [status, setStatus] = useState<DeviceStatus>(
    initial?.status ?? "locked",
  );
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [ip, setIp] = useState(initial?.ip ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [customerId, setCustomerId] = useState(
    initial?.customerId ?? customers[0]?.id ?? "",
  );
  const [workerId, setWorkerId] = useState(initial?.workerId ?? NONE);
  const [agentId, setAgentId] = useState(initial?.agentId ?? NONE);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const workersForAgent = useMemo(() => {
    if (agentId === NONE) return workers;
    return workers.filter((w) => w.agentId === agentId);
  }, [workers, agentId]);

  const cancelHref =
    mode === "edit" && initial
      ? `/admin/devices/${initial.id}`
      : "/admin/devices";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!model.trim() || !contact.trim() || !customerId) {
      setError("Model, contact, and customer are required.");
      setSuccess(null);
      return;
    }

    setError(null);
    setSubmitting(true);
    setSuccess(
      mode === "create"
        ? `Design demo: would register ${model.trim()} for customer ${customerId}. No API yet.`
        : `Design demo: would update device ${initial?.id ?? model.trim()}. No API yet.`,
    );
    setSubmitting(false);
    window.setTimeout(() => {
      router.push(
        mode === "edit" && initial
          ? `/admin/devices/${initial.id}`
          : "/admin/devices",
      );
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Register device" : "Edit device"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lock App device record — customer link is required.
          </p>
        </div>
        <Link
          href={cancelHref}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device record</CardTitle>
          <CardDescription>
            Status drives lock dashboard. Worker / agent links are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Samsung Galaxy A54"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Lock status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as DeviceStatus)}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value="locked">Locked</option>
                <option value="auto_solved">Auto solved</option>
                <option value="unlocked">Unlocked</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka, Mirpur-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip">IP</Label>
              <Input
                id="ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="103.112.45.12"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / flat details"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <select
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
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
              <Label htmlFor="agentId">Agent (optional)</Label>
              <select
                id="agentId"
                value={agentId}
                onChange={(e) => {
                  setAgentId(e.target.value);
                  setWorkerId(NONE);
                }}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value={NONE}>— None —</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.serial} · {agent.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workerId">Worker (optional)</Label>
              <select
                id="workerId"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value={NONE}>— None —</option>
                {workersForAgent.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.displayName} · {worker.agentSerial}
                  </option>
                ))}
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
              {submitting
                ? "Saving…"
                : mode === "create"
                  ? "Register device (demo)"
                  : "Save changes (demo)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}