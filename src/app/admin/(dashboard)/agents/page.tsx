import type { Metadata } from "next";
import { AgentsList } from "@/admin/agents";
import { mockAgents } from "@/mocks";

export const metadata: Metadata = {
  title: "Agents",
};

export default function AdminAgentsPage() {
  return <AgentsList agents={mockAgents} />;
}
