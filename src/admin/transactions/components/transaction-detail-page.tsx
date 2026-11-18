"use client";

import { useState } from "react";
import {
  getAgentById,
  getCustomerById,
  getDeviceById,
  getWorkerById,
  type MockTransaction,
  type TransactionStatus,
} from "@/mocks";
import { TransactionDetailPanel } from "./transaction-detail-panel";

type TransactionDetailPageProps = {
  transaction: MockTransaction;
};

export function TransactionDetailPage({
  transaction: initial,
}: TransactionDetailPageProps) {
  const [status, setStatus] = useState<TransactionStatus>(initial.status);
  const [message, setMessage] = useState<string | null>(null);

  const transaction = { ...initial, status };
  const agent = getAgentById(transaction.agentId);
  const worker = getWorkerById(transaction.workerId);
  const customer = getCustomerById(transaction.customerId);
  const device = transaction.deviceId
    ? getDeviceById(transaction.deviceId)
    : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {message ? (
        <p
          role="status"
          className="rounded-md border border-status-approved/30 bg-status-approved-bg px-3 py-2 text-sm text-status-approved"
        >
          {message}
        </p>
      ) : null}
      <TransactionDetailPanel
        embedded
        transaction={transaction}
        agent={agent}
        worker={worker}
        customer={customer}
        device={device}
        onClose={() => undefined}
        onApprove={() => {
          setStatus("approved");
          setMessage(
            `Design demo: ${transaction.id} approved → real earning. No API.`,
          );
        }}
        onReject={() => {
          setStatus("rejected");
          setMessage(`Design demo: ${transaction.id} rejected. No API.`);
        }}
      />
    </div>
  );
}
