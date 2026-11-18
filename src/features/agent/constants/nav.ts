export type AgentNavItem = {
  href: string;
  label: string;
  title: string;
};

export const AGENT_NAV: AgentNavItem[] = [
  { href: "/agent", label: "Dashboard", title: "Dashboard" },
  { href: "/agent/workers", label: "My workers", title: "My workers" },
  { href: "/agent/earnings", label: "Earnings", title: "My earnings" },
  { href: "/agent/profile", label: "Profile", title: "My profile" },
];

export function getAgentPageTitle(pathname: string): string {
  const exact = AGENT_NAV.find((item) => item.href === pathname);
  if (exact) return exact.title;

  if (pathname.startsWith("/agent/workers/new")) return "Create worker";
  if (pathname.startsWith("/agent/workers/")) return "Worker profile";

  const nested = AGENT_NAV.filter((item) => item.href !== "/agent")
    .filter((item) => pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return nested?.title ?? "Agent";
}

export function isAgentNavActive(pathname: string, href: string): boolean {
  if (href === "/agent") return pathname === "/agent";
  return pathname === href || pathname.startsWith(`${href}/`);
}
