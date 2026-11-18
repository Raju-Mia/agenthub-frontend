import type { Metadata } from "next";
import { CreateWorkerForm } from "@/features/agent";
import { getDemoAgent } from "@/mocks";

export const metadata: Metadata = {
  title: "Create worker",
};

export default function AgentCreateWorkerPage() {
  const agent = getDemoAgent();
  return (
    <CreateWorkerForm
      agentSerial={agent.serial}
      agentName={agent.displayName}
    />
  );
}
