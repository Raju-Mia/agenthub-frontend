"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
import type { MockAgent, UserStatus } from "@/mocks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_COMMISSION = 50;

type AgentFormProps = {
  mode: "create" | "edit";
  initial?: MockAgent;
};

export function AgentForm({ mode, initial }: AgentFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [serial, setSerial] = useState(initial?.serial ?? "");
  const [commissionPercent, setCommissionPercent] = useState(
    initial?.commissionPercent ?? DEFAULT_COMMISSION,
  );
  const [status, setStatus] = useState<UserStatus>(
    initial?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cancelHref =
    mode === "edit" && initial
      ? `/admin/agents/${initial.id}`
      : "/admin/agents";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !email.trim()) {
      setError("Name and email are required.");
      setSuccess(null);
      return;
    }
    if (mode === "create" && !password) {
      setError("Password is required for new agents.");
      setSuccess(null);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      setSuccess(null);
      return;
    }
    if (mode === "create" && password.length < 4) {
      setError("Password must be at least 4 characters (design demo).");
      setSuccess(null);
      return;
    }
    if (commissionPercent < 0 || commissionPercent > 100) {
      setError("Commission must be between 0 and 100.");
      setSuccess(null);
      return;
    }

    setError(null);
    setSubmitting(true);
    const nextSerial =
      serial.trim() ||
      (mode === "edit" && initial?.serial) ||
      `AGT-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    setSuccess(
      mode === "create"
        ? `Design demo: would create ${displayName.trim()} (${nextSerial}) at ${commissionPercent}% commission. No API yet.`
        : `Design demo: would update ${displayName.trim()} (${nextSerial}). No API yet.`,
    );
    setSubmitting(false);
    window.setTimeout(() => {
      router.push(
        mode === "edit" && initial
          ? `/admin/agents/${initial.id}`
          : "/admin/agents",
      );
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Create agent" : "Edit agent"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Static form only — submit shows success then returns to list or
            profile.
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
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Agent credentials</CardTitle>
            <Badge variant="secondary">
              Default {DEFAULT_COMMISSION}%
            </Badge>
          </div>
          <CardDescription>
            Agent login uses email + password. Serial is unique identity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Karim Hossain"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@agenthub.local"
              />
            </div>
            {mode === "create" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="serial">Serial</Label>
              <Input
                id="serial"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="Auto AGT-#### if empty on create"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission %</Label>
              <Input
                id="commission"
                type="number"
                min={0}
                max={100}
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Default is 50% — agent share of workers under them.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                  ? "Create agent (demo)"
                  : "Save changes (demo)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}