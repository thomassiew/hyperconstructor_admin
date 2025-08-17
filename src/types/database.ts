export interface User {
  _id: string;
  privyId: string;
  username?: string;
  email?: string;
  walletAddress?: string;
  hyperliquidAccount?: {
    exists: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  _id: string;
  projectId: string;
  name?: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  lastExecutedAt?: Date;
  lastExecutionStatus?: "success" | "error" | "running";
  lastExecutionError?: string;
  totalExecutions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowSchedule {
  _id: string;
  workflowId: string;
  projectId: string;
  userId: string;
  cronExpression: string;
  isActive: boolean;
  nextRunAt: Date;
  running?: boolean;
  runningSince?: Date;
  lastEvaluatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowRun {
  _id: string;
  workflowId: string;
  projectId: string;
  userId: string;
  mode: "prod" | "test";
  triggerSource: "cron" | "click" | "manual";
  status: "running" | "success" | "error";
  startedAt: Date;
  finishedAt?: Date;
  error?: string;
  logs: WorkflowRunLogEntry[];
  truncated?: boolean;
}

export interface WorkflowRunLogEntry {
  ts: Date;
  level: "info" | "warn" | "error";
  nodeId?: string;
  nodeType?: string;
  message: string;
  data?: any;
}

export interface DatabaseStats {
  users: {
    total: number;
    withWallet: number;
    withHyperliquid: number;
    recentlyActive: number;
  };
  projects: {
    total: number;
    withWorkflows: number;
    avgWorkflowsPerProject: number;
  };
  workflows: {
    total: number;
    active: number;
    inactive: number;
    avgNodesPerWorkflow: number;
  };
  schedules: {
    total: number;
    active: number;
    running: number;
    overdue: number;
  };
  runs: {
    total: number;
    success: number;
    error: number;
    running: number;
    last24h: number;
  };
}
