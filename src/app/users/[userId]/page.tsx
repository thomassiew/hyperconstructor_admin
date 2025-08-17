import { getUserWithRelations } from "@/lib/userRelations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(startedAt: Date, finishedAt?: Date) {
  const end = finishedAt || new Date();
  const durationMs = end.getTime() - startedAt.getTime();
  const seconds = Math.floor(durationMs / 1000);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  const userWithRelations = await getUserWithRelations(resolvedParams.userId);

  if (!userWithRelations) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="text-muted-foreground mt-2">
            The user you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <a
            href="/users"
            className="mt-4 inline-block text-primary hover:underline"
          >
            ← Back to Users
          </a>
        </div>
      </div>
    );
  }

  const { user, projects, workflows, schedules, runs, stats } =
    userWithRelations;

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <a
            href="/users"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Users
          </a>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-3xl font-bold tracking-tight">
            {user.username || "Unnamed User"}
          </h1>
        </div>
      </div>

      {/* User Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Username</div>
                <div className="text-sm text-muted-foreground">
                  {user.username || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  {user.email || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Privy ID</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {user.privyId}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wallet & Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Wallet Address</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {user.walletAddress
                    ? `${user.walletAddress.slice(
                        0,
                        10
                      )}...${user.walletAddress.slice(-8)}`
                    : "Not connected"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Hyperliquid</div>
                <div>
                  {user.hyperliquidAccount?.exists ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                      Account Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20">
                      No Account
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Projects:</span>
                <span className="font-semibold">{stats.totalProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Workflows:</span>
                <span className="font-semibold">{stats.totalWorkflows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active:</span>
                <span className="font-semibold text-green-600">
                  {stats.activeWorkflows}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Schedules:</span>
                <span className="font-semibold">{stats.activeSchedules}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Execution Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Runs:</span>
                <span className="font-semibold">{stats.totalExecutions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Successful:</span>
                <span className="font-semibold text-green-600">
                  {stats.successfulExecutions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Failed:</span>
                <span className="font-semibold text-red-600">
                  {stats.failedExecutions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate:</span>
                <span className="font-semibold">
                  {stats.totalExecutions > 0
                    ? Math.round(
                        (stats.successfulExecutions / stats.totalExecutions) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description || "No description"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {formatDate(project.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-muted-foreground">
                        {project._id}
                      </div>
                      <div className="text-sm font-medium">
                        {
                          workflows.filter((w) => w.projectId === project._id)
                            .length
                        }{" "}
                        workflows
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects found</p>
          )}
        </CardContent>
      </Card>

      {/* Workflows */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Workflows ({workflows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {workflow.name || "Untitled Workflow"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description || "No description"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {workflow.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20">
                          Inactive
                        </span>
                      )}
                      {workflow.lastExecutionStatus && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                            workflow.lastExecutionStatus === "success"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : workflow.lastExecutionStatus === "error"
                              ? "bg-red-50 text-red-700 ring-red-600/20"
                              : "bg-blue-50 text-blue-700 ring-blue-600/20"
                          }`}
                        >
                          {workflow.lastExecutionStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nodes:</span>
                      <span className="ml-2 font-medium">
                        {workflow.nodes?.length || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executions:</span>
                      <span className="ml-2 font-medium">
                        {workflow.totalExecutions || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Run:</span>
                      <span className="ml-2 font-medium">
                        {workflow.lastExecutedAt
                          ? formatDate(workflow.lastExecutedAt)
                          : "Never"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(workflow.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <a
                      href={`/workflows/${workflow._id}`}
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      View Workflow Details →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No workflows found</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Executions ({runs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {runs.length > 0 ? (
            <div className="space-y-3">
              {runs.slice(0, 10).map((run) => (
                <div key={run._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                          run.status === "success"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : run.status === "error"
                            ? "bg-red-50 text-red-700 ring-red-600/20"
                            : "bg-blue-50 text-blue-700 ring-blue-600/20"
                        }`}
                      >
                        {run.status}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                          run.mode === "prod"
                            ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                            : "bg-orange-50 text-orange-700 ring-orange-600/20"
                        }`}
                      >
                        {run.mode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {run.triggerSource}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(run.startedAt, run.finishedAt)}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs">{run.workflowId}</span>
                    <span className="text-muted-foreground">
                      {formatDate(run.startedAt)}
                    </span>
                  </div>
                  {run.error && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      {run.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No executions found</p>
          )}
        </CardContent>
      </Card>

      {/* Active Schedules */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Active Schedules ({schedules.filter((s) => s.isActive).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules
                .filter((s) => s.isActive)
                .map((schedule) => (
                  <div key={schedule._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                          {schedule.cronExpression}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Workflow: {schedule.workflowId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Next: {formatDate(schedule.nextRunAt)}
                        </div>
                        {schedule.running && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 mt-1">
                            Running
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
