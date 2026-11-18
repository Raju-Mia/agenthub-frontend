import type { Metadata } from "next";
import { AdminProfileView } from "@/admin/profile";

export const metadata: Metadata = {
  title: "Admin profile",
};

export default function AdminProfilePage() {
  return <AdminProfileView />;
}
