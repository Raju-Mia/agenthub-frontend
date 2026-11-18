import type { Metadata } from "next";
import { TransactionsList } from "@/admin/transactions";
import {
  mockAgents,
  mockCustomers,
  mockDevices,
  mockTransactions,
  mockWorkers,
} from "@/mocks";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function AdminTransactionsPage() {
  return (
    <TransactionsList
      transactions={mockTransactions}
      agents={mockAgents}
      workers={mockWorkers}
      customers={mockCustomers}
      devices={mockDevices}
    />
  );
}
