import type { Metadata } from "next";
import { PendingLocksPage } from "@/admin/devices/components/pending-locks-page";
import { mockAgents, mockCustomers, mockDevices, mockWorkers } from "@/mocks";

export const metadata: Metadata = {
  title: "Pending Lock",
};

export default function AdminPendingLocksPage() {
  return (
    <PendingLocksPage
      devices={mockDevices}
      agents={mockAgents}
      workers={mockWorkers}
      customers={mockCustomers}
    />
  );
}
