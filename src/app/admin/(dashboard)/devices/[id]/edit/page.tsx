import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DeviceForm } from "@/admin/devices";
import {
  getDeviceById,
  mockAgents,
  mockCustomers,
  mockDevices,
  mockWorkers,
} from "@/mocks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return mockDevices.map((device) => ({ id: device.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const device = getDeviceById(id);
  return {
    title: device ? `Edit ${device.model}` : "Edit device",
  };
}

function FormFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function EditDevicePage({ params }: Props) {
  return (
    <Suspense fallback={<FormFallback />}>
      <EditDeviceContent params={params} />
    </Suspense>
  );
}

async function EditDeviceContent({ params }: Props) {
  const { id } = await params;
  const device = getDeviceById(id);
  if (!device) notFound();
  return (
    <DeviceForm
      mode="edit"
      customers={mockCustomers}
      workers={mockWorkers}
      agents={mockAgents}
      initial={device}
    />
  );
}