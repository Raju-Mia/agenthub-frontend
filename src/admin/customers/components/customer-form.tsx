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
import type { MockCustomer, UserStatus } from "@/mocks";

type CustomerFormProps = {
  mode: "create" | "edit";
  initial?: MockCustomer;
};

export function CustomerForm({ mode, initial }: CustomerFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState<UserStatus>(initial?.status ?? "active");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cancelHref =
    mode === "edit" && initial
      ? `/admin/customers/${initial.id}`
      : "/admin/customers";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      setSuccess(null);
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email or leave it empty.");
      setSuccess(null);
      return;
    }

    setError(null);
    setSubmitting(true);
    setSuccess(
      mode === "create"
        ? `Design demo: would create customer “${name.trim()}”. No API / no login account.`
        : `Design demo: would update “${name.trim()}”. No API yet.`,
    );
    setSubmitting(false);
    window.setTimeout(() => {
      router.push(
        mode === "edit" && initial
          ? `/admin/customers/${initial.id}`
          : "/admin/customers",
      );
    }, 1100);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Create customer" : "Edit customer"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Record only — never creates a login user.
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
            <CardTitle className="text-lg">Customer details</CardTitle>
            <Badge variant="secondary">No login</Badge>
          </div>
          <CardDescription>
            Phone is the primary contact. Email and notes are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abdul Malek"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Area, repeat unlock, etc."
              />
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
                  ? "Create customer (demo)"
                  : "Save changes (demo)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
