import type { Metadata } from "next";
import { DeviceForm } from "@/admin/devices";
import {
  mockAgents,
  mockCustomers,
  mockDevices,
  mockWorkers,
} from "@/mocks";

export const metadata: Metadata = {
  title: "Register device",
};

export default function CreateDevicePage() {
  return (
    <DeviceForm
      mode="create"
      customers={mockCustomers}
      workers={mockWorkers}
      agents={mockAgents}
    />
  );
}