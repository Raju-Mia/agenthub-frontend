import type { MockDashboardStats } from "./types";
import { mockAgents } from "./agents";
import { mockCustomers } from "./customers";
import { mockDevices } from "./devices";
import { mockTransactions } from "./transactions";
import { mockWorkers } from "./workers";

function percent(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

const lockedCount = mockDevices.filter((d) => d.status === "locked").length;
const autoCount = mockDevices.filter((d) => d.status === "auto_solved").length;
const unlockedCount = mockDevices.filter((d) => d.status === "unlocked").length;
const totalDevices = mockDevices.length;

export const mockDashboardStats: MockDashboardStats = {
  totalAgents: mockAgents.length,
  totalWorkers: mockWorkers.length,
  totalCustomers: mockCustomers.length,
  totalDevices,
  lockedPercent: percent(lockedCount, totalDevices),
  autoSolvedPercent: percent(autoCount, totalDevices),
  unlockedPercent: percent(unlockedCount, totalDevices),
  pendingTk: mockWorkers.reduce((sum, w) => sum + w.pendingTk, 0),
  approvedTk: mockWorkers.reduce((sum, w) => sum + w.approvedTk, 0),
  todayVolumeTk: mockTransactions.filter((t) =>
    t.createdAt.startsWith("2026-11-17"),
  ).length,
};

/** Device status breakdown for dashboard / devices page widgets */
export const mockDeviceStatusBreakdown = {
  locked: lockedCount,
  autoSolved: autoCount,
  unlocked: unlockedCount,
  total: totalDevices,
  lockedPercent: percent(lockedCount, totalDevices),
  autoSolvedPercent: percent(autoCount, totalDevices),
  unlockedPercent: percent(unlockedCount, totalDevices),
};

/** Transaction pipeline counts */
export const mockTransactionPipeline = {
  pending: mockTransactions.filter((t) => t.status === "pending").length,
  agentVerified: mockTransactions.filter((t) => t.status === "agent_verified")
    .length,
  approved: mockTransactions.filter((t) => t.status === "approved").length,
  rejected: mockTransactions.filter((t) => t.status === "rejected").length,
};
