import type { Metadata } from "next";
import { TransactionForm } from "@/admin/transactions";
import {
  mockCustomers,
  mockDevices,
  mockWorkers,
} from "@/mocks";

export const metadata: Metadata = {
  title: "Record payment",
};

export default function CreateTransactionPage() {
  return (
    <TransactionForm
      workers={mockWorkers}
      customers={mockCustomers}
      devices={mockDevices}
    />
  );
}