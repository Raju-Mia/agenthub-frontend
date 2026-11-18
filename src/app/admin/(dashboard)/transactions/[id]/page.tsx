import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TransactionDetailPage } from "@/admin/transactions";
import { mockTransactions } from "@/mocks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return mockTransactions.map((txn) => ({ id: txn.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id };
}

function Fallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function AdminTransactionDetailRoute({ params }: Props) {
  return (
    <Suspense fallback={<Fallback />}>
      <TransactionDetailContent params={params} />
    </Suspense>
  );
}

async function TransactionDetailContent({ params }: Props) {
  const { id } = await params;
  const transaction = mockTransactions.find((t) => t.id === id);
  if (!transaction) notFound();
  return <TransactionDetailPage transaction={transaction} />;
}
