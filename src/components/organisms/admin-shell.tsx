"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

function SidebarFallback({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar lg:block",
        collapsed ? "w-[4.75rem]" : "w-[17rem]",
      )}
    />
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-white sm:h-16" />
  );
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isSettings = pathname === "/admin/settings";

  return (
    <div
      className={cn(
        "min-h-svh bg-[var(--admin-canvas)]",
        isSettings && "lg:h-svh lg:overflow-hidden",
      )}
    >
      <Suspense fallback={<SidebarFallback collapsed={collapsed} />}>
        <AdminSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
        />
      </Suspense>

      <div
        className={cn(
          "flex min-h-svh min-w-0 flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-[4.75rem]" : "lg:pl-[17rem]",
          isSettings && "lg:h-svh lg:overflow-hidden",
        )}
      >
        <Suspense fallback={<HeaderFallback />}>
          <AdminHeader
            onMenuClick={() => setMobileOpen(true)}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((v) => !v)}
          />
        </Suspense>
        <main
          className={cn(
            "admin-surface flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7",
            isSettings && "min-h-0 lg:overflow-hidden lg:py-0 lg:pt-0",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
