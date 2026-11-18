"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
import type { MockAgent, MockWorker, UserStatus } from "@/mocks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WorkerFormProps = {
  mode: "create" | "edit";
  agents: MockAgent[];
  initial?: MockWorker;
};

export function WorkerForm({ mode, agents, initial }: WorkerFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [agentId, setAgentId] = useState(
    initial?.agentId ?? agents[0]?.id ?? "",
  );
  const [status, setStatus] = useState<UserStatus>(
    initial?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cancelHref =
    mode === "edit" && initial
      ? `/admin/workers/${initial.id}`
      : "/admin/workers";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !agentId) {
      setError("Name, email, and agent are required.");
      setSuccess(null);
      return;
    }
    if (mode === "create" && !password) {
      setError("Password is required for new workers.");
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

    const agent = agents.find((a) => a.id === agentId);
    setError(null);
    setSubmitting(true);
    setSuccess(
      mode === "create"
        ? `Design demo: would create worker ${displayName.trim()} under ${agent?.serial ?? agentId}. No API yet.`
        : `Design demo: would update ${displayName.trim()}. No API yet.`,
    );
    setSubmitting(false);
    window.setTimeout(() => {
      router.push(
        mode === "edit" && initial
          ? `/admin/workers/${initial.id}`
          : "/admin/workers",
      );
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Create worker" : "Edit worker"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Worker belongs to one agent — pay pipeline is unchanged in demo.
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
          <CardTitle className="text-lg">Worker details</CardTitle>
          <CardDescription>
            Email + password for worker login. Agent assignment controls rollup.
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
                placeholder="Imran Khan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="worker@agenthub.local"
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
              <Label htmlFor="agentId">Agent</Label>
              <select
                id="agentId"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.serial} · {agent.displayName}
                  </option>
                ))}
              </select>
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
                  ? "Create worker (demo)"
                  : "Save changes (demo)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}