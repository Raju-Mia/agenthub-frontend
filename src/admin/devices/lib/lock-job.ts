import type { DeviceAssignmentStatus, MockDevice } from "@/mocks";

/**
 * Lock job pipeline (ownership & unlock work):
 * 1. awaiting   — device locked, no worker yet
 * 2. in_progress — admin assigned worker (agent auto-linked); work ongoing
 * 3. completed  — unlock finished successfully
 */
export const LOCK_JOB_STEPS = [
  {
    id: "awaiting" as const,
    label: "Awaiting assignment",
    short: "Awaiting",
    hint: "Locked device with no owner yet.",
  },
  {
    id: "in_progress" as const,
    label: "In progress",
    short: "In progress",
    hint: "Worker assigned; agent linked automatically.",
  },
  {
    id: "completed" as const,
    label: "Completed",
    short: "Completed",
    hint: "Unlock finished successfully.",
  },
] as const;

export type LockJobFilter = "all" | DeviceAssignmentStatus;

export function lockJobLabel(status: DeviceAssignmentStatus): string {
  return (
    LOCK_JOB_STEPS.find((step) => step.id === status)?.label ?? status
  );
}

export function lockJobShort(status: DeviceAssignmentStatus): string {
  return LOCK_JOB_STEPS.find((step) => step.id === status)?.short ?? status;
}

export function isActiveLockJob(device: MockDevice): boolean {
  return (
    device.status === "locked" &&
    (device.assignmentStatus === "awaiting" ||
      device.assignmentStatus === "in_progress")
  );
}
