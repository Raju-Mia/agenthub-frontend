import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/admin/customers";
import { getCustomerById, mockCustomers } from "@/mocks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return mockCustomers.map((customer) => ({ id: customer.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const customer = getCustomerById(id);
  return {
    title: customer ? `Edit ${customer.name}` : "Edit customer",
  };
}

function FormFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function EditCustomerPage({ params }: Props) {
  return (
    <Suspense fallback={<FormFallback />}>
      <EditCustomerContent params={params} />
    </Suspense>
  );
}

async function EditCustomerContent({ params }: Props) {
  const { id } = await params;
  const customer = getCustomerById(id);
  if (!customer) notFound();
  return <CustomerForm mode="edit" initial={customer} />;
}
