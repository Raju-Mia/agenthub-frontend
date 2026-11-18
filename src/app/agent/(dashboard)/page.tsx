import type { Metadata } from "next";
import { AgentDashboard } from "@/features/agent";
import { getDemoAgent, getDemoAgentWorkers } from "@/mocks";

export const metadata: Metadata = {
  title: "Agent dashboard",
};

export default function AgentHomePage() {
  const agent = getDemoAgent();
  const workers = getDemoAgentWorkers();
  return <AgentDashboard agent={agent} workers={workers} />;
}
