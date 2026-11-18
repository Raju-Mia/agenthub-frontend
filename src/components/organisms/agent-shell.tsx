"use client";

import { Suspense, useState } from "react";
import { AgentHeader } from "./agent-header";
import { AgentSidebar } from "./agent-sidebar";

type AgentShellProps = {
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

export function AgentShell({ children }: AgentShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <AgentSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <AgentHeader onMenuClick={() => setMobileOpen(true)} />
        </Suspense>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
