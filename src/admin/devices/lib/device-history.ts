import type { DeviceStatus, MockDevice } from "@/mocks";

export type DeviceHistoryItem = {
  at: string;
  status: DeviceStatus;
  note: string;
};

export function buildDeviceHistory(device: MockDevice): DeviceHistoryItem[] {
  const base = new Date(device.updatedAt).getTime();
  if (device.status === "locked") {
    return [
      {
        at: device.updatedAt,
        status: "locked",
        note: "Device reported locked after Lock App install / lock trigger.",
      },
      {
        at: new Date(base - 1000 * 60 * 60 * 6).toISOString(),
        status: "unlocked",
        note: "Previously unlocked session ended.",
      },
    ];
  }
  if (device.status === "auto_solved") {
    return [
      {
        at: device.updatedAt,
        status: "auto_solved",
        note: "System auto-solved the lock without worker intervention.",
      },
      {
        at: new Date(base - 1000 * 60 * 45).toISOString(),
        status: "locked",
        note: "Device entered locked state.",
      },
    ];
  }
  return [
    {
      at: device.updatedAt,
      status: "unlocked",
      note: device.workerId
        ? "Worker unlocked this device. Job ready for payment / earning pipeline."
        : "Device marked unlocked.",
    },
    {
      at: new Date(base - 1000 * 60 * 90).toISOString(),
      status: "locked",
      note: "Customer device locked — awaiting worker unlock.",
    },
  ];
}
