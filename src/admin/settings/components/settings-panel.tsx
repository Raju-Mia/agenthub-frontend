"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/atoms";

type SettingsPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
  dirty?: boolean;
  saved?: boolean;
  onReset?: () => void;
  onSave?: () => void;
};

export function SettingsPanel({
  title,
  description,
  children,
  dirty = false,
  saved = false,
  onReset,
  onSave,
}: SettingsPanelProps) {
  return (
    <div className="admin-card rounded-xl border border-border/80 bg-card">
      <div className="border-b border-border/60 px-5 py-4">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-5 px-5 py-5">{children}</div>
      {onSave ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 px-5 py-3">
          {saved ? (
            <span className="mr-auto text-sm text-muted-foreground" role="status">
              Saved
            </span>
          ) : null}
          {onReset ? (
            <Button
              type="button"
              variant="ghost"
              disabled={!dirty}
              onClick={onReset}
            >
              Reset
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={!dirty}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border/70 px-3.5 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          checked
            ? "relative h-6 w-10 shrink-0 rounded-full bg-foreground transition"
            : "relative h-6 w-10 shrink-0 rounded-full bg-muted transition"
        }
      >
        <span
          className={
            checked
              ? "absolute top-0.5 left-4 size-5 rounded-full bg-background transition"
              : "absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition"
          }
        />
      </button>
    </div>
  );
}

export const fieldControlClass =
  "h-10 w-full rounded-lg border border-border/80 bg-slate-50/80 px-3 text-sm text-foreground outline-none transition focus-visible:border-teal-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-teal-500/15";
