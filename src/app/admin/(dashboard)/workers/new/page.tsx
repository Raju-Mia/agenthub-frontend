import type { Metadata } from "next";
import { WorkerForm } from "@/admin/workers";
import { mockAgents } from "@/mocks";

export const metadata: Metadata = {
  title: "Create worker",
};

export default function CreateWorkerPage() {
  return <WorkerForm mode="create" agents={mockAgents} />;
}