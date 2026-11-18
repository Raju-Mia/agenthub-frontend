import { mockAgents } from "./agents";
import { mockWorkers } from "./workers";

/** Static design demo — login “Agent” role uses this fixture agent */
export const DEMO_AGENT_ID = "agt-1";

/** Static design demo — login “Worker” role uses this fixture worker */
export const DEMO_WORKER_ID = "wrk-1";

export function getDemoAgent() {
  const agent = mockAgents.find((a) => a.id === DEMO_AGENT_ID);
  if (!agent) {
    throw new Error(`Demo agent ${DEMO_AGENT_ID} missing from mocks`);
  }
  return agent;
}

export function getDemoWorker() {
  const worker = mockWorkers.find((w) => w.id === DEMO_WORKER_ID);
  if (!worker) {
    throw new Error(`Demo worker ${DEMO_WORKER_ID} missing from mocks`);
  }
  return worker;
}

export function getDemoAgentWorkers() {
  return mockWorkers.filter((w) => w.agentId === DEMO_AGENT_ID);
}
