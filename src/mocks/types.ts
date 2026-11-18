export type UserStatus = "active" | "inactive";

export type DeviceStatus = "locked" | "auto_solved" | "unlocked";

/**
 * Lock job pipeline (who owns the unlock work):
 * awaiting → in_progress → completed
 */
export type DeviceAssignmentStatus =
  | "awaiting"
  | "in_progress"
  | "completed";

export type TransactionStatus =
  | "pending"
  | "agent_verified"
  | "approved"
  | "rejected";

export interface MockAgent {
  id: string;
  displayName: string;
  email: string;
  serial: string;
  status: UserStatus;
  commissionPercent: number;
  workersCount: number;
  pendingTk: number;
  approvedTk: number;
}

export interface MockWorker {
  id: string;
  displayName: string;
  email: string;
  agentId: string;
  agentSerial: string;
  status: UserStatus;
  pendingTk: number;
  approvedTk: number;
  points: number;
  jobsCount: number;
}

export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: UserStatus;
  deviceIds: string[];
}

export interface MockDeviceAccess {
  contactsCount: number;
  galleryCount: number;
  callLogsCount: number;
  smsCount: number;
  appsCount: number;
  storageUsedGb: number;
  os: string;
  imei: string;
}

export interface MockDevice {
  id: string;
  model: string;
  status: DeviceStatus;
  contact: string;
  location: string;
  ip: string;
  address: string;
  customerId: string;
  workerId?: string;
  agentId?: string;
  /** Lock job stage: awaiting → in_progress → completed */
  assignmentStatus: DeviceAssignmentStatus;
  updatedAt: string;
  access: MockDeviceAccess;
}

export interface MockTransaction {
  id: string;
  amountTk: number;
  points: number;
  status: TransactionStatus;
  workerId: string;
  agentId: string;
  customerId: string;
  deviceId?: string;
  createdAt: string;
  verifiedAt?: string;
  approvedAt?: string;
}

export interface MockDashboardStats {
  totalAgents: number;
  totalWorkers: number;
  totalCustomers: number;
  totalDevices: number;
  lockedPercent: number;
  autoSolvedPercent: number;
  unlockedPercent: number;
  pendingTk: number;
  approvedTk: number;
  todayVolumeTk: number;
}
