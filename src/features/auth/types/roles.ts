export type DemoRole = "admin" | "agent" | "worker";

export const DEMO_ROLE_ROUTES: Record<DemoRole, string> = {
  admin: "/admin",
  agent: "/agent",
  worker: "/worker",
};

export const DEMO_ROLE_LABELS: Record<DemoRole, string> = {
  admin: "Admin",
  agent: "Agent",
  worker: "Worker",
};
