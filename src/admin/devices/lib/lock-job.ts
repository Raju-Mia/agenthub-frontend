import type { DeviceAssignmentStatus, MockDevice } from "@/mocks";

/**
 * Lock job pipeline:
 * 1. awaiting   — device locked; worker can claim
 * 2. claimed    — worker claimed; waiting admin approve / reject
 * 3. in_progress — admin approved; worker manages unlock
 * 4. completed  — unlock finished successfully
 */
export const LOCK_JOB_STEPS = [
  {
    id: "awaiting" as const,
    label: "Awaiting claim",
    short: "Awaiting",
    hint: "Device locked. A worker can claim it.",
  },
  {
    id: "claimed" as const,
    label: "Claimed",
    short: "Claimed",
    hint: "Worker claimed. Admin can approve or reject.",
  },
  {
    id: "in_progress" as const,
    label: "In progress",
    short: "In progress",
    hint: "Admin approved. Worker is managing the unlock.",
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
  return LOCK_JOB_STEPS.find((step) => step.id === status)?.label ?? status;
}

export function lockJobShort(status: DeviceAssignmentStatus): string {
  return LOCK_JOB_STEPS.find((step) => step.id === status)?.short ?? status;
}

export function isActiveLockJob(device: MockDevice): boolean {
  return (
    device.status === "locked" &&
    (device.assignmentStatus === "awaiting" ||
      device.assignmentStatus === "claimed" ||
      device.assignmentStatus === "in_progress")
  );
}
