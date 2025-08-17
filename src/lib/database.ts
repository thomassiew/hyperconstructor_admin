/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "@/lib/mongodb";
import {
  User,
  Project,
  Workflow,
  WorkflowSchedule,
  WorkflowRun,
  DatabaseStats,
} from "@/types/database";

export async function getDatabaseStats(): Promise<DatabaseStats> {
  const { db } = await connectToDatabase();

  // Get users stats
  const usersCollection = db.collection("users");
  const totalUsers = await usersCollection.countDocuments();
  const withWallet = await usersCollection.countDocuments({
    walletAddress: { $exists: true, $ne: null },
  });
  const withHyperliquid = await usersCollection.countDocuments({
    "hyperliquidAccount.exists": true,
  });
  const recentlyActive = await usersCollection.countDocuments({
    updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  // Get projects stats
  const projectsCollection = db.collection("projects");
  const totalProjects = await projectsCollection.countDocuments();

  const projectsWithWorkflows = await db
    .collection("workflows")
    .distinct("projectId");

  const workflowCountPerProject = await db
    .collection("workflows")
    .aggregate([
      { $group: { _id: "$projectId", count: { $sum: 1 } } },
      { $group: { _id: null, avg: { $avg: "$count" } } },
    ])
    .toArray();

  // Get workflows stats
  const workflowsCollection = db.collection("workflows");
  const totalWorkflows = await workflowsCollection.countDocuments();
  const activeWorkflows = await workflowsCollection.countDocuments({
    isActive: true,
  });

  const nodesPerWorkflow = await workflowsCollection
    .aggregate([
      { $project: { nodeCount: { $size: "$nodes" } } },
      { $group: { _id: null, avg: { $avg: "$nodeCount" } } },
    ])
    .toArray();

  // Get schedules stats
  const schedulesCollection = db.collection("workflow_schedules");
  const totalSchedules = await schedulesCollection.countDocuments();
  const activeSchedules = await schedulesCollection.countDocuments({
    isActive: true,
  });
  const runningSchedules = await schedulesCollection.countDocuments({
    running: true,
  });
  const overdueSchedules = await schedulesCollection.countDocuments({
    isActive: true,
    nextRunAt: { $lt: new Date() },
    running: { $ne: true },
  });

  // Get runs stats
  const runsCollection = db.collection("workflow_runs");
  const totalRuns = await runsCollection.countDocuments();
  const successRuns = await runsCollection.countDocuments({
    status: "success",
  });
  const errorRuns = await runsCollection.countDocuments({ status: "error" });
  const runningRuns = await runsCollection.countDocuments({
    status: "running",
  });
  const last24hRuns = await runsCollection.countDocuments({
    startedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  return {
    users: {
      total: totalUsers,
      withWallet: withWallet,
      withHyperliquid: withHyperliquid,
      recentlyActive: recentlyActive,
    },
    projects: {
      total: totalProjects,
      withWorkflows: projectsWithWorkflows.length,
      avgWorkflowsPerProject: workflowCountPerProject[0]?.avg || 0,
    },
    workflows: {
      total: totalWorkflows,
      active: activeWorkflows,
      inactive: totalWorkflows - activeWorkflows,
      avgNodesPerWorkflow: nodesPerWorkflow[0]?.avg || 0,
    },
    schedules: {
      total: totalSchedules,
      active: activeSchedules,
      running: runningSchedules,
      overdue: overdueSchedules,
    },
    runs: {
      total: totalRuns,
      success: successRuns,
      error: errorRuns,
      running: runningRuns,
      last24h: last24hRuns,
    },
  };
}

export async function getUsers(limit = 50, skip = 0): Promise<User[]> {
  const { db } = await connectToDatabase();
  const users = await db
    .collection("users")
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  return users.map((user: any) => ({
    ...user,
    _id: user._id.toString(),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  }));
}

export async function getProjects(limit = 50, skip = 0): Promise<Project[]> {
  const { db } = await connectToDatabase();
  const projects = await db
    .collection("projects")
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  return projects.map((project: any) => ({
    ...project,
    _id: project._id.toString(),
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));
}

export async function getWorkflows(limit = 50, skip = 0): Promise<Workflow[]> {
  const { db } = await connectToDatabase();
  const workflows = await db
    .collection("workflows")
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  return workflows.map((workflow: any) => ({
    ...workflow,
    _id: workflow._id.toString(),
    createdAt: new Date(workflow.createdAt),
    updatedAt: new Date(workflow.updatedAt),
    lastExecutedAt: workflow.lastExecutedAt
      ? new Date(workflow.lastExecutedAt)
      : undefined,
  }));
}

export async function getWorkflowById(id: string): Promise<Workflow | null> {
  const { db } = await connectToDatabase();

  let workflow;
  try {
    const { ObjectId } = await import("mongodb");
    // Try as ObjectId first
    workflow = await db
      .collection("workflows")
      .findOne({ _id: new ObjectId(id) });
  } catch {
    // If ObjectId conversion fails, try as string
    workflow = await db.collection("workflows").findOne({ _id: id });
  }

  if (!workflow) return null;

  return {
    ...workflow,
    _id: workflow._id.toString(),
    createdAt: new Date(workflow.createdAt),
    updatedAt: new Date(workflow.updatedAt),
    lastExecutedAt: workflow.lastExecutedAt
      ? new Date(workflow.lastExecutedAt)
      : undefined,
  };
}

export async function getWorkflowSchedules(
  limit = 50,
  skip = 0
): Promise<WorkflowSchedule[]> {
  const { db } = await connectToDatabase();
  const schedules = await db
    .collection("workflow_schedules")
    .find()
    .sort({ nextRunAt: 1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  return schedules.map((schedule: any) => ({
    ...schedule,
    _id: schedule._id.toString(),
    nextRunAt: new Date(schedule.nextRunAt),
    createdAt: new Date(schedule.createdAt),
    updatedAt: new Date(schedule.updatedAt),
    lastEvaluatedAt: schedule.lastEvaluatedAt
      ? new Date(schedule.lastEvaluatedAt)
      : undefined,
    runningSince: schedule.runningSince
      ? new Date(schedule.runningSince)
      : undefined,
  }));
}

export async function getWorkflowRuns(
  limit = 50,
  skip = 0
): Promise<WorkflowRun[]> {
  const { db } = await connectToDatabase();
  const runs = await db
    .collection("workflow_runs")
    .find()
    .sort({ startedAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  return runs.map((run: any) => ({
    ...run,
    _id: run._id.toString(),
    startedAt: new Date(run.startedAt),
    finishedAt: run.finishedAt ? new Date(run.finishedAt) : undefined,
    logs:
      run.logs?.map((log: any) => ({
        ...log,
        ts: new Date(log.ts),
      })) || [],
  }));
}
