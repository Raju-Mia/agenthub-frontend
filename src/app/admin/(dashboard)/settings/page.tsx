import type { Metadata } from "next";
import { SettingsPage } from "@/admin/settings";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsRoute() {
  return <SettingsPage />;
}
