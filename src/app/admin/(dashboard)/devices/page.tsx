import type { Metadata } from "next";
import { DevicesList } from "@/admin/devices";
import { mockAgents, mockCustomers, mockDevices, mockWorkers } from "@/mocks";

export const metadata: Metadata = {
  title: "Devices",
};

export default function AdminDevicesPage() {
  return (
    <DevicesList
      devices={mockDevices}
      agents={mockAgents}
      workers={mockWorkers}
      customers={mockCustomers}
    />
  );
}
