import type { Metadata } from "next";
import { AgentForm } from "@/admin/agents";

export const metadata: Metadata = {
  title: "Create agent",
};

export default function CreateAgentPage() {
  return <AgentForm mode="create" />;
}
