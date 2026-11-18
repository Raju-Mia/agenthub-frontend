"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Download,
  ImageIcon,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
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
import type { MockCustomer, MockDevice } from "@/mocks";

type CustomerProfileProps = {
  customer: MockCustomer;
  devices: MockDevice[];
};

type DownloadKind =
  | "full"
  | "contacts"
  | "gallery"
  | "location"
  | "device";

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function deviceBadge(status: MockDevice["status"]) {
  if (status === "locked") return <Badge variant="locked">Locked</Badge>;
  if (status === "auto_solved") return <Badge variant="auto">Auto solved</Badge>;
  return <Badge variant="unlocked">Unlocked</Badge>;
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

export function CustomerProfile({ customer, devices }: CustomerProfileProps) {
  const [toast, setToast] = useState<string | null>(null);
  const locked = devices.filter((d) => d.status === "locked").length;
  const unlocked = devices.filter((d) => d.status === "unlocked").length;

  function handleDownload(device: MockDevice, kind: DownloadKind) {
    const base = {
      exportedAt: new Date().toISOString(),
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
      },
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
    };

    const packs: Record<DownloadKind, { name: string; data: unknown }> = {
      full: {
        name: `${device.id}-full-access.json`,
        data: {
          ...base,
          access: device.access,
          packages: ["contacts", "gallery", "location", "call_logs", "sms", "apps"],
          note: "Design demo export — not real device data.",
        },
      },
      contacts: {
        name: `${device.id}-contacts.json`,
        data: {
          ...base,
          contactsCount: device.access.contactsCount,
          sample: [
            { name: "Home", phone: device.contact },
            { name: "Shop", phone: "+8801700000002" },
          ],
        },
      },
      gallery: {
        name: `${device.id}-gallery.json`,
        data: {
          ...base,
          galleryCount: device.access.galleryCount,
          albums: ["Camera", "Screenshots", "WhatsApp"],
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
      <div className="admin-card flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={customer.status === "active" ? "approved" : "inactive"}
            >
              {customer.status}
            </Badge>
            <Badge variant="secondary">No login</Badge>
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {customer.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {customer.phone}
          </p>
          {customer.email ? (
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className={cn(buttonVariants())}
          >
            Edit
          </Link>
          <Link
            href="/admin/customers"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back
          </Link>
        </div>
      </div>

      {toast ? (
        <p
          className="rounded-lg border border-status-approved/30 bg-status-approved-bg px-3 py-2 text-sm text-status-approved"
          role="status"
        >
          {toast}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Devices" value={String(devices.length)} />
        <Stat label="Locked" value={String(locked)} tone="rose" />
        <Stat label="Unlocked" value={String(unlocked)} tone="teal" />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Devices & access
        </h3>

        {devices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No devices linked.
          </p>
        ) : (
          <div className="grid gap-4">
            {devices.map((device) => (
              <Card
                key={device.id}
                className="admin-card overflow-hidden border-border/80"
              >
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {deviceBadge(device.status)}
                        <Badge variant="secondary" className="font-mono">
                          {device.id}
                        </Badge>
                        <Badge variant="outline">{device.access.os}</Badge>
                      </div>
                      <CardTitle className="mt-2 font-display text-xl">
                        <Link
                          href={`/admin/devices/${device.id}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {device.model}
                        </Link>
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Updated {shortDate(device.updatedAt)} · IMEI{" "}
                        <span className="font-mono">{device.access.imei}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleDownload(device, "full")}
                    >
                      <Download className="size-3.5" />
                      Download all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-5">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoTile
                      icon={Phone}
                      label="Phone contact"
                      value={device.contact}
                      mono
                    />
                    <InfoTile
                      icon={MapPin}
                      label="Location"
                      value={device.location}
                    />
                    <InfoTile
                      icon={Smartphone}
                      label="IP address"
                      value={device.ip}
                      mono
                    />
                    <InfoTile
                      icon={ImageIcon}
                      label="Gallery"
                      value={`${device.access.galleryCount} photos`}
                    />
                  </div>

                  <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Address
                    </p>
                    <p className="mt-1 font-medium">{device.address}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <MetaChip
                      label="Contacts"
                      value={String(device.access.contactsCount)}
                    />
                    <MetaChip
                      label="Call logs"
                      value={String(device.access.callLogsCount)}
                    />
                    <MetaChip
                      label="SMS"
                      value={String(device.access.smsCount)}
                    />
                    <MetaChip
                      label="Apps / storage"
                      value={`${device.access.appsCount} · ${device.access.storageUsedGb} GB`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-border/70 pt-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(device, "contacts")}
                    >
                      <Download className="size-3.5" />
                      Contacts
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(device, "gallery")}
                    >
                      <Download className="size-3.5" />
                      Gallery
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(device, "location")}
                    >
                      <Download className="size-3.5" />
                      Location
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(device, "device")}
                    >
                      <Download className="size-3.5" />
                      Device info
                    </Button>
                    <Link
                      href={`/admin/devices/${device.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                      )}
                    >
                      Open device
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "rose" | "teal";
}) {
  return (
    <div
      className={cn(
        "admin-card rounded-xl border border-border/80 bg-card px-4 py-4",
        tone === "rose" && "border-rose-200 bg-rose-50/50",
        tone === "teal" && "border-teal-200 bg-teal-50/50",
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-[11px] uppercase tracking-[0.12em]">{label}</span>
      </div>
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

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
