import type { Metadata } from "next";
import { WorkerEarningsView } from "@/features/worker";
import {
  getCustomerById,
  getDemoWorker,
  mockTransactions,
} from "@/mocks";

export const metadata: Metadata = {
  title: "My earnings",
};

export default function WorkerEarningsPage() {
  const worker = getDemoWorker();
  const transactions = mockTransactions
    .filter((t) => t.workerId === worker.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((transaction) => ({
      transaction,
      customerName:
        getCustomerById(transaction.customerId)?.name ??
        transaction.customerId,
    }));

  return (
    <WorkerEarningsView worker={worker} transactions={transactions} />
  );
}
