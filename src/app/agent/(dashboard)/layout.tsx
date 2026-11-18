import { Suspense } from "react";
import { AgentShell } from "@/components/organisms/agent-shell";

export const instant = false;

function AgentShellFallback() {
  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="h-14 border-b border-border bg-card/90" />
        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </main>
      </div>
    </div>
  );
}

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AgentShellFallback />}>
      <AgentShell>{children}</AgentShell>
    </Suspense>
  );
}
