import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CustomerProfile } from "@/admin/customers";
import {
  getCustomerById,
  getDevicesByCustomerId,
  mockCustomers,
} from "@/mocks";

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
    title: customer ? customer.name : "Customer",
  };
}

function ProfileFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function AdminCustomerProfilePage({ params }: Props) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <CustomerProfileContent params={params} />
    </Suspense>
  );
}

async function CustomerProfileContent({ params }: Props) {
  const { id } = await params;
  const customer = getCustomerById(id);
  if (!customer) notFound();

  const devices = getDevicesByCustomerId(customer.id);

  return <CustomerProfile customer={customer} devices={devices} />;
}
