import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WorkerProfile } from "@/admin/workers";
import {
  DEMO_AGENT_ID,
  getCustomerById,
  getDemoAgent,
  getDemoAgentWorkers,
  getWorkerById,
  mockDevices,
  mockTransactions,
} from "@/mocks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getDemoAgentWorkers().map((worker) => ({ id: worker.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const worker = getWorkerById(id);
  return { title: worker ? worker.displayName : "Worker" };
}

function Fallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function AgentWorkerProfilePage({ params }: Props) {
  return (
    <Suspense fallback={<Fallback />}>
      <AgentWorkerProfileContent params={params} />
    </Suspense>
  );
}

async function AgentWorkerProfileContent({ params }: Props) {
  const { id } = await params;
  const worker = getWorkerById(id);
  if (!worker || worker.agentId !== DEMO_AGENT_ID) notFound();

  const agent = getDemoAgent();
  const transactions = mockTransactions
    .filter((t) => t.workerId === worker.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10)
    .map((transaction) => ({
      transaction,
      customerName:
        getCustomerById(transaction.customerId)?.name ??
        transaction.customerId,
    }));
  const devices = mockDevices.filter((d) => d.workerId === worker.id);

  return (
    <WorkerProfile
      worker={worker}
      agent={agent}
      transactions={transactions}
      devices={devices}
      backHref="/agent/workers"
      backLabel="Back to my workers"
      agentHref="/agent/profile"
    />
  );
}
