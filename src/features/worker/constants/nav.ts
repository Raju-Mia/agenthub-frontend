export type WorkerNavItem = {
  href: string;
  label: string;
  title: string;
};

export const WORKER_NAV: WorkerNavItem[] = [
  { href: "/worker", label: "Dashboard", title: "Dashboard" },
  { href: "/worker/earnings", label: "Earnings", title: "My earnings" },
  { href: "/worker/devices", label: "Devices", title: "My devices" },
  { href: "/worker/profile", label: "Profile", title: "My profile" },
];

export function getWorkerPageTitle(pathname: string): string {
  const exact = WORKER_NAV.find((item) => item.href === pathname);
  if (exact) return exact.title;

  const nested = WORKER_NAV.filter((item) => item.href !== "/worker")
    .filter((item) => pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return nested?.title ?? "Worker";
}

export function isWorkerNavActive(pathname: string, href: string): boolean {
  if (href === "/worker") return pathname === "/worker";
  return pathname === href || pathname.startsWith(`${href}/`);
}
