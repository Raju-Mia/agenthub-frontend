"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/atoms";
import type { MockAgent, MockDevice, MockWorker } from "@/mocks";

type ClaimDeviceModalProps = {
  open: boolean;
  device: MockDevice | null;
  workers: MockWorker[];
  agents: MockAgent[];
  onClose: () => void;
  onConfirm: (workerId: string) => void;
};

export function ClaimDeviceModal({
  open,
  device,
  workers,
  agents,
  onClose,
  onConfirm,
}: ClaimDeviceModalProps) {
  const [workerId, setWorkerId] = useState(workers[0]?.id ?? "");

  useEffect(() => {
    if (open) setWorkerId(workers[0]?.id ?? "");
  }, [open, workers]);

  const worker = useMemo(
    () => workers.find((w) => w.id === workerId),
    [workers, workerId],
  );
  const agent = useMemo(
    () => (worker ? agents.find((a) => a.id === worker.agentId) : undefined),
    [agents, worker],
  );

  if (!open || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-device-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="border-b border-border/70 px-5 py-4">
          <h3
            id="claim-device-title"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Claim this device
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Worker claims ownership of this lock. Agent is linked automatically.
            Admin can approve or reject after the claim.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Device
            </p>
            <p className="mt-1 text-sm font-semibold">{device.model}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {device.id} · {device.contact}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {device.location}
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              Claiming worker
            </span>
            <select
              className="h-10 w-full rounded-lg border border-border/80 bg-slate-50/80 px-3 text-sm outline-none focus-visible:border-teal-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-teal-500/15"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.displayName} · {w.agentSerial}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-border/70 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              Agent (auto)
            </p>
            <p className="mt-1 font-mono text-sm">
              {agent
                ? `${agent.serial} · ${agent.displayName}`
                : "Select a worker"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border/70 px-5 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!workerId}
            onClick={() => onConfirm(workerId)}
          >
            Confirm claim
          </Button>
        </div>
      </div>
    </div>
  );
}
