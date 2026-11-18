export * from "./types";
export * from "./agents";
export * from "./workers";
export * from "./customers";
export * from "./devices";
export * from "./transactions";
export * from "./earnings";
export * from "./session";

import { mockAgents } from "./agents";
import { mockCustomers } from "./customers";
import { mockDevices } from "./devices";
import { mockWorkers } from "./workers";

export function getAgentById(id: string) {
  return mockAgents.find((a) => a.id === id);
}

export function getWorkerById(id: string) {
  return mockWorkers.find((w) => w.id === id);
}

export function getCustomerById(id: string) {
  return mockCustomers.find((c) => c.id === id);
}

export function getDeviceById(id: string) {
  return mockDevices.find((d) => d.id === id);
}

export function getWorkersByAgentId(agentId: string) {
  return mockWorkers.filter((w) => w.agentId === agentId);
}

export function getDevicesByCustomerId(customerId: string) {
  return mockDevices.filter((d) => d.customerId === customerId);
}
