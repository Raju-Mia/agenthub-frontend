import type { Metadata } from "next";
import { WorkerProfileView } from "@/features/worker";
import { getAgentById, getDemoWorker } from "@/mocks";

export const metadata: Metadata = {
  title: "My profile",
};

export default function WorkerProfilePage() {
  const worker = getDemoWorker();
  return (
    <WorkerProfileView
      worker={worker}
      agent={getAgentById(worker.agentId)}
    />
  );
}
