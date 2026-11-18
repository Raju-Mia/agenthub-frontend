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

type CreateWorkerFormProps = {
  agentSerial: string;
  agentName: string;
};

export function CreateWorkerForm({
  agentSerial,
  agentName,
}: CreateWorkerFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password) {
      setError("Name, email, and password are required.");
      setSuccess(null);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      setSuccess(null);
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters (design demo).");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(
      `Design demo: would create worker “${displayName.trim()}” under ${agentSerial}. No API.`,
    );
    window.setTimeout(() => router.push("/agent/workers"), 1100);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Create worker
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Always attached to you ({agentName} · {agentSerial}).
          </p>
        </div>
        <Link
          href="/agent/workers"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Worker credentials</CardTitle>
            <Badge variant="secondary" className="font-mono">
              {agentSerial}
            </Badge>
          </div>
          <CardDescription>
            You cannot assign this worker to another agent.
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

            <Button type="submit" className="w-full">
              Create worker (demo)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
