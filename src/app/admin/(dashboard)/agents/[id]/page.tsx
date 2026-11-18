import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AgentProfile } from "@/admin/agents";
import {
  getAgentById,
  getCustomerById,
  getWorkerById,
  getWorkersByAgentId,
  mockAgents,
  mockTransactions,
} from "@/mocks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return mockAgents.map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgentById(id);
  return {
    title: agent ? agent.displayName : "Agent profile",
  };
}

function ProfileFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function AdminAgentProfilePage({ params }: Props) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <AgentProfileContent params={params} />
    </Suspense>
  );
}

async function AgentProfileContent({ params }: Props) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();

  const workers = getWorkersByAgentId(agent.id);
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
      customerName:
        getCustomerById(transaction.customerId)?.name ??
        transaction.customerId,
    }));

  return (
    <AgentProfile
      agent={agent}
      workers={workers}
      transactions={transactions}
    />
  );
}
