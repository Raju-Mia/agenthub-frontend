import type { Metadata } from "next";
import { WorkerDevicesView } from "@/features/worker";
import { getDemoWorker, mockDevices } from "@/mocks";

export const metadata: Metadata = {
  title: "My devices",
};

export default function WorkerDevicesPage() {
  const worker = getDemoWorker();
  const devices = mockDevices.filter((d) => d.workerId === worker.id);
  return <WorkerDevicesView devices={devices} />;
}
