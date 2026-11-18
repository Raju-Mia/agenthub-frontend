"use client";

import { useEffect, useState } from "react";
import { Lock, Shield, Unlock } from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { MockDevice } from "@/mocks";

type UnlockMode = "worker" | "admin";

type UnlockDeviceModalProps = {
  open: boolean;
  device: MockDevice;
  onClose: () => void;
  onUnlock: (mode: UnlockMode) => void;
};

export function UnlockDeviceModal({
  open,
  device,
  onClose,
  onUnlock,
}: UnlockDeviceModalProps) {
  const [mode, setMode] = useState<UnlockMode>("worker");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode("worker");
      setCode("");
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  function submit() {
    if (mode === "admin") {
      onUnlock("admin");
      return;
    }
    const entered = code.trim();
    if (!entered) {
      setError("Enter the unlock code.");
      return;
    }
    if (entered !== device.unlockCode) {
      setError("Incorrect unlock code.");
      return;
    }
    onUnlock("worker");
  }

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
        aria-labelledby="unlock-device-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="border-b border-border/70 px-5 py-4">
          <div className="flex items-center gap-2">
            <Unlock className="size-4 text-muted-foreground" />
            <h3
              id="unlock-device-title"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Unlock device
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {device.model}
            <span className="mx-1.5 text-border">·</span>
            <span className="font-mono text-xs">{device.id}</span>
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("worker");
                setError(null);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                mode === "worker"
                  ? "border-foreground/20 bg-muted"
                  : "border-border/70 text-muted-foreground hover:bg-muted/40",
              )}
            >
              <Lock className="size-3.5" />
              Worker / Agent
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("admin");
                setError(null);
                setCode("");
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                mode === "admin"
                  ? "border-foreground/20 bg-muted"
                  : "border-border/70 text-muted-foreground hover:bg-muted/40",
              )}
            >
              <Shield className="size-3.5" />
              Admin
            </button>
          </div>

          {mode === "worker" ? (
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Secret unlock code
              </span>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter 1–8 digit code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 8));
                  setError(null);
                }}
                className="h-11 w-full rounded-lg border border-border/80 bg-slate-50/80 px-3 font-mono text-lg tracking-[0.2em] outline-none focus-visible:border-teal-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-teal-500/15"
              />
              <span className="block text-xs text-muted-foreground">
                Generated when this device was registered. Required for worker /
                agent unlock.
              </span>
            </label>
          ) : (
            <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Admin can unlock this device directly — no secret code required.
            </div>
          )}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border/70 px-5 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={submit}>
            {mode === "admin" ? "Unlock now" : "Unlock with code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
