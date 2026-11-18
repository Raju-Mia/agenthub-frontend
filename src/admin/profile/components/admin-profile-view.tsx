"use client";

import { FormEvent, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/atoms";

const DEMO_ADMIN = {
  name: "System administrator",
  email: "admin@agenthub.local",
  phone: "+880 1700-000001",
  role: "Admin",
  timezone: "Asia/Dhaka (BST)",
  lastLoginAt: "2026-11-17T21:48:00+06:00",
  lastLoginIp: "103.112.xxx.xx",
  lastLoginDevice: "Chrome · Windows",
  createdAt: "2026-10-01T10:00:00+06:00",
  sessionExpires: "2026-11-18T09:48:00+06:00",
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function AdminProfileView() {
  const [name, setName] = useState(DEMO_ADMIN.name);
  const [email, setEmail] = useState(DEMO_ADMIN.email);
  const [phone, setPhone] = useState(DEMO_ADMIN.phone);
  const [timezone, setTimezone] = useState(DEMO_ADMIN.timezone);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  function saveBasicInfo(e: FormEvent) {
    e.preventDefault();
    setInfoMsg("Saved (demo)");
    window.setTimeout(() => setInfoMsg(null), 1600);
  }

  function changePassword(e: FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError("All password fields are required.");
      setPassMsg(null);
      return;
    }
    if (newPassword.length < 8) {
      setPassError("New password must be at least 8 characters.");
      setPassMsg(null);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("New password and confirmation do not match.");
      setPassMsg(null);
      return;
    }
    setPassError(null);
    setPassMsg("Password updated (demo)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    window.setTimeout(() => setPassMsg(null), 1600);
  }

  return (
    <div className="space-y-5">
      <div className="admin-card flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-lg font-semibold text-white shadow-md shadow-teal-600/25">
            AH
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {name}
              </h2>
              <Badge variant="approved">{DEMO_ADMIN.role}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
          <p className="text-xs text-muted-foreground">Last login</p>
          <p className="mt-0.5 font-medium tabular-nums">
            {formatWhen(DEMO_ADMIN.lastLoginAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="admin-card border-border/80">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Basic info</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form className="space-y-4" onSubmit={saveBasicInfo}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="admin-name">
                  <Input
                    id="admin-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Email" htmlFor="admin-email">
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Phone" htmlFor="admin-phone">
                  <Input
                    id="admin-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>
                <Field label="Timezone" htmlFor="admin-tz">
                  <Input
                    id="admin-tz"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/70 pt-4">
                {infoMsg ? (
                  <span className="mr-auto text-sm text-status-approved" role="status">
                    {infoMsg}
                  </span>
                ) : null}
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="admin-card border-border/80">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5 text-sm">
              <MetaRow label="Last login" value={formatWhen(DEMO_ADMIN.lastLoginAt)} />
              <MetaRow label="IP" value={DEMO_ADMIN.lastLoginIp} mono />
              <MetaRow label="Device" value={DEMO_ADMIN.lastLoginDevice} />
              <MetaRow label="Session expires" value={formatWhen(DEMO_ADMIN.sessionExpires)} />
              <MetaRow label="Account created" value={formatWhen(DEMO_ADMIN.createdAt)} />
            </CardContent>
          </Card>

          <Card className="admin-card border-border/80">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Change password</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <form className="space-y-4" onSubmit={changePassword}>
                <Field label="Current password" htmlFor="cur-pass">
                  <Input
                    id="cur-pass"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Field>
                <Field label="New password" htmlFor="new-pass">
                  <Input
                    id="new-pass"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Field>
                <Field label="Confirm password" htmlFor="confirm-pass">
                  <Input
                    id="confirm-pass"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Field>
                {passError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {passError}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/70 pt-4">
                  {passMsg ? (
                    <span className="mr-auto text-sm text-status-approved" role="status">
                      {passMsg}
                    </span>
                  ) : null}
                  <Button type="submit">Update password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "text-right font-medium"}>
        {value}
      </span>
    </div>
  );
}
