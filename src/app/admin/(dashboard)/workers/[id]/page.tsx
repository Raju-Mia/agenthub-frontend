import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WorkerProfile } from "@/admin/workers";
import {
  getAgentById,
  getCustomerById,
  getWorkerById,
  mockDevices,
  mockTransactions,
  mockWorkers,
} from "@/mocks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return mockWorkers.map((worker) => ({ id: worker.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const worker = getWorkerById(id);
  return {
    title: worker ? worker.displayName : "Worker profile",
  };
}

function ProfileFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function AdminWorkerProfilePage({ params }: Props) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <WorkerProfileContent params={params} />
    </Suspense>
  );
}

async function WorkerProfileContent({ params }: Props) {
  const { id } = await params;
  const worker = getWorkerById(id);
  if (!worker) notFound();

  const agent = getAgentById(worker.agentId);
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
    />
  );
}
