"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/atoms";
import { useMoney } from "@/hooks/use-money";
import { cn } from "@/lib/utils";
import {
  DEFAULT_SETTINGS_SECTION,
  type SettingsSectionId,
  getSettingsGroups,
  getSettingsSection,
} from "../constants/sections";
import { BankAccountsSettings } from "./bank-accounts-settings";
import { CommissionSettings } from "./commission-settings";
import { CurrencySettings } from "./currency-settings";
import { LockAppSettings } from "./lock-app-settings";
import { NotificationsSettings } from "./notifications-settings";
import { SecuritySettings } from "./security-settings";
import { SocialAccountsSettings } from "./social-accounts-settings";
import { WorkspaceSettings } from "./workspace-settings";

export function SettingsPage() {
  const { currency } = useMoney();
  const [activeId, setActiveId] = useState<SettingsSectionId>(
    DEFAULT_SETTINGS_SECTION,
  );
  const groups = useMemo(() => getSettingsGroups(), []);

  const active = useMemo(
    () => getSettingsSection(activeId) ?? groups[0]!.items[0]!,
    [activeId, groups],
  );

  return (
    <div className="-mx-4 -my-5 flex flex-col bg-[var(--admin-canvas)] sm:-mx-6 sm:-my-5 lg:-mx-8 lg:my-0 lg:h-full lg:min-h-0 lg:flex-row lg:overflow-hidden">
      {/* Fixed settings menu — does not scroll with content */}
      <aside className="flex shrink-0 flex-col border-b border-border/80 bg-card lg:h-full lg:w-[17.5rem] lg:border-b-0 lg:border-r">
        <div className="shrink-0 border-b border-border/70 px-4 py-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Settings menu
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Control room
          </p>
        </div>

        <nav
          aria-label="Settings sections"
          className="settings-nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 lg:px-2.5 lg:py-4"
        >
          {groups.map((group) => (
            <div key={group.group} className="mb-4 last:mb-0">
              <p className="mb-1.5 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((section) => {
                  const Icon = section.icon;
                  const selected = section.id === activeId;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(section.id)}
                        className={cn(
                          "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[13px] transition",
                          selected
                            ? "bg-teal-50 font-semibold text-teal-950"
                            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md border transition",
                            selected
                              ? "border-teal-200 bg-white text-teal-700"
                              : "border-transparent bg-transparent text-slate-400 group-hover:text-slate-600",
                          )}
                        >
                          <Icon className="size-3.5" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {section.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Scrollable content pane */}
      <div className="settings-content-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Admin
              <span className="mx-1.5 text-border">/</span>
              Settings
              <span className="mx-1.5 text-border">/</span>
              <span className="text-foreground">{active.group}</span>
              <span className="mx-1.5 text-border">/</span>
              <span className="text-foreground">{active.label}</span>
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              {active.label}
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              {active.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
              {currency}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl pb-8">
          {active.id === "general" ? <WorkspaceSettings /> : null}
          {active.id === "currency" ? <CurrencySettings /> : null}
          {active.id === "commission" ? <CommissionSettings /> : null}
          {active.id === "bank-accounts" ? <BankAccountsSettings /> : null}
          {active.id === "social-accounts" ? <SocialAccountsSettings /> : null}
          {active.id === "notifications" ? <NotificationsSettings /> : null}
          {active.id === "security" ? <SecuritySettings /> : null}
          {active.id === "integrations" ? <LockAppSettings /> : null}
        </div>
      </div>
    </div>
  );
}
