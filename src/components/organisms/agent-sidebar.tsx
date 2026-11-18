"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HardHat,
  Wallet,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AGENT_NAV,
  isAgentNavActive,
} from "@/features/agent/constants/nav";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "/agent": LayoutDashboard,
  "/agent/workers": HardHat,
  "/agent/earnings": Wallet,
  "/agent/profile": UserRound,
};

type AgentSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AgentSidebar({ open, onClose }: AgentSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-4">
          <Link href="/agent" onClick={onClose} className="min-w-0">
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              Agent Hub
            </span>
            <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-muted">
              Agent portal
            </span>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {AGENT_NAV.map((item) => {
            const Icon = ICONS[item.href] ?? LayoutDashboard;
            const active = isAgentNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-active text-white"
                    : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-muted">
            Own workers only · Phase 9
          </p>
        </div>
      </aside>
    </>
  );
}
