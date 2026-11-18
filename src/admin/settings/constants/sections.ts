import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bell,
  Building2,
  Landmark,
  Percent,
  Share2,
  Shield,
  Smartphone,
} from "lucide-react";

export type SettingsSectionId =
  | "general"
  | "currency"
  | "commission"
  | "bank-accounts"
  | "social-accounts"
  | "notifications"
  | "security"
  | "integrations";

export type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
  group: string;
};

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "general",
    label: "Company Info",
    description: "Organization name, timezone, and support contacts.",
    icon: Building2,
    group: "Business",
  },
  {
    id: "currency",
    label: "Currency",
    description: "Display currency for money across the admin.",
    icon: Banknote,
    group: "Business",
  },
  {
    id: "commission",
    label: "Commission",
    description: "Default agent commission on approved work.",
    icon: Percent,
    group: "Business",
  },
  {
    id: "bank-accounts",
    label: "Bank Accounts",
    description:
      "Save local and international bank or wallet accounts for receiving payments.",
    icon: Landmark,
    group: "Accounts",
  },
  {
    id: "social-accounts",
    label: "Social Media",
    description: "Business social profiles and messaging channels.",
    icon: Share2,
    group: "Accounts",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email alerts for pipeline events.",
    icon: Bell,
    group: "Operations",
  },
  {
    id: "integrations",
    label: "Lock App",
    description: "Device sync and lock behaviour.",
    icon: Smartphone,
    group: "Operations",
  },
  {
    id: "security",
    label: "Security",
    description: "Session and sign-in preferences.",
    icon: Shield,
    group: "System",
  },
];

export const DEFAULT_SETTINGS_SECTION: SettingsSectionId = "general";

export function getSettingsSection(
  id: SettingsSectionId,
): SettingsSection | undefined {
  return SETTINGS_SECTIONS.find((section) => section.id === id);
}

export function getSettingsGroups(): {
  group: string;
  items: SettingsSection[];
}[] {
  const order: string[] = [];
  const map = new Map<string, SettingsSection[]>();
  for (const section of SETTINGS_SECTIONS) {
    if (!map.has(section.group)) {
      map.set(section.group, []);
      order.push(section.group);
    }
    map.get(section.group)!.push(section);
  }
  return order.map((group) => ({ group, items: map.get(group)! }));
}
