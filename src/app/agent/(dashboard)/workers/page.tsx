import type { Metadata } from "next";
import { AgentWorkersList } from "@/features/agent";
import { getDemoAgent, getDemoAgentWorkers } from "@/mocks";

export const metadata: Metadata = {
  title: "My workers",
};

export default function AgentWorkersPage() {
  const agent = getDemoAgent();
  return (
    <AgentWorkersList
      workers={getDemoAgentWorkers()}
      agentSerial={agent.serial}
    />
  );
}
