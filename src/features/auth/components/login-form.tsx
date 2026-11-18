"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
} from "@/components/atoms";
import { cn } from "@/lib/utils";
import {
  DEMO_ROLE_LABELS,
  DEMO_ROLE_ROUTES,
  type DemoRole,
} from "../types/roles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<DemoRole>("admin");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (!email.trim() || !password) {
      return "Enter email and password to continue.";
    }
    if (!EMAIL_RE.test(email.trim())) {
      return "Enter a valid email address.";
    }
    if (password.length < 4) {
      return "Password must be at least 4 characters (design demo).";
    }
    return null;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setSubmitting(true);
    // Static design only — no API. Demo role picks the destination.
    router.push(DEMO_ROLE_ROUTES[role]);
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg shadow-slate-900/5">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-display text-2xl">Login</CardTitle>
          <Badge variant="secondary">Design demo</Badge>
        </div>
        <CardDescription>
          Email + password. No API yet — pick a role to open that dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@agenthub.local"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="space-y-2">
            <Label>Continue as</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(DEMO_ROLE_LABELS) as DemoRole[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    role === key
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  {DEMO_ROLE_LABELS[key]}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Customers have no login. Role switch is temporary for static
              design.
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Opening…" : `Enter as ${DEMO_ROLE_LABELS[role]}`}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:underline"
            >
              Back to welcome
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
