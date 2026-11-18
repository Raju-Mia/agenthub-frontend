import type { Metadata } from "next";
import { AgentEarnings } from "@/features/agent";
import {
  getDemoAgent,
  getDemoAgentWorkers,
  getWorkerById,
  mockTransactions,
} from "@/mocks";

export const metadata: Metadata = {
  title: "My earnings",
};

export default function AgentEarningsPage() {
  const agent = getDemoAgent();
  const workers = getDemoAgentWorkers();
  const transactions = mockTransactions
    .filter((t) => t.agentId === agent.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8)
    .map((transaction) => ({
      transaction,
      workerName:
        getWorkerById(transaction.workerId)?.displayName ??
        transaction.workerId,
    }));

  return (
    <AgentEarnings
      agent={agent}
      workers={workers}
      transactions={transactions}
    />
  );
}
