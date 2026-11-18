import type { Metadata } from "next";
import { WorkersList } from "@/admin/workers";
import { mockAgents, mockWorkers } from "@/mocks";

export const metadata: Metadata = {
  title: "Workers",
};

export default function AdminWorkersPage() {
  return <WorkersList workers={mockWorkers} agents={mockAgents} />;
}
