import { connectToDatabase } from "@/lib/mongodb";
import {
  User,
  Project,
  Workflow,
  WorkflowSchedule,
  WorkflowRun,
} from "@/types/database";
import { ObjectId } from "mongodb";

export interface UserWithRelations {
  user: User;
  projects: Project[];
  workflows: Workflow[];
  schedules: WorkflowSchedule[];
  runs: WorkflowRun[];
  stats: {
    totalProjects: number;
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    lastActivity: Date | null;
    activeSchedules: number;
  };
}

export async function getUserWithRelations(userId: string): Promise<UserWithRelations | null> {
  const { db } = await connectToDatabase()
  
  console.log('Looking for user with ID:', userId)
  
  // Get the user - try both string and ObjectId formats
  let userDoc
  try {
    // First try as ObjectId
    userDoc = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    console.log('ObjectId query result:', !!userDoc)
  } catch {
    // If ObjectId conversion fails, try as string
    userDoc = await db.collection('users').findOne({ _id: userId })
    console.log('String query result:', !!userDoc)
  }
  
  if (!userDoc) {
    console.log('No user found with ID:', userId)
    return null
  }

  const user: User = {
    ...userDoc,
    _id: userDoc._id.toString(),
    createdAt: new Date(userDoc.createdAt),
    updatedAt: new Date(userDoc.updatedAt),
  }

  // Use the consistent string ID for queries
  const userIdString = userDoc._id.toString();

  // Get user's projects
  const projectDocs = await db
    .collection("projects")
    .find({ userId: userIdString })
    .sort({ createdAt: -1 })
    .toArray();

  const projects: Project[] = projectDocs.map((project: any) => ({
    ...project,
    _id: project._id.toString(),
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));

  const projectIds = projects.map((p) => p._id);

  // Get workflows for user's projects
  const workflowDocs = await db
    .collection("workflows")
    .find({ projectId: { $in: projectIds } })
    .sort({ createdAt: -1 })
    .toArray();

  const workflows: Workflow[] = workflowDocs.map((workflow: any) => ({
    ...workflow,
    _id: workflow._id.toString(),
    createdAt: new Date(workflow.createdAt),
    updatedAt: new Date(workflow.updatedAt),
    lastExecutedAt: workflow.lastExecutedAt
      ? new Date(workflow.lastExecutedAt)
      : undefined,
  }));

  const workflowIds = workflows.map((w) => w._id);

  // Get schedules for user's workflows
  const scheduleDocs = await db
    .collection("workflow_schedules")
    .find({ userId: userIdString })
    .sort({ nextRunAt: 1 })
    .toArray();

  const schedules: WorkflowSchedule[] = scheduleDocs.map((schedule: any) => ({
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

  // Get workflow runs for user
  const runDocs = await db
    .collection("workflow_runs")
    .find({ userId: userIdString })
    .sort({ startedAt: -1 })
    .limit(100) // Limit to most recent 100 runs
    .toArray();

  const runs: WorkflowRun[] = runDocs.map((run: any) => ({
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

  // Calculate stats
  const totalProjects = projects.length;
  const totalWorkflows = workflows.length;
  const activeWorkflows = workflows.filter((w) => w.isActive).length;
  const totalExecutions = workflows.reduce(
    (sum, w) => sum + (w.totalExecutions || 0),
    0
  );
  const successfulExecutions = runs.filter(
    (r) => r.status === "success"
  ).length;
  const failedExecutions = runs.filter((r) => r.status === "error").length;
  const activeSchedules = schedules.filter((s) => s.isActive).length;

  // Find last activity across all user actions
  const lastActivity = [
    user.updatedAt,
    ...projects.map((p) => p.updatedAt),
    ...workflows.map((w) => w.updatedAt),
    ...workflows.map((w) => w.lastExecutedAt).filter(Boolean),
    ...runs.map((r) => r.startedAt),
  ].reduce((latest, date) => {
    if (!date) return latest;
    return !latest || date > latest ? date : latest;
  }, null as Date | null);

  return {
    user,
    projects,
    workflows,
    schedules,
    runs,
    stats: {
      totalProjects,
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      lastActivity,
      activeSchedules,
    },
  };
}

export async function getAllUsersWithBasicStats() {
  const { db } = await connectToDatabase();

  const users = await db
    .collection("users")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const usersWithStats = await Promise.all(
    users.map(async (userDoc: any) => {
      const user: User = {
        ...userDoc,
        _id: userDoc._id.toString(),
        createdAt: new Date(userDoc.createdAt),
        updatedAt: new Date(userDoc.updatedAt),
      };

      // Get basic counts
      const projectCount = await db
        .collection("projects")
        .countDocuments({ userId: user._id });
      const workflowCount = await db.collection("workflows").countDocuments({
        projectId: {
          $in: await db
            .collection("projects")
            .distinct("_id", { userId: user._id }),
        },
      });
      const runCount = await db
        .collection("workflow_runs")
        .countDocuments({ userId: user._id });

      return {
        user,
        projectCount,
        workflowCount,
        runCount,
      };
    })
  );

  return usersWithStats;
}
