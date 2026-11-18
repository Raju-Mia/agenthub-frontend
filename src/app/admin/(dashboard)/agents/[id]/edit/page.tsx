import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AgentForm } from "@/admin/agents";
import { getAgentById, mockAgents } from "@/mocks";

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
    title: agent ? `Edit ${agent.displayName}` : "Edit agent",
  };
}

function FormFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function EditAgentPage({ params }: Props) {
  return (
    <Suspense fallback={<FormFallback />}>
      <EditAgentContent params={params} />
    </Suspense>
  );
}

async function EditAgentContent({ params }: Props) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();
  return <AgentForm mode="edit" initial={agent} />;
}