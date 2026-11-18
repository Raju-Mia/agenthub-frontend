"use client";

import Link from "next/link";
import { useState } from "react";
import { Download } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import type { DeviceHistoryItem } from "../lib/device-history";

type DeviceProfileProps = {
  device: MockDevice;
  customer?: MockCustomer;
  worker?: MockWorker;
  agent?: MockAgent;
  history: DeviceHistoryItem[];
};

type DownloadKind = "full" | "contacts" | "gallery" | "location" | "device";

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function statusLabel(status: DeviceStatus) {
  if (status === "locked") return "Locked";
  if (status === "auto_solved") return "Auto solved";
  return "Unlocked";
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DeviceProfile({
  device,
  customer,
  worker,
  agent,
  history,
}: DeviceProfileProps) {
  const [toast, setToast] = useState<string | null>(null);

  function handleDownload(kind: DownloadKind) {
    const base = {
      exportedAt: new Date().toISOString(),
      device: {
        id: device.id,
        model: device.model,
        contact: device.contact,
        location: device.location,
        ip: device.ip,
        address: device.address,
        status: device.status,
        os: device.access.os,
        imei: device.access.imei,
      },
      customer: customer
        ? { id: customer.id, name: customer.name, phone: customer.phone }
        : null,
    };

    const packs: Record<DownloadKind, { name: string; data: unknown }> = {
      full: {
        name: `${device.id}-full-access.json`,
        data: { ...base, access: device.access },
      },
      contacts: {
        name: `${device.id}-contacts.json`,
        data: {
          ...base,
          contactsCount: device.access.contactsCount,
          sample: [{ name: "Primary", phone: device.contact }],
        },
      },
      gallery: {
        name: `${device.id}-gallery.json`,
        data: {
          ...base,
          galleryCount: device.access.galleryCount,
          albums: ["Camera", "Screenshots", "Downloads"],
        },
      },
      location: {
        name: `${device.id}-location.json`,
        data: {
          ...base,
          location: device.location,
          address: device.address,
          ip: device.ip,
          lastSeen: device.updatedAt,
        },
      },
      device: {
        name: `${device.id}-device-info.json`,
        data: {
          ...base,
          storageUsedGb: device.access.storageUsedGb,
          appsCount: device.access.appsCount,
        },
      },
    };

    const pack = packs[kind];
    downloadJson(pack.name, pack.data);
    setToast(`Downloaded ${pack.name}`);
    window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="space-y-5">
      <div className="admin-card rounded-xl border border-border/80 bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {statusLabel(device.status)}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                {device.id}
              </span>
              <span className="text-xs text-muted-foreground">
                {device.access.os}
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {device.model}
            </h1>
            <p className="text-sm text-muted-foreground">
              Updated {shortDate(device.updatedAt)} · IMEI{" "}
              <span className="font-mono">{device.access.imei}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDownload("full")}
            >
              <Download className="size-3.5" />
              Export
            </Button>
            <Link
              href={`/admin/devices/${device.id}/edit`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Edit
            </Link>
            <Link
              href="/admin/devices"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {toast ? (
        <p
          className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
          role="status"
        >
          {toast}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile label="Contact" value={device.contact} mono />
        <InfoTile label="Location" value={device.location} />
        <InfoTile label="IP" value={device.ip} mono />
        <InfoTile
          label="Gallery"
          value={`${device.access.galleryCount} photos`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="admin-card border-border/80">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-semibold">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5 text-sm">
            <MetaRow label="Device ID" value={device.id} mono />
            <MetaRow label="Device name" value={device.model} />
            <MetaRow label="OS" value={device.access.os} />
            <MetaRow label="IMEI" value={device.access.imei} mono />
            <MetaRow label="Address" value={device.address} />
            <MetaRow label="Status" value={statusLabel(device.status)} />
            <MetaRow
              label="Lock job"
              value={
                device.assignmentStatus === "awaiting"
                  ? "Awaiting assignment"
                  : device.assignmentStatus === "in_progress"
                    ? "In progress"
                    : "Completed"
              }
            />
          </CardContent>
        </Card>

        <Card className="admin-card border-border/80">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-semibold">
              Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5 text-sm">
            <AssignRow
              label="Customer"
              href={customer ? `/admin/customers/${customer.id}` : undefined}
              value={customer?.name}
            />
            <AssignRow
              label="Worker"
              href={worker ? `/admin/workers/${worker.id}` : undefined}
              value={worker?.displayName}
              empty="Not assigned"
            />
            <AssignRow
              label="Agent"
              href={agent ? `/admin/agents/${agent.id}` : undefined}
              value={agent?.serial}
              empty="Not assigned"
              mono
            />
            <p className="pt-1 text-xs text-muted-foreground">
              Hierarchy · Admin → Agent → Worker → Device
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-card border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">Access</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["contacts", "Contacts"],
                  ["gallery", "Gallery"],
                  ["location", "Location"],
                  ["device", "Device info"],
                ] as const
              ).map(([kind, label]) => (
                <Button
                  key={kind}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 text-muted-foreground"
                  onClick={() => handleDownload(kind)}
                >
                  <Download className="size-3.5" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AccessStat
              label="Contacts"
              value={String(device.access.contactsCount)}
            />
            <AccessStat
              label="Gallery"
              value={String(device.access.galleryCount)}
            />
            <AccessStat
              label="Call logs"
              value={String(device.access.callLogsCount)}
            />
            <AccessStat label="SMS" value={String(device.access.smsCount)} />
            <AccessStat label="Apps" value={String(device.access.appsCount)} />
            <AccessStat
              label="Storage"
              value={`${device.access.storageUsedGb} GB`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="admin-card border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-semibold">History</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <ol className="space-y-4">
            {history.map((item) => (
              <li
                key={`${item.at}-${item.status}`}
                className="border-l border-border pl-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {statusLabel(item.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {shortDate(item.at)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {item.note}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoTile({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="admin-card rounded-xl border border-border/80 bg-card px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-sm font-semibold text-foreground",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </p>
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
    <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className={cn("text-right font-medium", mono && "font-mono text-xs")}
      >
        {value}
      </span>
    </div>
  );
}

function AssignRow({
  label,
  value,
  href,
  empty = "—",
  mono,
}: {
  label: string;
  value?: string;
  href?: string;
  empty?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      {value && href ? (
        <Link
          href={href}
          className={cn(
            "text-right font-medium hover:underline",
            mono && "font-mono text-xs",
          )}
        >
          {value}
        </Link>
      ) : (
        <span className="text-muted-foreground">{empty}</span>
      )}
    </div>
  );
}

function AccessStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
