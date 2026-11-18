"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HardHat,
  Contact,
  Smartphone,
  Lock,
  ArrowLeftRight,
  UserRound,
  Settings,
  X,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ADMIN_NAV_GROUPS,
  isAdminNavActive,
} from "@/admin/dashboard/constants/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms";

const ICONS: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/agents": Users,
  "/admin/workers": HardHat,
  "/admin/customers": Contact,
  "/admin/pending-locks": Lock,
  "/admin/devices": Smartphone,
  "/admin/transactions": ArrowLeftRight,
  "/admin/settings": Settings,
  "/admin/profile": UserRound,
};

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
};

export function AdminSidebar({
  open,
  onClose,
  collapsed = false,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 flex h-svh flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200",
          collapsed ? "lg:w-[4.75rem]" : "lg:w-[17rem]",
          "w-[17rem]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(15,118,110,0.12),transparent_45%)]"
        />

        <div
          className={cn(
            "relative flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-5",
            collapsed && "lg:justify-center lg:px-2",
          )}
        >
          <Link
            href="/admin"
            onClick={onClose}
            className={cn(
              "flex min-w-0 items-center gap-3",
              collapsed && "lg:justify-center",
            )}
          >
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 text-white shadow-[0_8px_24px_rgb(15,118,110,0.45)]">
              <Shield className="size-4.5 size-[1.15rem]" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-400" />
            </div>
            <div className={cn("min-w-0", collapsed && "lg:hidden")}>
              <p className="truncate font-display text-lg font-semibold tracking-tight text-white">
                Agent Hub
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-teal-300/80">
                <span className="ah-live-dot size-1.5 rounded-full bg-teal-400" />
                Control room
              </p>
            </div>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>

        <nav className="admin-sidebar-scroll relative flex-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.id} className="mb-5">
              <p
                className={cn(
                  "mb-2 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500",
                  collapsed && "lg:px-0 lg:text-center",
                )}
              >
                <span className={cn(collapsed && "lg:hidden")}>{group.label}</span>
                <span className={cn("hidden", collapsed && "lg:inline")}>·</span>
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = ICONS[item.href] ?? LayoutDashboard;
                  const active = isAdminNavActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        title={item.label}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13px] font-medium transition-all",
                          collapsed && "lg:justify-center lg:px-0",
                          active
                            ? "bg-gradient-to-r from-teal-500/25 to-teal-500/5 text-white shadow-[inset_3px_0_0_0_rgb(45,212,191)]"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                            active
                              ? "border-teal-400/40 bg-teal-500/20 text-teal-200"
                              : "border-white/10 bg-white/[0.03] text-slate-400 group-hover:border-white/15 group-hover:text-slate-200",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className={cn(collapsed && "lg:hidden")}>
                          {item.label}
                        </span>
                        {active ? (
                          <span
                            className={cn(
                              "ml-auto size-1.5 rounded-full bg-teal-300 shadow-[0_0_10px_rgb(45,212,191)]",
                              collapsed && "lg:hidden",
                            )}
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className={cn(
            "relative shrink-0 border-t border-white/10 p-3",
            collapsed && "lg:px-2",
          )}
        >
          <div
            className={cn(
              "rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/15 via-white/[0.03] to-transparent px-3 py-3",
              collapsed && "lg:flex lg:justify-center lg:px-2 lg:py-2.5",
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-40" />
                <span className="relative inline-flex size-2.5 rounded-full bg-teal-400" />
              </span>
              <div className={cn(collapsed && "lg:hidden")}>
                <p className="text-xs font-semibold text-white">System live</p>
                <p className="text-[11px] text-slate-400">Lock App linked</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
