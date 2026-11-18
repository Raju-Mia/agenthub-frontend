export type AdminNavItem = {
  href: string;
  label: string;
  title: string;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", title: "Dashboard" }],
  },
  {
    id: "network",
    label: "Network",
    items: [
      { href: "/admin/agents", label: "Agents", title: "Agents" },
      { href: "/admin/workers", label: "Workers", title: "Workers" },
      { href: "/admin/customers", label: "Customers", title: "Customers" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        href: "/admin/pending-locks",
        label: "Pending Lock",
        title: "Pending Lock",
      },
      { href: "/admin/devices", label: "Devices", title: "Devices" },
      {
        href: "/admin/transactions",
        label: "Transactions",
        title: "Transactions",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", title: "Settings" },
      { href: "/admin/profile", label: "Profile", title: "Admin profile" },
    ],
  },
];

/** Flat list for title lookup / legacy consumers */
export const ADMIN_NAV: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (group) => group.items,
);

export function getAdminPageTitle(pathname: string): string {
  const exact = ADMIN_NAV.find((item) => item.href === pathname);
  if (exact) return exact.title;

  const nested = ADMIN_NAV.filter((item) => item.href !== "/admin")
    .filter((item) => pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return nested?.title ?? "Admin";
}

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
