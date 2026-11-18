import type { Metadata } from "next";
import { WorkerDashboard } from "@/features/worker";
import {
  getAgentById,
  getDemoWorker,
  mockDevices,
} from "@/mocks";

export const metadata: Metadata = {
  title: "Worker dashboard",
};

export default function WorkerHomePage() {
  const worker = getDemoWorker();
  const agent = getAgentById(worker.agentId);
  const deviceCount = mockDevices.filter((d) => d.workerId === worker.id).length;

  return (
    <WorkerDashboard
      worker={worker}
      agent={agent}
      deviceCount={deviceCount}
    />
  );
}
