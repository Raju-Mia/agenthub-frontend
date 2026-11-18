import type { Metadata } from "next";
import { AgentProfileView } from "@/features/agent";
import { getDemoAgent, getDemoAgentWorkers } from "@/mocks";

export const metadata: Metadata = {
  title: "My profile",
};

export default function AgentProfilePage() {
  const agent = getDemoAgent();
  return (
    <AgentProfileView
      agent={agent}
      workersCount={getDemoAgentWorkers().length}
    />
  );
}
