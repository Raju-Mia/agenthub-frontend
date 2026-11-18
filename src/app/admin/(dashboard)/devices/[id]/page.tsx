import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DeviceProfile } from "@/admin/devices";
import { buildDeviceHistory } from "@/admin/devices/lib/device-history";
import {
  getAgentById,
  getCustomerById,
  getDeviceById,
  getWorkerById,
  mockDevices,
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
    title: device ? device.model : "Device",
  };
}

function ProfileFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}

export default function AdminDeviceDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <DeviceProfileContent params={params} />
    </Suspense>
  );
}

async function DeviceProfileContent({ params }: Props) {
  const { id } = await params;
  const device = getDeviceById(id);
  if (!device) notFound();

  return (
    <DeviceProfile
      device={device}
      customer={getCustomerById(device.customerId)}
      worker={device.workerId ? getWorkerById(device.workerId) : undefined}
      agent={device.agentId ? getAgentById(device.agentId) : undefined}
      history={buildDeviceHistory(device)}
    />
  );
}
