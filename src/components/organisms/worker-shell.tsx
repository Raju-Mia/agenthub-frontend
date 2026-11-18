"use client";

import { Suspense, useState } from "react";
import { WorkerHeader } from "./worker-header";
import { WorkerSidebar } from "./worker-sidebar";

type WorkerShellProps = {
  children: React.ReactNode;
};

function SidebarFallback() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block" />
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-card/90" />
  );
}

export function WorkerShell({ children }: WorkerShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <WorkerSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <WorkerHeader onMenuClick={() => setMobileOpen(true)} />
        </Suspense>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
