import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WorkerForm } from "@/admin/workers";
import { getWorkerById, mockAgents, mockWorkers } from "@/mocks";

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
    title: worker ? `Edit ${worker.displayName}` : "Edit worker",
  };
}

function FormFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function EditWorkerPage({ params }: Props) {
  return (
    <Suspense fallback={<FormFallback />}>
      <EditWorkerContent params={params} />
    </Suspense>
  );
}

async function EditWorkerContent({ params }: Props) {
  const { id } = await params;
  const worker = getWorkerById(id);
  if (!worker) notFound();
  return (
    <WorkerForm mode="edit" agents={mockAgents} initial={worker} />
  );
}